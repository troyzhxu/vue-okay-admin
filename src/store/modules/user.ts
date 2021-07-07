import type { AuthToken, UserInfo } from '/#/store';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import { TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { TokenModel, LoginParams } from '/@/api/sys/model/userModel';
import { loginApi, getUserInfo, refreshToken } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import headerImg from '/@/assets/images/header.jpg';

interface UserState {
  token: Nullable<AuthToken>;
  userInfo: Nullable<UserInfo>;
  sessionTimeout?: boolean;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // token
    token: Persistent.getLocal(TOKEN_KEY),
    // user info
    userInfo: Persistent.getLocal<UserInfo>(USER_INFO_KEY),
    // Whether the login expired
    sessionTimeout: false,
  }),
  getters: {
    getIsLogin(): boolean {
      const t = this.token;
      return (
        !!t &&
        t.accessToken != undefined &&
        t.refreshToken != undefined &&
        t.expiresAt != undefined &&
        t.expiresAt > Date.now() / 1000
      );
    },
    getUserInfo(): Nullable<UserInfo> {
      return this.userInfo;
    },
    getUsername(): string {
      return this.userInfo?.username || '';
    },
    getNickname(): string {
      return this.userInfo?.nickname || this.getUsername;
    },
    getAvatar(): string {
      return this.userInfo?.avatar || headerImg;
    },
    getRoleList(): string[] {
      return this.userInfo?.roles || [];
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
  },
  actions: {
    setToken(model: TokenModel) {
      const token = {
        accessToken: model.accessToken,
        refreshToken: model.refreshToken,
        expiresAt: Date.now() / 1000 + model.expiresIn,
      };
      this.token = token;
      Persistent.setLocal(TOKEN_KEY, token);
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      Persistent.setLocal(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = null;
      Persistent.removeLocal(TOKEN_KEY);
      Persistent.removeLocal(USER_INFO_KEY);
      console.log('Store U: reset');
    },
    /**
     * @description: login
     */
    async login(params: LoginParams, showErr = true): Promise<UserInfo | null> {
      try {
        const token = await loginApi(params, showErr);
        // save token
        this.setToken(token);
        // get user info
        return await this.getUserInfoAction();
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async getUserInfoAction() {
      const userInfo = await getUserInfo();
      this.setUserInfo(userInfo);
      return userInfo;
    },

    async getAccessToken(): Promise<string | null> {
      const token = this.token;
      if (token && token.expiresAt > Date.now() / 1000 + 180 && token.accessToken) {
        // 还有 180 秒才过期
        return token.accessToken;
      }
      if (token && token.refreshToken) {
        // 刷新 Token
        try {
          const model = await refreshToken(token.refreshToken);
          this.setToken(model);
          return model.accessToken;
        } catch (error) {
          console.error('Store U: Token Refresh Error：', error);
        }
      }
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.api.timeoutMessage'),
        onOk: () => {
          this.logout();
        },
      });
      return null;
    },
    /**
     * @description: logout
     */
    logout() {
      this.resetState();
      router.push(PageEnum.BASE_LOGIN);
      console.log('Store U: logout');
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: () => {
          this.logout();
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
