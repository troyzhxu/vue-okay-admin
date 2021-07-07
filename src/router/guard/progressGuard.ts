import type { Router } from 'vue-router';
import { unref } from 'vue';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import nProgress from 'nprogress';

export function createProgressGuard(router: Router) {
  const { getOpenNProgress } = useTransitionSetting();
  router.beforeEach(async (to) => {
    console.log('Guard PGS: beforeEach');
    if (to.meta.loaded) {
      return true;
    }
    unref(getOpenNProgress) && nProgress.start();
    return true;
  });

  router.afterEach(async () => {
    unref(getOpenNProgress) && nProgress.done();
    return true;
  });
}
