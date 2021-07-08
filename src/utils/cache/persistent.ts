import { toRaw } from 'vue';
import { RouteLocationNormalized } from 'vue-router';
import { LockInfo, AuthToken, UserInfo } from '/#/store';
import { LocaleSetting, ProjectConfig } from '/#/config';
import { createLocalStorage, createSessionStorage } from '/@/utils/cache';
import {
  LOCALE_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  ROLES_KEY,
  LOCK_INFO_KEY,
  PROJ_CFG_KEY,
  MULTIPLE_TABS_KEY,
} from '/@/enums/cacheEnum';

interface BasicStore {
  [LOCALE_KEY]: LocaleSetting;
  [TOKEN_KEY]: AuthToken;
  [USER_INFO_KEY]: UserInfo;
  [ROLES_KEY]: string[];
  [LOCK_INFO_KEY]: LockInfo;
  [PROJ_CFG_KEY]: ProjectConfig;
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
}

type LocalStore = BasicStore;

type SessionStore = BasicStore;

export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const ls = createLocalStorage();
const ss = createSessionStorage();

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    return ls.get(key) as Nullable<T>;
  }

  /**
   * 默认一周过期
   */
  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys]): void {
    ls.set(key, toRaw(value));
    console.log('LS:Set ' + key);
  }

  /**
   * 永久不过期
   */
  static setLocalForever(key: LocalKeys, value: LocalStore[LocalKeys]): void {
    ls.set(key, toRaw(value), null);
    console.log('LS:Set ' + key);
  }

  static removeLocal(key: LocalKeys): void {
    ls.remove(key);
    console.log('LS:Remove ' + key);
  }

  static clearLocal(): void {
    ls.clear();
    console.log('LS:Clear');
  }

  static getSession<T>(key: SessionKeys) {
    return ss.get(key) as Nullable<T>;
  }

  static setSession(key: SessionKeys, value: SessionStore[SessionKeys]): void {
    ss.set(key, toRaw(value));
    console.log('SS:Set ' + key);
  }

  static removeSession(key: SessionKeys): void {
    ss.remove(key);
    console.log('SS:Remove ' + key);
  }
  static clearSession(): void {
    ss.clear();
    console.log('SS:Clear');
  }

  static clearAll() {
    Persistent.clearLocal();
    Persistent.clearSession();
  }
}
