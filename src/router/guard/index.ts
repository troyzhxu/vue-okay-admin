import type { Router } from 'vue-router';
import { createPageGuard } from './pageGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';
import { createHttpGuard } from './httpGuard';
import { createScrollGuard } from './scrollGuard';
import { createMessageGuard } from './messageGuard';
import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createStateGuard } from './stateGuard';
import { createParamMenuGuard } from './paramMenuGuard';

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
  createPageGuard(router);
  createPageLoadingGuard(router);
  createHttpGuard(router);
  createScrollGuard(router);
  createMessageGuard(router);
  createProgressGuard(router);
  createPermissionGuard(router);
  createParamMenuGuard(router); // must after createPermissionGuard (menu has been built.)
  createStateGuard(router);
}
