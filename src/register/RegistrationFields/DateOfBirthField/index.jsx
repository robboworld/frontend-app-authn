/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import React from 'react';
import { useDispatch } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import { FormGroup } from '../../../common-components';
import { clearRegistrationBackendError } from '../../data/actions';
import { validateDateOfBirthField } from '../../data/utils';
import messages from '../../messages';

/**
 * Required date of birth field for Robbo registration (ISO YYYY-MM-DD via input[type=date]).
 */
const DateOfBirthField = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { handleErrorChange } = props;

  const handleOnBlur = (e) => {
    const fieldError = validateDateOfBirthField(e.target.value, formatMessage);
    handleErrorChange('date_of_birth', fieldError);
  };

  const handleOnFocus = () => {
    handleErrorChange('date_of_birth', '');
    dispatch(clearRegistrationBackendError('date_of_birth'));
  };

  return (
    <FormGroup
      {...props}
      type="date"
      value={props.value ?? ''}
      handleBlur={handleOnBlur}
      handleFocus={handleOnFocus}
      floatingLabel={formatMessage(messages['registration.robbo.dob.label'])}
    />
  );
};

DateOfBirthField.defaultProps = {
  errorMessage: '',
  value: '',
};

DateOfBirthField.propTypes = {
  errorMessage: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleErrorChange: PropTypes.func.isRequired,
};

export default DateOfBirthField;
