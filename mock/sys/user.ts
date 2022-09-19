import { MockMethod } from 'vite-plugin-mock';

export default [
  // mock user login
  {
    url: '/basic-api/login',
    timeout: 200,
    method: 'post',
    response: () => {
      return {
        accessToken: 'xxxxxxxxxxxxxxxxxxxxx',
        refreshToken: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        expiresIn: 3600,
      };
    },
  },
  {
    url: '/basic-api/getUserInfo',
    method: 'get',
    response: () => {
      return {
        userId: '1',
        username: 'okay',
        nickname: 'OkayAdmin',
        avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
        token: 'fakeToken1',
        roles: ['Super Admin'],
        authorities: [],
      };
    },
  },
  {
    url: '/basic-api/getPermCode',
    timeout: 200,
    method: 'get',
    response: () => {
      return ['1000', '3000', '5000'];
    },
  },
  {
    url: '/basic-api/testRetry',
    statusCode: 405,
    method: 'get',
    response: () => {
      return resultError('Error!');
    },
  },
] as MockMethod[];
