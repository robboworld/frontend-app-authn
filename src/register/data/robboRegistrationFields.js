import messages from '../messages';

/**
 * Ensures honor + company exist in the field map used for Authn registration.
 * The marketing checkbox is driven only by MFE config; honor/company normally
 * come from GET /api/mfe_context → registrationFields.fields. If the LMS process
 * does not expose dynamic fields (stale settings, wrong worker, etc.), the API
 * can omit them and the UI would only show marketing. This merge restores the
 * second checkbox and the company field to match guest landing + backend.
 *
 * @param {Object|null|undefined} apiFields  fieldDescriptions from Redux (mfe_context.fields)
 * @param {function} formatMessage         react-intl formatMessage
 * @param {Object} [options]
 * @param {boolean} [options.requireMarketingOptIn]  если true — чекбокс рассылок обязателен (как на гостевом лендинге)
 * @returns {Object}
 */
export function mergeRobboRegistrationFieldDescriptions(apiFields, formatMessage, options = {}) {
  const { requireMarketingOptIn = false } = options;
  const d = { ...(apiFields && typeof apiFields === 'object' ? apiFields : {}) };

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

  if (!d.company) {
    d.company = {
      name: 'company',
      type: 'text',
      label: formatMessage(messages['registration.robbo.company.label']),
      error_message: formatMessage(messages['registration.robbo.company.required_error']),
    };
  }

  return d;
}
