/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: Login interface return value
 */
export interface TokenModel {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
