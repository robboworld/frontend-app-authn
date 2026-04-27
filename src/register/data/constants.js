// Registration Fields
export const FIELDS = {
  COUNTRY: 'country',
  HONOR_CODE: 'honor_code',
  TERMS_OF_SERVICE: 'terms_of_service',
};

/** Debounce for async registration field checks (email/username) while typing. */
export const REGISTRATION_FIELD_VALIDATION_DEBOUNCE_MS = 450;

// Registration Error Codes
export const FORBIDDEN_REQUEST = 'forbidden-request';
export const FORM_SUBMISSION_ERROR = 'form-submission-error';
export const INTERNAL_SERVER_ERROR = 'internal-server-error';
export const TPA_AUTHENTICATION_FAILURE = 'tpa-authentication-failure';
export const TPA_SESSION_EXPIRED = 'tpa-session-expired';
