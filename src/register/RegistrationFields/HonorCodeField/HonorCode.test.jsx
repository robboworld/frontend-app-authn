import React from 'react';

import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';

import { HonorCode } from '../index';

const IntlHonorCode = injectIntl(HonorCode);

describe('HonorCodeTest', () => {
  mergeConfig({
    PRIVACY_POLICY: 'https://robbo.ru/wp-content/uploads/policy.pdf',
    TOS_AND_HONOR_CODE: 'https://robbo.ru/wp-content/uploads/agree.pdf',
  });

  const changeHandler = jest.fn();

  beforeEach(() => {
    changeHandler.mockClear();
  });

  it('should render error msg if honor code is not checked', () => {
    const errorMessage = 'You must agree';
    const { container } = render(
      <IntlProvider locale="en">
        <IntlHonorCode
          errorMessage={errorMessage}
          onChangeHandler={changeHandler}
        />
      </IntlProvider>,
    );
    const errorElement = container.querySelector('.form-text-size');

    expect(errorElement.textContent).toEqual(errorMessage);
  });

  it('should render Honor code field (simple honor_code type)', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IntlHonorCode onChangeHandler={changeHandler} fieldType="honor_code" />
      </IntlProvider>,
    );

    const honorCodeField = container.querySelector('#honor-code');
    expect(honorCodeField).not.toBeNull();
  });

  it('should render Robbo-style consent for tos_and_honor_code', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IntlHonorCode fieldType="tos_and_honor_code" onChangeHandler={changeHandler} />
      </IntlProvider>,
    );
    const el = container.querySelector('#honor-code-tos');
    expect(el).not.toBeNull();
    expect(container.textContent).toContain('обработку своих персональных данных');
  });
});
