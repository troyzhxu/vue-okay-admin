import { defHttp } from '/@/utils/http';
import { LoginParams, TokenModel } from './model/userModel';
import { UserInfo } from '/#/store';

enum Api {
  Login = '/login',
  TokenRefresh = '/access-token',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, showErr = true) {
  return defHttp.post<TokenModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: showErr ? 'modal' : 'none',
    }
  );
}

/**
 * @description: 刷新 Token
 */
export function refreshToken(refreshToken: string) {
  return defHttp.post<TokenModel>(
    {
      url: Api.TokenRefresh,
      data: { refreshToken },
    },
    {
      withToken: false,
      errorMessageMode: 'none',
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<UserInfo>({ url: Api.GetUserInfo });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}
