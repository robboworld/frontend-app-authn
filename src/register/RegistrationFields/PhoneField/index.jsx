import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getLocale } from '@edx/frontend-platform/i18n';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, TransitionReplace } from '@openedx/paragon';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
import ru from 'react-phone-number-input/locale/ru';

import messages from '../../messages';
import RobboPhoneCountrySelect from './RobboPhoneCountrySelect';

const PHONE_LABELS = { en, ru };

function getPhoneInputLabels() {
  const locale = getLocale();
  const base = locale?.startsWith('ru') ? 'ru' : 'en';
  return PHONE_LABELS[base] || en;
}

const PhoneField = ({
  name,
  value,
  label,
  helpText,
  errorMessage,
  onChange,
  onBlur,
  onFocus,
}) => {
  const { formatMessage } = useIntl();
  const [hasFocus, setHasFocus] = useState(false);
  const latestValueRef = useRef(value);
  const phoneLabels = useMemo(() => getPhoneInputLabels(), []);
  const countrySelectAriaLabel = formatMessage(messages['registration.robbo.phone.country.aria']);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  const handleFocus = () => {
    setHasFocus(true);
    if (onFocus) {
      onFocus(name);
    }
  };

  const handleBlur = () => {
    setHasFocus(false);
    if (onBlur) {
      onBlur(name, latestValueRef.current ?? '');
    }
  };

  const handleChange = (nextValue) => {
    const normalizedValue = nextValue ?? '';
    latestValueRef.current = normalizedValue;
    onChange(name, normalizedValue);
  };

  return (
    <Form.Group controlId={name} isInvalid={!!errorMessage}>
      <Form.Label className="pgn__form-label-floating">{label}</Form.Label>
      <PhoneInput
        className="robbo-phone-input form-group__form-field"
        name={name}
        value={value || undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        defaultCountry="RU"
        international
        labels={phoneLabels}
        countrySelectComponent={RobboPhoneCountrySelect}
        countrySelectProps={{
          'aria-label': countrySelectAriaLabel,
        }}
        numberInputProps={{
          id: name,
          autoComplete: 'tel',
          inputMode: 'tel',
          'aria-invalid': Boolean(errorMessage),
        }}
      />
      <TransitionReplace>
        {hasFocus && helpText ? (
          <Form.Control.Feedback type="default" key="help-text" className="d-block form-text-size">
            {helpText}
          </Form.Control.Feedback>
        ) : <div key="empty" />}
      </TransitionReplace>
      {errorMessage && (
        <Form.Control.Feedback id={`${name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

PhoneField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

PhoneField.defaultProps = {
  value: '',
  helpText: '',
  errorMessage: '',
  onBlur: null,
  onFocus: null,
};

export default PhoneField;
