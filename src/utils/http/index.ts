// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import type { RequestOptions } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';

import { VAxios } from './Axios';
import { checkAndTip } from './msgTip';

import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';

import { RequestEnum } from '/@/enums/httpEnum';

import { deepMerge } from '/@/utils';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useUserStore } from '/@/store/modules/user';

import { useI18n } from '/@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { isObject } from '../is';

const globSetting = useGlobSetting();
const prefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestHook: (res: AxiosResponse, options: RequestOptions) => {
    const { isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    return res.data;
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { joinPrefix, formatDate, joinTime = true } = options;
    if (joinPrefix) {
      config.url = `${prefix}${config.url}`;
    }
    if (config.params && formatDate) {
      formatRequestDate(config.params);
    }
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      const params = config.params || {};
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
      config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
    }
    return config;
  },

  asyncPreprocess: async (config: AxiosRequestConfig, options: RequestOptions) => {
    if (options.withToken) {
      const userStore = useUserStore();
      const accessToken = await userStore.getAccessToken();
      if (!accessToken) {
        return null;
      }
      config.headers = Object.assign({ 'Access-Token': accessToken }, config.headers);
    }
    return { config, options };
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { code, message } = error || {};
    const err: string = error?.toString?.() ?? '';
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        createMessage.error(t('sys.api.apiTimeoutMessage'));
      }
      if (err?.includes('Network Error')) {
        createErrorModal({
          title: t('sys.api.networkException'),
          content: t('sys.api.networkExceptionMsg'),
        });
      }
    } catch (error) {
      throw new Error(error);
    }
    return Promise.reject(error);
  },

  requestCatchHook: (error: any, opt: RequestOptions) => {
    const { response, message } = error || {};
    if (response) {
      let msg: string = response?.data ?? message ?? '';
      if (isObject(msg)) {
        msg = JSON.stringify(msg);
      }
      if (checkAndTip(error?.response?.status, msg, opt)) {
        return Promise.resolve();
      }
    }
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: 20 * 1000,
        headers: {},
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformRequestResult: true,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errMsgMode: 'message',
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 默认需要 Token
          withToken: true,
        },
      },
      opt || {}
    )
  );
}
export const defHttp = createAxios();
