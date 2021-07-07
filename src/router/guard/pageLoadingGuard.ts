import type { Router } from 'vue-router';
import { useAppStoreWithOut } from '/@/store/modules/app';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { unref } from 'vue';

export function createPageLoadingGuard(router: Router) {
  const { getOpenPageLoading } = useTransitionSetting();
  const userStore = useUserStoreWithOut();
  const appStore = useAppStoreWithOut();

  router.beforeEach(async (to) => {
    console.log('Guard PLD: beforeEach');
    if (!userStore.getIsLogin) {
      return true;
    }
    if (to.meta.loaded) {
      return true;
    }

    if (unref(getOpenPageLoading)) {
      appStore.setPageLoadingAction(true);
      return true;
    }

    return true;
  });
  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      setTimeout(() => {
        appStore.setPageLoading(false);
      }, 220);
    }
    return true;
  });
}
