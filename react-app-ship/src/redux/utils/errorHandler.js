/* @flow */
import _ from 'lodash';
import { replace } from 'react-router-redux';
import { handleShowToast } from './toast';
import log from './logs';

// ------------------------------------
// Constants
// ------------------------------------
export const ERROR_HANDLER = 'ERROR_HANDLER';
export const FORBIDDEN = 'FORBIDDEN';

// ------------------------------------
// Actions
// ------------------------------------
export function deliverErrorStatus(response, message) {
  return {
    type: ERROR_HANDLER,
    response: response.statusText,
    status: response.status,
    message,
  };
}

export function handleResponse(
  result: Object = {
    response: {},
    message: '',
  },
) {
  const response = result.response;
  const responseDetail = _.isNil(_.findKey(response, 'message')) ? '' : response.data.message;
  let message = '';
  return (dispatch) => {
    // if (response.data.message) {
    //   log.error('[errorHandler] origin error response description: ', response.data.message);
    // }
    log.error('[errorHandler] error message: %o. (%o)', responseDetail, response.status);
    switch (response.status) {
      case 401:
        dispatch(replace('/ship/login'));
        message = '您嘗試登入的帳號沒有權限查看此頁面！';
        break;
      case 403:
        dispatch(replace('/ship/login'));
        message = '請登入後使用！';
        if (response.data.message.search('NotFound') !== -1) {
          message = '帳號或密碼錯誤！';
        }
        break;
      case 404:
        message = '找不到連線對象，請回報網站管理員。';
        break;
      case 500:
        message = '伺服器連線發生錯誤，請稍候再試。';
        break;
      default:
        message = '發生未知錯誤，請稍候再試！';
        break;
    }
    dispatch(deliverErrorStatus(response, message));
    dispatch(handleShowToast(message));
  };
}

export const actions = {
  handleResponse,
  deliverErrorStatus,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {
  [ERROR_HANDLER]: (state = {}, action) => ({
    ...state,
    response: action.response,
    status: action.status,
    message: action.message,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  response: '',
  status: 0,
  message: '',
};

export default function errorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
