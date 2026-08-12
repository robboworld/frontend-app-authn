import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Form, Hyperlink } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from '../../messages';

const HonorCode = (props) => {
  const { formatMessage } = useIntl();
  const {
    errorMessage, onChangeHandler, onBlur, onFocus, fieldType, value,
  } = props;

  const agreeUrl = getConfig().TOS_AND_HONOR_CODE || '#';
  const policyUrl = getConfig().PRIVACY_POLICY || '#';

  if (fieldType === 'tos_and_honor_code') {
    return (
      <Form.Group isInvalid={Boolean(errorMessage)} className="robbo-honor-consent micro text-muted mt-2" id="honor-code">
        <Form.Checkbox
          className="form-field--checkbox mt-0"
          id="honor-code-tos"
          checked={Boolean(value)}
          name="honor_code"
          onChange={onChangeHandler}
          onBlur={onBlur}
          onFocus={onFocus}
          aria-invalid={Boolean(errorMessage)}
        >
          <FormattedMessage
            id="registration.robbo.honor.consent"
            description="Robbo: same legal links as guest landing #registration"
            defaultMessage="I give consent to {personalDataLink} on the terms of {privacyLink}"
            values={{
              personalDataLink: (
                <Hyperlink
                  className="inline-link"
                  destination={agreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  showLaunchIcon={false}
                >
                  {formatMessage(messages['registration.robbo.honor.personal_data'])}
                </Hyperlink>
              ),
              privacyLink: (
                <Hyperlink
                  className="inline-link"
                  destination={policyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  showLaunchIcon={false}
                >
                  {formatMessage(messages['registration.robbo.honor.privacy'])}
                </Hyperlink>
              ),
            }}
          />
        </Form.Checkbox>
        {errorMessage && (
          <Form.Control.Feedback type="invalid" className="form-text-size" hasIcon={false}>
            {errorMessage}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }

  return (
    <div id="honor-code" className="micro text-muted">
      <Form.Checkbox
        className="form-field--checkbox mt-0"
        id="honor-code"
        checked={value}
        name="honor_code"
        value={value}
        onChange={onChangeHandler}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        <FormattedMessage
          id="register.page.honor.code"
          defaultMessage="I agree to the {platformName}&nbsp;{tosAndHonorCode}"
          description="Text that appears on registration form stating honor code"
          values={{
            platformName: getConfig().SITE_NAME,
            tosAndHonorCode: (
              <Hyperlink variant="muted" destination={agreeUrl} target="_blank" rel="noopener noreferrer">
                {formatMessage(messages['honor.code'])}
              </Hyperlink>
            ),
          }}
        />
      </Form.Checkbox>
      {errorMessage && (
        <Form.Control.Feedback type="invalid" className="form-text-size" hasIcon={false}>
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </div>
  );
};

HonorCode.defaultProps = {
  errorMessage: '',
  onChangeHandler: null,
  onBlur: null,
  onFocus: null,
  fieldType: 'honor_code',
  value: false,
};

HonorCode.propTypes = {
  errorMessage: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  fieldType: PropTypes.string,
  value: PropTypes.bool,
};

export default HonorCode;
