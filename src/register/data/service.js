import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getHttpClient } from '@edx/frontend-platform/auth';
import * as QueryString from 'query-string';

export async function registerRequest(registrationInformation) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v2/account/registration/`,
      QueryString.stringify(registrationInformation),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  const lms = getConfig().LMS_BASE_URL;
  const defaultAfterRegister = getConfig().SEARCH_CATALOG_URL || `${lms}/courses`;

  return {
    redirectUrl: data.redirect_url || defaultAfterRegister,
    // Treat a successful HTTP response as a successful registration even if
    // an older/custom backend omits the legacy `success` flag.
    success: data.success ?? true,
    authenticatedUser: data.authenticated_user,
  };
}

export async function getFieldsValidations(formPayload) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const { data } = await getHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v1/validation/registration`,
      QueryString.stringify(formPayload),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  return {
    fieldValidations: data,
  };
}
