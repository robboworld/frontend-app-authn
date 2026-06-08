import React, { useState } from 'react';

import { Form, Icon, TransitionReplace } from '@openedx/paragon';
import { ExpandMore } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

const TelFormField = ({
  className,
  errorMessage,
  fieldData,
  handleBlur,
  handleFocus,
  onChangeHandler,
  value,
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const controlClassName = ['form-group__form-field', className].filter(Boolean).join(' ');

  const onFocus = (e) => {
    setHasFocus(true);
    if (handleFocus) { handleFocus(e); }
  };

  const onBlur = (e) => {
    setHasFocus(false);
    if (handleBlur) { handleBlur(e); }
  };

  return (
    <Form.Group controlId={fieldData.name} isInvalid={!!errorMessage}>
      <Form.Control
        className={controlClassName}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        name={fieldData.name}
        value={value}
        aria-invalid={Boolean(errorMessage)}
        onChange={(e) => onChangeHandler(e)}
        floatingLabel={fieldData.label}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <TransitionReplace>
        {hasFocus && fieldData.helpText ? (
          <Form.Control.Feedback type="default" key="help-text" className="d-block form-text-size">
            {fieldData.helpText}
          </Form.Control.Feedback>
        ) : <div key="empty" />}
      </TransitionReplace>
      {errorMessage && (
        <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

TelFormField.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  fieldData: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    helpText: PropTypes.string,
  }).isRequired,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func,
  onChangeHandler: PropTypes.func.isRequired,
  value: PropTypes.string,
};

TelFormField.defaultProps = {
  className: '',
  errorMessage: '',
  handleBlur: null,
  handleFocus: null,
  value: '',
};

const FormFieldRenderer = (props) => {
  let formField = null;
  const {
    className, errorMessage, fieldData, onChangeHandler, isRequired, value,
  } = props;

  // Match FormGroup (Email/Username/Password): same control class so floating-label fields span full form width
  const controlClassName = ['form-group__form-field', className].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    if (props.handleFocus) { props.handleFocus(e); }
  };

  const handleOnBlur = (e) => {
    if (props.handleBlur) { props.handleBlur(e); }
  };

  switch (fieldData.type) {
    case 'select': {
      if (!fieldData.options) {
        return null;
      }
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          <Form.Control
            className={controlClassName}
            as="select"
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            trailingElement={<Icon src={ExpandMore} />}
            floatingLabel={fieldData.label}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          >
            <option key="default" value="">{fieldData.label}</option>
            {fieldData.options.map(option => (
              <option className="data-hj-suppress" key={option[0]} value={option[0]}>{option[1]}</option>
            ))}
          </Form.Control>
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'textarea': {
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          <Form.Control
            className={controlClassName}
            as="textarea"
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            floatingLabel={fieldData.label}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          />
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'text': {
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          <Form.Control
            className={controlClassName}
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            floatingLabel={fieldData.label}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          />
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'tel': {
      formField = (
        <TelFormField
          className={className}
          errorMessage={errorMessage}
          fieldData={fieldData}
          handleBlur={handleOnBlur}
          handleFocus={handleFocus}
          onChangeHandler={onChangeHandler}
          value={value}
        />
      );
      break;
    }
    case 'checkbox': {
      formField = (
        <Form.Group isInvalid={!!(isRequired && errorMessage)}>
          <Form.Checkbox
            className={className}
            id={fieldData.name}
            checked={!!value}
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          >
            {fieldData.label}
          </Form.Checkbox>
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    default:
      break;
  }

  return formField;
};
FormFieldRenderer.defaultProps = {
  className: '',
  value: '',
  handleBlur: null,
  handleFocus: null,
  errorMessage: '',
  isRequired: false,
};

FormFieldRenderer.propTypes = {
  className: PropTypes.string,
  fieldData: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    helpText: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func,
  errorMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default FormFieldRenderer;
