import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'register.page.title': {
    id: 'register.page.title',
    defaultMessage: 'Register | {siteName}',
    description: 'register page title',
  },
  // Field labels
  'registration.fullname.label': {
    id: 'registration.fullname.label',
    defaultMessage: 'Full name',
    description: 'Label / floating label for full name (Robbo; RU: ФИО)',
  },
  'registration.email.label': {
    id: 'registration.email.label',
    defaultMessage: 'Email',
    description: 'Label / floating label for email (Robbo)',
  },
  'registration.username.label': {
    id: 'registration.username.label',
    defaultMessage: 'Create a username',
    description: 'Label / floating label for username (Robbo; RU: Придумайте логин)',
  },
  'registration.password.label': {
    id: 'registration.password.label',
    defaultMessage: 'Create a password',
    description: 'Label / floating label for password (Robbo; RU: Придумайте пароль)',
  },
  'registration.country.label': {
    id: 'registration.country.label',
    defaultMessage: 'Country/Region',
    description: 'Placeholder for the country options dropdown.',
  },
  'registration.opt.in.label': {
    id: 'registration.opt.in.label',
    defaultMessage: 'I agree to receive news and mailings',
    description: 'Text for opt in option on register page (guest landing: Я согласен(а) получать новости и рассылки).',
  },
  'registration.robbo.honor.consent': {
    id: 'registration.robbo.honor.consent',
    defaultMessage: 'I give consent to {personalDataLink} on the terms of {privacyLink}',
    description: 'Robbo: honor_code checkbox, aligned with guest landing #registration',
  },
  'registration.robbo.honor.personal_data': {
    id: 'registration.robbo.honor.personal_data',
    defaultMessage: 'the processing of my personal data',
    description: 'Link text for personal data document (Robbo landing)',
  },
  'registration.robbo.honor.privacy': {
    id: 'registration.robbo.honor.privacy',
    defaultMessage: 'the privacy policy',
    description: 'Link text for privacy document (Robbo landing)',
  },
  'registration.robbo.company.label': {
    id: 'registration.robbo.company.label',
    defaultMessage: 'Company name',
    description: 'Company field label, aligned with guest landing',
  },
  'registration.robbo.honor.required_error': {
    id: 'registration.robbo.honor.required_error',
    defaultMessage: 'You must accept consent for the processing of your personal data',
    description: 'Validation when honor checkbox is not accepted (Robbo fallback)',
  },
  'registration.robbo.marketing.required_error': {
    id: 'registration.robbo.marketing.required_error',
    defaultMessage: 'You must agree to receive news and mailings',
    description: 'Validation when marketing opt-in is required and not checked (Robbo / guest landing parity)',
  },
  'registration.robbo.company.required_error': {
    id: 'registration.robbo.company.required_error',
    defaultMessage: 'Please enter a company name',
    description: 'Validation for company when required (Robbo fallback)',
  },
  'registration.robbo.company.invalid_error': {
    id: 'registration.robbo.company.invalid_error',
    defaultMessage: 'Incorrect company entry',
    description: 'Validation when company contains Latin letters (Robbo)',
  },
  'registration.robbo.phone.label': {
    id: 'registration.robbo.phone.label',
    defaultMessage: 'Phone number',
    description: 'Optional phone field label on registration (Robbo)',
  },
  'registration.robbo.phone.invalid_error': {
    id: 'registration.robbo.phone.invalid_error',
    defaultMessage: 'Enter a valid phone number for the selected country',
    description: 'Validation when phone format is invalid (Robbo)',
  },
  'registration.robbo.phone.help': {
    id: 'registration.robbo.phone.help',
    defaultMessage: 'Select your country code, then enter your phone number.',
    description: 'Help text for optional phone field on registration (Robbo)',
  },
  'registration.robbo.phone.country.aria': {
    id: 'registration.robbo.phone.country.aria',
    defaultMessage: 'Country code',
    description: 'Accessible label for phone country code selector (Robbo)',
  },
  // Help text
  'help.text.name': {
    id: 'help.text.name',
    defaultMessage: 'This full name will appear on any certificates you earn.',
    description: 'Help text for fullname field (RU: ФИО / сертификаты)',
  },
  'help.text.username.1': {
    id: 'help.text.username.1',
    defaultMessage: 'The username that will identify you in your courses.',
    description: 'Part of help text for username (RU: логин)',
  },
  'help.text.username.2': {
    id: 'help.text.username.2',
    defaultMessage: 'This can not be changed later.',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.email': {
    id: 'help.text.email',
    defaultMessage: 'For account activation and important updates',
    description: 'Help text for email field on registration page',
  },
  // Form buttons
  'create.account.for.free.button': {
    id: 'create.account.for.free.button',
    defaultMessage: 'Create an account for free',
    description: 'Label text for registration form submission button',
  },
  'create.account.cta.button': {
    id: 'create.account.cta.button',
    defaultMessage: '{label}',
    description: 'Label text for registration form submission button for those users who are landing through redirections',
  },
  // Institution login
  'register.institution.login.page.title': {
    id: 'register.institution.login.page.title',
    defaultMessage: 'Register with institution/campus credentials',
    description: 'Heading of institution page',
  },
  // Validation messages
  'empty.name.field.error': {
    id: 'empty.name.field.error',
    defaultMessage: 'Enter your full name',
    description: 'Error message for empty fullname field (RU: Введите ФИО)',
  },
  'empty.email.field.error': {
    id: 'empty.email.field.error',
    defaultMessage: 'Enter your email',
    description: 'Error message for empty email field',
  },
  'empty.username.field.error': {
    id: 'empty.username.field.error',
    defaultMessage: 'Username must be between 2 and 30 characters',
    description: 'Error message for empty username field (RU: логин 2–30 симв.)',
  },
  'empty.password.field.error': {
    id: 'empty.password.field.error',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty password field',
  },
  'empty.country.field.error': {
    id: 'empty.country.field.error',
    defaultMessage: 'Select your country or region of residence',
    description: 'Error message when no country/region is selected',
  },
  'invalid.country.field.error': {
    id: 'invalid.country.field.error',
    defaultMessage: 'Country must match with an option available in the dropdown.',
    description: 'Error message when country is invalid',
  },
  'email.do.not.match': {
    id: 'email.do.not.match',
    defaultMessage: 'The email addresses do not match.',
    description: 'Email not match to confirm email',
  },
  'email.invalid.format.error': {
    id: 'email.invalid.format.error',
    defaultMessage: 'Enter a valid email address',
    description: 'Validation error for invalid email address',
  },
  'username.validation.message': {
    id: 'username.validation.message',
    defaultMessage: 'Username must be between 2 and 30 characters',
    description: 'Error message for empty username field',
  },
  'name.validation.message': {
    id: 'name.validation.message',
    defaultMessage: 'Enter a valid full name',
    description: 'Validation when fullname contain URL (RU: ФИО)',
  },
  'registration.robbo.name.three_words_error': {
    id: 'registration.robbo.name.three_words_error',
    defaultMessage: 'Full name must contain three words separated by spaces',
    description: 'Validation when full name is not exactly three words (Robbo)',
  },
  'password.validation.message': {
    id: 'password.validation.message',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty or invalid password',
  },
  'username.format.validation.message': {
    id: 'username.format.validation.message',
    defaultMessage: 'Usernames can only contain letters (A-Z, a-z), numerals (0-9), underscores (_), and hyphens (-). Usernames cannot contain spaces',
    description: 'Validation message that appears when username format is invalid',
  },
  // Error messages
  'registration.request.failure.header': {
    id: 'registration.request.failure.header',
    defaultMessage: 'We couldn\'t create your account.',
    description: 'error message when registration failure.',
  },
  'registration.empty.form.submission.error': {
    id: 'registration.empty.form.submission.error',
    defaultMessage: 'Please check your responses and try again.',
    description: 'Error message that appears on top of the form when empty form is submitted',
  },
  'registration.request.server.error': {
    id: 'registration.request.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message for internal server error.',
  },
  'registration.rate.limit.error': {
    id: 'registration.rate.limit.error',
    defaultMessage: 'Too many failed registration attempts. Try again later.',
    description: 'Error message that appears when an anonymous user has made too many failed registration attempts',
  },
  'registration.tpa.session.expired': {
    id: 'registration.tpa.session.expired',
    defaultMessage: 'Registration using {provider} has timed out.',
    description: '',
  },
  'registration.tpa.authentication.failure': {
    id: 'registration.tpa.authentication.failure',
    defaultMessage: 'We are sorry, you are not authorized to access {platform_name} via this channel. '
        + 'Please contact your learning administrator or manager in order to access {platform_name}.'
        + '{lineBreak}{lineBreak}Error Details:{lineBreak}{errorMessage}',
    description: 'Error message third party authentication pipeline fails',
  },
  // Terms of Service and Honor Code
  'terms.of.service.and.honor.code': {
    id: 'terms.of.service.and.honor.code',
    defaultMessage: 'Terms of Service and Honor Code',
    description: 'Text for the hyperlink that redirects user to terms of service and honor code',
  },
  'privacy.policy': {
    id: 'privacy.policy',
    defaultMessage: 'Privacy Policy',
    description: 'Text for the hyperlink that redirects user to privacy policy',
  },
  'honor.code': {
    id: 'honor.code',
    defaultMessage: 'Honor Code',
    description: 'Text for the hyperlink that redirects user to the honor code',
  },
  'terms.of.service': {
    id: 'terms.of.service',
    defaultMessage: 'Terms of Service',
    description: 'Text for the hyperlink that redirects user to the terms of service',
  },
  // miscellaneous strings
  'registration.username.suggestion.label': {
    id: 'registration.username.suggestion.label',
    defaultMessage: 'Suggested:',
    description: 'Suggested usernames label text.',
  },
  'did.you.mean.alert.text': {
    id: 'did.you.mean.alert.text',
    defaultMessage: 'Did you mean',
    description: 'Did you mean alert suggestion',
  },
});

export default messages;
