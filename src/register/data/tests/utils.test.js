import { isFormValid, prepareRegistrationPayload } from '../utils';

describe('Payload validation', () => {
  let formatMessage;
  let configurableFormFields;
  let fieldDescriptions;

  beforeEach(() => {
    formatMessage = jest.fn(msg => msg);
    configurableFormFields = {
      confirm_email: true,
    };
    fieldDescriptions = {};
  });

  test('validates name field correctly', () => {
    const payload = { name: ' ' };
    const errors = {};
    const { isValid, fieldErrors } = isFormValid(
      payload,
      errors,
      configurableFormFields,
      fieldDescriptions,
      formatMessage);

    expect(fieldErrors.name).toBeDefined();
    expect(isValid).toBe(false);
  });

  test('validates email field correctly', () => {
    const payload = { email: 'invalid-email' };
    const errors = {};
    const { isValid, fieldErrors } = isFormValid(
      payload, errors, configurableFormFields, fieldDescriptions, formatMessage);

    expect(fieldErrors.email).toBeDefined();
    expect(isValid).toBe(false);
  });

  test('validates username field correctly', () => {
    const payload = { username: 'invalid username' };
    const errors = {};
    const { isValid, fieldErrors } = isFormValid(
      payload, errors, configurableFormFields, fieldDescriptions, formatMessage);

    expect(fieldErrors.username).toBeDefined();
    expect(isValid).toBe(false);
  });

  test('validates password field correctly', () => {
    const payload = { password: 'short' };
    const errors = {};
    const { isValid, fieldErrors } = isFormValid(
      payload, errors, configurableFormFields, fieldDescriptions, formatMessage);

    expect(fieldErrors.password).toBeDefined();
    expect(isValid).toBe(false);
  });

  test('validates multiple fields correctly', () => {
    const payload = {
      name: 'InvalidName!',
      email: 'invalid-email',
      username: 'invalid username',
      password: 'short',
    };
    const errors = {};
    const { isValid, fieldErrors } = isFormValid(
      payload, errors, configurableFormFields, fieldDescriptions, formatMessage);

    expect(fieldErrors.name).toBeDefined();
    expect(fieldErrors.email).toBeDefined();
    expect(fieldErrors.username).toBeDefined();
    expect(fieldErrors.password).toBeDefined();
    expect(isValid).toBe(false);
  });

  test('requires marketing opt-in when described in fieldDescriptions', () => {
    const payload = { name: 'Valid Good User', email: 'a@b.co', username: 'user1', password: 'a1b2c3d4' };
    const errors = {};
    const fieldDescriptions = {
      marketingEmailsOptIn: {
        name: 'marketingEmailsOptIn',
        type: 'checkbox',
        error_message: 'marketing-required',
      },
    };
    const { isValid, fieldErrors } = isFormValid(
      payload,
      errors,
      { ...configurableFormFields, marketingEmailsOptIn: false },
      fieldDescriptions,
      formatMessage,
    );
    expect(fieldErrors.marketingEmailsOptIn).toBe('marketing-required');
    expect(isValid).toBe(false);
  });

  test('passes when marketing opt-in is checked and described as required', () => {
    const payload = { name: 'Valid Good User', email: 'a@b.co', username: 'user1', password: 'a1b2c3d4' };
    const errors = {};
    const fieldDescriptions = {
      marketingEmailsOptIn: {
        name: 'marketingEmailsOptIn',
        type: 'checkbox',
        error_message: 'marketing-required',
      },
    };
    const { isValid, fieldErrors } = isFormValid(
      payload,
      errors,
      { marketingEmailsOptIn: true },
      fieldDescriptions,
      formatMessage,
    );
    expect(fieldErrors.marketingEmailsOptIn).toBeUndefined();
    expect(isValid).toBe(true);
  });
});

describe('prepareRegistrationPayload', () => {
  const base = {
    name: 'N',
    email: 'a@b.co',
    username: 'u',
    password: 'a1b2c3d4',
    country: 'US',
    honor_code: true,
  };

  test('adds next=/courses when no query next and not an enrollment flow', () => {
    const payload = prepareRegistrationPayload(
      { ...base },
      {},
      false,
      0,
      {},
    );
    expect(payload.next).toBe('/courses');
  });

  test('does not override an explicit next from query params', () => {
    const payload = prepareRegistrationPayload(
      { ...base },
      {},
      false,
      0,
      { next: '/some/path' },
    );
    expect(payload.next).toBe('/some/path');
  });

  test('does not set default next when course_id is in query', () => {
    const payload = prepareRegistrationPayload(
      { ...base },
      {},
      false,
      0,
      { course_id: 'course-v1:org+course+run' },
    );
    expect(payload.next).toBeUndefined();
  });
});
