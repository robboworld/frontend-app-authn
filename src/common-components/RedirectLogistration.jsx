/**
 * Modifications Copyright (C) 2026 Robbo <https://robbo.ru>. See NOTICE at repository root.
 */
import React, { useEffect, useRef } from 'react';

import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import {
  AUTHN_PROGRESSIVE_PROFILING, RECOMMENDATIONS, REDIRECT,
} from '../data/constants';
import { reachYandexGoal } from '../robbo-analytics/yandexMetrika';
import { setCookie } from '../data/utils';

const trimTrailingSlash = (url = '') => url.replace(/\/+$/, '');

const getDefaultCatalogUrl = () => getConfig().SEARCH_CATALOG_URL || `${getConfig().LMS_BASE_URL}/courses`;

/**
 * After registration the LMS usually returns the learner "home" URL (/dashboard), which then
 * redirects to the learner MFE ("My courses"). Treat that default as the course catalog unless
 * the user had an explicit ?next= (then the server returns that URL).
 * Path-based check avoids mismatches when LMS_BASE_URL and the API host differ slightly.
 */
const shouldRedirectToCatalog = (redirectUrl = '') => {
  const raw = (redirectUrl || '').trim();
  if (!raw) {
    return true;
  }

  const lmsBase = trimTrailingSlash(getConfig().LMS_BASE_URL || '');
  const baseForRelative = lmsBase ? `${lmsBase}/` : `${typeof window !== 'undefined' ? window.location.origin : ''}/`;

  let pathname = '';
  try {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      pathname = new URL(raw).pathname || '/';
    } else {
      pathname = new URL(raw, baseForRelative).pathname || '/';
    }
  } catch (e) {
    pathname = '';
  }

  const normalizedPath = (pathname || '/').replace(/\/+$/, '') || '/';
  if (normalizedPath === '/dashboard') {
    return true;
  }

  const normalizedRedirectUrl = trimTrailingSlash(raw);
  const normalizedDashboardUrl = trimTrailingSlash(`${lmsBase}/dashboard`);
  return normalizedRedirectUrl === normalizedDashboardUrl;
};

const RedirectLogistration = (props) => {
  const {
    authenticatedUser,
    finishAuthUrl,
    redirectUrl,
    redirectToProgressiveProfilingPage,
    success,
    optionalFields,
    redirectToRecommendationsPage,
    educationLevel,
    userId,
    registrationEmbedded,
    host,
    yandexGoalName,
  } = props;
  let finalRedirectUrl = '';

  const yandexGoalFiredRef = useRef(false);
  useEffect(() => {
    if (!success) {
      yandexGoalFiredRef.current = false;
      return;
    }
    if (!yandexGoalName || yandexGoalFiredRef.current) {
      return;
    }
    yandexGoalFiredRef.current = true;
    reachYandexGoal(yandexGoalName);
  }, [success, yandexGoalName]);

  if (success) {
    // If we're in a third party auth pipeline, we must complete the pipeline
    // once user has successfully logged in. Otherwise, redirect to the specified redirect url.
    // Note: For multiple enterprise use case, we need to make sure that user first visits the
    // enterprise selection page and then complete the auth workflow
    if (finishAuthUrl && !redirectUrl.includes(finishAuthUrl)) {
      finalRedirectUrl = getConfig().LMS_BASE_URL + finishAuthUrl;
    } else {
      finalRedirectUrl = shouldRedirectToCatalog(redirectUrl)
        ? getDefaultCatalogUrl()
        : redirectUrl;
    }

    // Redirect to Progressive Profiling after successful registration
    if (redirectToProgressiveProfilingPage) {
      // TODO: Do we still need this cookie?
      setCookie('van-504-returning-user', true);

      if (registrationEmbedded) {
        window.parent.postMessage({
          action: REDIRECT,
          redirectUrl: getConfig().POST_REGISTRATION_REDIRECT_URL,
        }, host);
        return null;
      }
      const registrationResult = { redirectUrl: finalRedirectUrl, success };
      return (
        <Navigate
          to={AUTHN_PROGRESSIVE_PROFILING}
          state={{
            registrationResult,
            optionalFields,
            authenticatedUser,
          }}
          replace
        />
      );
    }

    // Redirect to Recommendation page
    if (redirectToRecommendationsPage) {
      const registrationResult = { redirectUrl: finalRedirectUrl, success };
      return (
        <Navigate
          to={RECOMMENDATIONS}
          state={{
            registrationResult,
            educationLevel,
            userId,
          }}
          replace
        />
      );
    }

    if (registrationEmbedded) {
      window.parent.postMessage({
        action: REDIRECT,
        redirectUrl: finalRedirectUrl,
      }, host);
      return null;
    }

    window.location.href = finalRedirectUrl;
  }

  return null;
};

RedirectLogistration.defaultProps = {
  authenticatedUser: {},
  educationLevel: null,
  finishAuthUrl: null,
  success: false,
  redirectUrl: '',
  redirectToProgressiveProfilingPage: false,
  optionalFields: {},
  redirectToRecommendationsPage: false,
  userId: null,
  registrationEmbedded: false,
  host: '',
  yandexGoalName: '',
};

RedirectLogistration.propTypes = {
  authenticatedUser: PropTypes.shape({}),
  educationLevel: PropTypes.string,
  finishAuthUrl: PropTypes.string,
  success: PropTypes.bool,
  redirectUrl: PropTypes.string,
  redirectToProgressiveProfilingPage: PropTypes.bool,
  optionalFields: PropTypes.shape({}),
  redirectToRecommendationsPage: PropTypes.bool,
  userId: PropTypes.number,
  registrationEmbedded: PropTypes.bool,
  host: PropTypes.string,
  yandexGoalName: PropTypes.string,
};

export default RedirectLogistration;
