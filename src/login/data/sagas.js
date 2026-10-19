import { camelCaseObject } from '@edx/frontend-platform';
import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  LOGIN_REQUEST,
  loginRequestBegin,
  loginRequestFailure,
  loginRequestSuccess,
} from './actions';
import { FORBIDDEN_REQUEST, INTERNAL_SERVER_ERROR } from './constants';
import {
  loginRequest,
} from './service';
import { describeError } from '../../robbo-errors';

export function* handleLoginRequest(action) {
  try {
    yield put(loginRequestBegin());

    const { redirectUrl, success } = yield call(loginRequest, action.payload.creds);

    yield put(loginRequestSuccess(
      redirectUrl,
      success,
    ));
  } catch (e) {
    const statusCodes = [400];
    if (e.response) {
      const { status } = e.response;
      if (statusCodes.includes(status)) {
        yield put(loginRequestFailure(camelCaseObject(e.response.data)));
        logInfo(e);
      } else if (status === 403) {
        yield put(loginRequestFailure({ errorCode: FORBIDDEN_REQUEST }));
        logInfo(e);
      } else {
        // Robbo: the human text with the code and number (src/robbo-errors), not only "something went wrong".
        yield put(loginRequestFailure({ errorCode: INTERNAL_SERVER_ERROR, robboError: describeError(e) }));
        logError(e);
      }
    } else {
      // Robbo: no answer at all (no connection, the site restarting) used to leave the form silent.
      yield put(loginRequestFailure({ errorCode: INTERNAL_SERVER_ERROR, robboError: describeError(e) }));
      logError(e);
    }
  }
}

export default function* saga() {
  yield takeEvery(LOGIN_REQUEST.BASE, handleLoginRequest);
}
