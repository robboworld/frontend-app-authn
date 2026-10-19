import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { Error } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import { FORM_SUBMISSION_ERROR, PASSWORD_RESET, PASSWORD_VALIDATION_ERROR } from './data/constants';
import messages from './messages';
import { RobboErrorDetails } from '../robbo-errors';

const ResetPasswordFailure = (props) => {
  const { formatMessage } = useIntl();
  const { errorCode, errorMsg, robboError } = props;

  let errorMessage = null;
  let details = null;
  let heading = formatMessage(messages['reset.password.failure.heading']);
  switch (errorCode) {
    case PASSWORD_RESET.FORBIDDEN_REQUEST:
      heading = formatMessage(messages['reset.server.rate.limit.error']);
      errorMessage = formatMessage(messages['rate.limit.error']);
      break;
    case PASSWORD_RESET.INTERNAL_SERVER_ERROR:
      // Robbo: what failed and the code with the number (src/robbo-errors) when the saga knows it.
      errorMessage = robboError ? robboError.message : formatMessage(messages['internal.server.error']);
      details = robboError && <RobboErrorDetails info={robboError} />;
      break;
    case PASSWORD_VALIDATION_ERROR:
      errorMessage = errorMsg;
     break;
    case FORM_SUBMISSION_ERROR:
      errorMessage = formatMessage(messages['reset.password.form.submission.error']);
      break;
    default:
      break;
  }

  if (errorMessage) {
    return (
      <Alert id="validation-errors" className="mb-5" variant="danger" icon={Error}>
        <Alert.Heading>{heading}</Alert.Heading>
        <p>{errorMessage}</p>
        {details}
      </Alert>
    );
  }

  return null;
};

ResetPasswordFailure.defaultProps = {
  errorCode: null,
  errorMsg: null,
  robboError: null,
};

ResetPasswordFailure.propTypes = {
  errorCode: PropTypes.string,
  errorMsg: PropTypes.string,
  robboError: PropTypes.shape({
    message: PropTypes.string,
    code: PropTypes.string,
  }),
};

export default ResetPasswordFailure;
