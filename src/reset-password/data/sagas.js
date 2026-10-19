import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  passwordResetFailure,
  RESET_PASSWORD,
  resetPasswordBegin,
  resetPasswordFailure,
  resetPasswordSuccess,
  VALIDATE_TOKEN,
  validateTokenBegin,
  validateTokenSuccess,
} from './actions';
import { PASSWORD_RESET, PASSWORD_VALIDATION_ERROR } from './constants';
import { resetPassword, validateToken } from './service';
import { describeError } from '../../robbo-errors';

// Services
export function* handleValidateToken(action) {
  try {
    yield put(validateTokenBegin());
    const data = yield call(validateToken, action.payload.token);
    const isValid = data.is_valid;
    if (isValid) {
      yield put(validateTokenSuccess(isValid, action.payload.token));
    } else {
      yield put(passwordResetFailure(PASSWORD_RESET.INVALID_TOKEN));
    }
  } catch (err) {
    if (err.response && err.response.status === 429) {
      yield put(passwordResetFailure(PASSWORD_RESET.FORBIDDEN_REQUEST));
      logInfo(err);
    } else {
      // Robbo: the human text with the code and number (src/robbo-errors), also with no answer at all.
      yield put(passwordResetFailure(PASSWORD_RESET.INTERNAL_SERVER_ERROR, describeError(err)));
      logError(err);
    }
  }
}

export function* handleResetPassword(action) {
  try {
    yield put(resetPasswordBegin());
    const data = yield call(resetPassword, action.payload.formPayload, action.payload.token, action.payload.params);
    const resetStatus = data.reset_status;
    const resetErrors = data.err_msg;

    if (resetStatus) {
      yield put(resetPasswordSuccess(resetStatus));
    } else if (data.token_invalid) {
      yield put(passwordResetFailure(PASSWORD_RESET.INVALID_TOKEN));
    } else {
      yield put(resetPasswordFailure(PASSWORD_VALIDATION_ERROR, resetErrors));
    }
  } catch (err) {
    if (err.response && err.response.status === 429) {
      yield put(resetPasswordFailure(PASSWORD_RESET.FORBIDDEN_REQUEST));
      logInfo(err);
    } else {
      // Robbo: the human text with the code and number (src/robbo-errors), also with no answer at all.
      yield put(resetPasswordFailure(PASSWORD_RESET.INTERNAL_SERVER_ERROR, null, describeError(err)));
      logError(err);
    }
  }
}

export default function* saga() {
  yield takeEvery(RESET_PASSWORD.BASE, handleResetPassword);
  yield takeEvery(VALIDATE_TOKEN.BASE, handleValidateToken);
}
