import {
  BACKUP_LOGIN_DATA,
  DISMISS_PASSWORD_RESET_BANNER,
  LOGIN_REQUEST,
} from './actions';
import { DEFAULT_STATE, PENDING_STATE } from '../../data/constants';
import { RESET_PASSWORD } from '../../reset-password';

export const defaultState = {
  loginErrorCode: '',
  loginErrorContext: {},
  loginResult: {},
  loginFormData: {
    formFields: {
      emailOrUsername: '', password: '',
    },
    errors: {
      emailOrUsername: '', password: '',
    },
  },
  shouldBackupState: false,
  showResetPasswordSuccessBanner: false,
  submitState: DEFAULT_STATE,
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case BACKUP_LOGIN_DATA.BASE:
      return {
        ...state,
        shouldBackupState: true,
      };
    case BACKUP_LOGIN_DATA.BEGIN:
      return {
        ...defaultState,
        loginFormData: { ...action.payload },
      };
    case LOGIN_REQUEST.BEGIN:
      return {
        ...state,
        showResetPasswordSuccessBanner: false,
        submitState: PENDING_STATE,
      };
    case LOGIN_REQUEST.SUCCESS:
      return {
        ...state,
        loginResult: action.payload,
      };
    case LOGIN_REQUEST.FAILURE: {
      // Saga passes the whole 400 body as `loginError` (email lives there, not on payload top-level).
      const loginError = action.payload.loginError || {};
      const email = action.payload.email ?? loginError?.email;
      const redirectUrl = action.payload.redirectUrl ?? loginError?.redirectUrl;
      return {
        ...state,
        loginErrorCode: loginError.errorCode,
        loginErrorContext: { ...loginError.context, email, redirectUrl },
        submitState: DEFAULT_STATE,
      };
    }
    case RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        showResetPasswordSuccessBanner: true,
      };
    case DISMISS_PASSWORD_RESET_BANNER: {
      return {
        ...state,
        showResetPasswordSuccessBanner: false,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
