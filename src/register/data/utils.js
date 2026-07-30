import { snakeCaseObject } from '@edx/frontend-platform';

import { LETTER_REGEX, NUMBER_REGEX } from '../../data/constants';
import messages from '../messages';
import validateEmail from '../RegistrationFields/EmailField/validator';
import validateName from '../RegistrationFields/NameField/validator';
import validateUsername from '../RegistrationFields/UsernameField/validator';
import {
  isValidRobboPhoneNumber,
  normalizeRobboPhoneNumber,
  sanitizePhoneInput,
} from './phoneValidation';

export { normalizeRobboPhoneNumber, sanitizePhoneInput };

/**
 * It validates the password field value
 * @param value
 * @param formatMessage
 * @returns {string}
 */
export const validatePasswordField = (value, formatMessage) => {
  let fieldError = '';
  if (!value || !LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
    fieldError = formatMessage(messages['password.validation.message']);
  }
  return fieldError;
};

/**
 * Company name: required; Latin letters (a–z) are not accepted.
 */
/** English LMS validation text when gettext .mo is missing or locale is en. */
export const COMPANY_INVALID_SERVER_MESSAGES = new Set([
  'Incorrect company entry.',
  'Incorrect company entry',
]);

export const PHONE_INVALID_SERVER_MESSAGES = new Set([
  'Enter a valid phone number.',
  'Enter a valid phone number',
  "Phone number must start with '+' (optional) followed by digits (0-9) only.",
]);

export const NAME_THREE_WORDS_SERVER_MESSAGES = new Set([
  'Full name must contain three words separated by spaces.',
  'Full name must contain three words separated by spaces',
]);

/**
 * Map LMS company field error to MFE locale (API may return English).
 */
export const normalizeNameServerErrorMessage = (message, threeWordsErrorMessage) => {
  if (!message) {
    return message;
  }
  const trimmed = String(message).trim();
  if (NAME_THREE_WORDS_SERVER_MESSAGES.has(trimmed)) {
    return threeWordsErrorMessage;
  }
  return message;
};

export const normalizeCompanyServerErrorMessage = (message, invalidErrorMessage) => {
  if (!message) {
    return message;
  }
  const trimmed = String(message).trim();
  if (COMPANY_INVALID_SERVER_MESSAGES.has(trimmed)) {
    return invalidErrorMessage;
  }
  return message;
};

export const normalizePhoneServerErrorMessage = (message, invalidErrorMessage) => {
  if (!message) {
    return message;
  }
  const trimmed = String(message).trim();
  if (PHONE_INVALID_SERVER_MESSAGES.has(trimmed)) {
    return invalidErrorMessage;
  }
  return message;
};

export const validateCompanyField = (value, requiredErrorMessage, invalidErrorMessage) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return requiredErrorMessage;
  }
  if (LETTER_REGEX.test(trimmed)) {
    return invalidErrorMessage;
  }
  return '';
};

export const validatePhoneField = (value, invalidErrorMessage) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return '';
  }
  if (!isValidRobboPhoneNumber(trimmed)) {
    return invalidErrorMessage;
  }
  return '';
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Full years of age from ISO date of birth (YYYY-MM-DD) to today.
 * @param {string} isoDate
 * @returns {number|null}
 */
export const getAgeFromDateOfBirth = (isoDate) => {
  const trimmed = String(isoDate ?? '').trim();
  if (!ISO_DATE_RE.test(trimmed)) {
    return null;
  }
  const [year, month, day] = trimmed.split('-').map(Number);
  const dob = new Date(year, month - 1, day);
  if (
    Number.isNaN(dob.getTime())
    || dob.getFullYear() !== year
    || dob.getMonth() !== month - 1
    || dob.getDate() !== day
  ) {
    return null;
  }
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age -= 1;
  }
  return age;
};

/**
 * Validate required date of birth (ISO YYYY-MM-DD).
 * @param {string} value
 * @param {function} formatMessage
 * @returns {string} error message or empty string
 */
export const validateDateOfBirthField = (value, formatMessage) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return formatMessage(messages['registration.robbo.dob.required_error']);
  }
  if (!ISO_DATE_RE.test(trimmed)) {
    return formatMessage(messages['registration.robbo.dob.invalid_error']);
  }
  const [year, month, day] = trimmed.split('-').map(Number);
  const dob = new Date(year, month - 1, day);
  if (
    Number.isNaN(dob.getTime())
    || dob.getFullYear() !== year
    || dob.getMonth() !== month - 1
    || dob.getDate() !== day
  ) {
    return formatMessage(messages['registration.robbo.dob.invalid_error']);
  }
  if (year < 1900) {
    return formatMessage(messages['registration.robbo.dob.invalid_error']);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dob > today) {
    return formatMessage(messages['registration.robbo.dob.future_error']);
  }
  return '';
};

/**
 * It accepts complete registration data as payload and checks if the form is valid.
 * @param payload
 * @param errors
 * @param configurableFormFields
 * @param fieldDescriptions
 * @param formatMessage
 * @returns {{fieldErrors, isValid: boolean}}
 */
export const isFormValid = (
  payload,
  errors,
  configurableFormFields,
  fieldDescriptions,
  formatMessage,
) => {
  const fieldErrors = { ...errors };
  let isValid = true;
  let emailSuggestion = { suggestion: '', type: '' };

  Object.keys(payload).forEach(key => {
    switch (key) {
    case 'name':
      if (!fieldErrors.name) {
        fieldErrors.name = validateName(payload.name, formatMessage);
      }
      if (fieldErrors.name) { isValid = false; }
      break;
    case 'email': {
      if (!fieldErrors.email) {
        const {
          fieldError, confirmEmailError, suggestion,
        } = validateEmail(payload.email, configurableFormFields?.confirm_email, formatMessage);
        if (fieldError) {
          fieldErrors.email = fieldError;
          isValid = false;
        }
        if (confirmEmailError) {
          fieldErrors.confirm_email = confirmEmailError;
          isValid = false;
        }
        emailSuggestion = suggestion;
      }
      if (fieldErrors.email) { isValid = false; }
      break;
    }
    case 'username':
      if (!fieldErrors.username) {
        fieldErrors.username = validateUsername(payload.username, formatMessage);
      }
      if (fieldErrors.username) { isValid = false; }
      break;
    case 'password':
      if (!fieldErrors.password) {
        fieldErrors.password = validatePasswordField(payload.password, formatMessage);
      }
      if (fieldErrors.password) { isValid = false; }
      break;
    default:
      break;
    }
  });

  // Don't validate when country field is optional or hidden and not present on registration form
  if (configurableFormFields?.country && !configurableFormFields.country?.displayValue) {
    fieldErrors.country = formatMessage(messages['empty.country.field.error']);
    isValid = false;
  } else if (configurableFormFields?.country && !configurableFormFields.country?.countryCode) {
    fieldErrors.country = formatMessage(messages['invalid.country.field.error']);
    isValid = false;
  }

  Object.keys(fieldDescriptions).forEach(key => {
    if (key === 'phone_number' || key === 'date_of_birth') {
      return;
    }
    if (key === 'country' && !configurableFormFields?.country?.displayValue) {
      fieldErrors[key] = formatMessage(messages['empty.country.field.error']);
    } else if (!configurableFormFields[key]) {
      fieldErrors[key] = fieldDescriptions[key].error_message;
    }
    if (fieldErrors[key]) { isValid = false; }
  });

  if (fieldDescriptions.phone_number) {
    const rawPhone = configurableFormFields.phone_number ?? payload.phone_number ?? '';
    const phoneValue = rawPhone ? normalizeRobboPhoneNumber(rawPhone) : '';
    const invalidPhoneMessage = fieldDescriptions.phone_number.invalid_error_message
      || formatMessage(messages['registration.robbo.phone.invalid_error']);
    const phoneError = validatePhoneField(phoneValue, invalidPhoneMessage);
    if (phoneError) {
      fieldErrors.phone_number = phoneError;
      isValid = false;
    }
  }

  if (fieldDescriptions.date_of_birth) {
    const dobValue = configurableFormFields.date_of_birth ?? payload.date_of_birth ?? '';
    const dobError = validateDateOfBirthField(dobValue, formatMessage);
    if (dobError) {
      fieldErrors.date_of_birth = dobError;
      isValid = false;
    }
  }

  return { isValid, fieldErrors, emailSuggestion };
};

/**
 * It prepares a payload for registration data that can be passed to registration API endpoint.
 * @param initPayload
 * @param configurableFormFields
 * @param showMarketingEmailOptInCheckbox
 * @param totalRegistrationTime
 * @param queryParams
 * @returns {*}
 */
export const prepareRegistrationPayload = (
  initPayload,
  configurableFormFields,
  showMarketingEmailOptInCheckbox,
  totalRegistrationTime,
  queryParams,
) => {
  let payload = { ...initPayload };
  Object.keys(configurableFormFields).forEach((fieldName) => {
    if (fieldName === 'country') {
      payload[fieldName] = configurableFormFields[fieldName].countryCode;
    } else if (fieldName === 'phone_number') {
      const raw = configurableFormFields[fieldName];
      payload[fieldName] = raw ? normalizeRobboPhoneNumber(raw) : raw;
    } else {
      payload[fieldName] = configurableFormFields[fieldName];
    }
  });

  // Don't send the marketing email opt-in value if the flag is turned off
  if (!showMarketingEmailOptInCheckbox) {
    delete payload.marketingEmailsOptIn;
  }

  delete payload.company;

  payload.totalRegistrationTime = totalRegistrationTime;
  payload = snakeCaseObject(payload);

  // add query params to the payload
  payload = { ...payload, ...queryParams };

  // Default post-registration destination: course catalog. Skip when enrollment / purchase
  // query params are present so the LMS finish_auth flow keeps the right next= chain.
  const enrollmentOrPurchaseKeys = [
    'course_id', 'enrollment_action', 'course_mode', 'email_opt_in', 'purchase_workflow',
  ];
  const hasEnrollmentContext = enrollmentOrPurchaseKeys.some(
    (k) => queryParams[k] != null && queryParams[k] !== '',
  );
  if (!hasEnrollmentContext && (payload.next == null || payload.next === '')) {
    payload.next = '/courses';
  }

  return payload;
};
