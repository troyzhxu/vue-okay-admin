import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { RequestOptions, ErrMsgMode } from '/#/axios';

const { createMessage, createErrorModal } = useMessage();

function logMsg(mode: ErrMsgMode, msg: string) {
  if (mode == 'message') {
    createMessage.error(msg);
  }
  if (mode == 'modal') {
    const { t } = useI18n();
    createErrorModal({
      title: () => t('sys.api.errorTip'),
      content: () => msg,
    });
  }
}

export function checkAndTip(status: number, msg: string, opt: RequestOptions): boolean {
  const { t } = useI18n();
  const mode = opt.errMsgMode || 'message';
  switch (status) {
    case 400:
      logMsg(mode, `${msg}`);
      return true;
    case 401:
      logMsg(mode, msg || t('sys.api.errMsg401'));
      return true;
    case 403:
      logMsg(mode, msg || t('sys.api.errMsg403'));
      return true;
    // 404请求不存在
    case 404:
      logMsg(mode, msg || t('sys.api.errMsg404'));
      return true;
    case 405:
      logMsg(mode, t('sys.api.errMsg405'));
      return true;
    case 408:
      logMsg(mode, t('sys.api.errMsg408'));
      return true;
    case 500:
      logMsg(mode, t('sys.api.errMsg500'));
      return true;
    case 501:
      logMsg(mode, t('sys.api.errMsg501'));
      return true;
    case 502:
      logMsg(mode, t('sys.api.errMsg502'));
      return true;
    case 503:
      logMsg(mode, t('sys.api.errMsg503'));
      return true;
    case 504:
      logMsg(mode, t('sys.api.errMsg504'));
      return true;
    case 505:
      logMsg(mode, t('sys.api.errMsg505'));
      return true;
    default:
      return false;
  }
}
