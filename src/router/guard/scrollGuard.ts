import type { RouteLocationNormalized, Router } from 'vue-router';

export function createScrollGuard(router: Router) {
  const isHash = (href: string) => {
    return /^#/.test(href);
  };

  const body = document.body;

  router.afterEach(async (to) => {
    console.log('Guard SCR: beforeEach');
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
    return true;
  });
}
