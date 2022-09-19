import { isObject, isString } from '/@/utils/is';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function joinTimestamp(params: object, join: boolean): object {
  if (!join) {
    return params || {};
  }
  const _t = Date.now();
  return Object.assign(params || {}, { _t });
}

export function joinLocalePara(params: object, locale: string): object {
  const lang = locale === 'zh_CN' ? 'zh' : locale;
  return Object.assign(params || {}, { lang });
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return;
  }

  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        params[key] = isString(value) ? value.trim() : value;
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}
