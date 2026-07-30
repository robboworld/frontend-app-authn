import messages from '../messages';

/** Registration fields removed from Authn UI (LMS may still list them in stale site config). */
export const ROBBO_HIDDEN_REGISTRATION_FIELD_NAMES = ['company'];

/**
 * @param {Object|null|undefined} fields
 * @returns {Object}
 */
export function omitRobboHiddenRegistrationFields(fields) {
  if (!fields || typeof fields !== 'object') {
    return fields;
  }
  const next = { ...fields };
  ROBBO_HIDDEN_REGISTRATION_FIELD_NAMES.forEach((name) => {
    delete next[name];
  });
  return next;
}

/**
 * Ensures honor (+ optional phone) exist in the field map used for Authn registration.
 * The marketing checkbox is driven only by MFE config; honor normally comes from
 * GET /api/mfe_context → registrationFields.fields. If the LMS process does not
 * expose dynamic fields (stale settings, wrong worker, etc.), the API can omit
 * them and the UI would only show marketing. This merge restores the checkbox
 * blocks to match guest landing + backend.
 *
 * @param {Object|null|undefined} apiFields  fieldDescriptions from Redux (mfe_context.fields)
 * @param {function} formatMessage         react-intl formatMessage
 * @param {Object} [options]
 * @param {boolean} [options.requireMarketingOptIn]  если true — чекбокс рассылок обязателен (как на гостевом лендинге)
 * @returns {Object}
 */
export function mergeRobboRegistrationFieldDescriptions(apiFields, formatMessage, options = {}) {
  const { requireMarketingOptIn = false } = options;
  const d = omitRobboHiddenRegistrationFields(
    apiFields && typeof apiFields === 'object' ? apiFields : {},
  );

  if (requireMarketingOptIn) {
    d.marketingEmailsOptIn = {
      name: 'marketingEmailsOptIn',
      type: 'checkbox',
      error_message: formatMessage(messages['registration.robbo.marketing.required_error']),
    };
  }

  if (!d.honor_code) {
    d.honor_code = {
      name: 'honor_code',
      type: 'tos_and_honor_code',
      error_message: formatMessage(messages['registration.robbo.honor.required_error']),
    };
  }

  if (!d.phone_number) {
    d.phone_number = {
      name: 'phone_number',
      type: 'tel',
      label: formatMessage(messages['registration.robbo.phone.label']),
      invalid_error_message: formatMessage(messages['registration.robbo.phone.invalid_error']),
    };
  } else if (!d.phone_number.invalid_error_message) {
    d.phone_number = {
      ...d.phone_number,
      invalid_error_message: formatMessage(messages['registration.robbo.phone.invalid_error']),
    };
  }

  if (!d.date_of_birth) {
    d.date_of_birth = {
      name: 'date_of_birth',
      type: 'text',
      label: formatMessage(messages['registration.robbo.dob.label']),
      error_message: formatMessage(messages['registration.robbo.dob.required_error']),
      required: true,
    };
  } else {
    d.date_of_birth = {
      ...d.date_of_birth,
      label: d.date_of_birth.label || formatMessage(messages['registration.robbo.dob.label']),
      error_message: d.date_of_birth.error_message
        || formatMessage(messages['registration.robbo.dob.required_error']),
    };
  }

  return d;
}
