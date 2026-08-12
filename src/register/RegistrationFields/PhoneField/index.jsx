import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getLocale } from '@edx/frontend-platform/i18n';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, TransitionReplace } from '@openedx/paragon';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
import ru from 'react-phone-number-input/locale/ru';

import messages from '../../messages';
import { rewriteRuLeadingEightyNine } from '../../data/phoneValidation';
import RobboPhoneCountrySelect from './RobboPhoneCountrySelect';

const PHONE_LABELS = { en, ru };

function getPhoneInputLabels() {
  const locale = getLocale();
  const base = locale?.startsWith('ru') ? 'ru' : 'en';
  return PHONE_LABELS[base] || en;
}

/**
 * Keep a leading "+" visible while International is selected and no national
 * digits have been entered (react-phone-number-input leaves the field blank
 * without a defaultCountry).
 */
const RobboPhoneDigitsInput = React.forwardRef(({ value, onChange, onFocus, ...rest }, ref) => {
  const inputRef = useRef(null);
  const displayValue = value ? value : '+';

  const setRefs = (node) => {
    inputRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      // eslint-disable-next-line no-param-reassign
      ref.current = node;
    }
  };

  const placeCaretAfterPlus = (input) => {
    if (!input || !input.value.startsWith('+')) {
      return;
    }
    // Always pin caret at or after index 1 (never before "+").
    const start = Math.max(input.selectionStart ?? 1, 1);
    const end = Math.max(input.selectionEnd ?? start, 1);
    try {
      input.setSelectionRange(start, end);
    } catch (e) {
      // ignore
    }
  };

  const handleFocus = (event) => {
    const input = event.target;
    // Multiple deferred passes — PhoneInput/smartCaret resets selection after focus.
    placeCaretAfterPlus(input);
    requestAnimationFrame(() => placeCaretAfterPlus(input));
    setTimeout(() => placeCaretAfterPlus(input), 0);
    setTimeout(() => placeCaretAfterPlus(input), 20);
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleSelect = (event) => {
    placeCaretAfterPlus(event.target);
  };

  const handleMouseUp = (event) => {
    placeCaretAfterPlus(event.target);
  };

  const handleKeyDown = (event) => {
    const input = event.target;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    // Do not let the caret sit before "+", and do not delete the "+".
    if (
      (event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'Backspace')
      && start <= 1
      && end <= 1
      && input.value.startsWith('+')
    ) {
      if (event.key === 'Backspace' && start === 1 && end === 1) {
        event.preventDefault();
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'Home') {
        event.preventDefault();
        input.setSelectionRange(1, 1);
      }
    }
  };

  const handleChange = (event) => {
    let next = event.target.value ?? '';
    if (!next.startsWith('+')) {
      next = `+${next.replace(/[^\d]/g, '')}`;
    }
    if (next === '') {
      next = '+';
    }
    // Domestic mobile trunk 89… → +79… (Russian mobile).
    next = rewriteRuLeadingEightyNine(next);
    onChange({
      ...event,
      target: {
        ...event.target,
        value: next,
      },
    });
    requestAnimationFrame(() => placeCaretAfterPlus(inputRef.current));
  };

  return (
    <input
      {...rest}
      ref={setRefs}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onSelect={handleSelect}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
    />
  );
});

RobboPhoneDigitsInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
};

RobboPhoneDigitsInput.defaultProps = {
  value: '',
  onFocus: undefined,
};

RobboPhoneDigitsInput.displayName = 'RobboPhoneDigitsInput';

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
  const didSeedPlusRef = useRef(false);
  const phoneLabels = useMemo(() => getPhoneInputLabels(), []);
  const countrySelectAriaLabel = formatMessage(messages['registration.robbo.phone.country.aria']);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  // Seed form state with "+" once so blur/submit see the same default as the UI.
  useEffect(() => {
    if (didSeedPlusRef.current) {
      return;
    }
    didSeedPlusRef.current = true;
    if (!value) {
      onChange(name, '+');
    }
  }, [name, onChange, value]);

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
    // Library yields undefined when only "+" remains; keep "+" as the empty default.
    let normalizedValue = nextValue || '+';
    normalizedValue = rewriteRuLeadingEightyNine(normalizedValue) || '+';
    latestValueRef.current = normalizedValue;
    onChange(name, normalizedValue);
  };

  // E.164 for PhoneInput: lone "+" is not a number — pass undefined so International stays selected.
  const phoneInputValue = value && value !== '+' ? value : undefined;

  return (
    <Form.Group controlId={name} isInvalid={!!errorMessage}>
      <Form.Label className="pgn__form-label-floating">{label}</Form.Label>
      <PhoneInput
        className="robbo-phone-input form-group__form-field"
        name={name}
        value={phoneInputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // International (🌐) by default; field shows "+" until the user picks a country / digits.
        international
        addInternationalOption
        smartCaret={false}
        inputComponent={RobboPhoneDigitsInput}
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
