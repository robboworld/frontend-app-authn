import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';

// Actions
import {
  FORGOT_PASSWORD,
  forgotPasswordBegin,
  forgotPasswordForbidden,
  forgotPasswordServerError,
  forgotPasswordSuccess,
} from './actions';
import { forgotPassword } from './service';
import { describeError } from '../../robbo-errors';

// Services
export function* handleForgotPassword(action) {
  try {
    yield put(forgotPasswordBegin());

    yield call(forgotPassword, action.payload.email);

    yield put(forgotPasswordSuccess(action.payload.email));
  } catch (e) {
    if (e.response && e.response.status === 403) {
      yield put(forgotPasswordForbidden());
      logInfo(e);
    } else {
      // Robbo: the human text with the code and number (src/robbo-errors), also with no answer at all.
      yield put(forgotPasswordServerError(describeError(e)));
      logError(e);
    }
  }
}

export default function* saga() {
  yield takeEvery(FORGOT_PASSWORD.BASE, handleForgotPassword);
}
