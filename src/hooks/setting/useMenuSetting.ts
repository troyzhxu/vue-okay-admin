import type { MenuSetting } from '/#/config';

import { computed, unref, ref } from 'vue';

import { useAppStore } from '/@/store/modules/app';

import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
import { MenuModeEnum, MenuLayoutEnum, TriggerEnum } from '/@/enums/menuEnum';
import { useFullContent } from '/@/hooks/web/useFullContent';

const mixSideHasChildren = ref(false);

export function useMenuSetting() {
  const { getFullContent: fullContent } = useFullContent();
  const appStore = useAppStore();

  const getShowSidebar = computed(() => {
    return (
      unref(getSplit) ||
      (unref(getShowMenu) && unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && !unref(fullContent))
    );
  });

  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);

  const getMenuLayout = computed(() => appStore.getMenuSetting.layout);

  const getMenuMode = computed(() => appStore.getMenuSetting.mode);

  const getMenuFixed = computed(() => appStore.getMenuSetting.fixed);

  const getShowMenu = computed(() => appStore.getMenuSetting.show);

  const getMenuHidden = computed(() => appStore.getMenuSetting.hidden);

  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth);

  const getTrigger = computed(() => appStore.getMenuSetting.trigger);

  const getMenuTheme = computed(() => appStore.getMenuSetting.theme);

  const getSplit = computed(() => appStore.getMenuSetting.split);

  const getMenuBgColor = computed(() => appStore.getMenuSetting.bgColor);

  const getMixSideTrigger = computed(() => appStore.getMenuSetting.mixSideTrigger);

  const getCanDrag = computed(() => appStore.getMenuSetting.canDrag);

  const getAccordion = computed(() => appStore.getMenuSetting.accordion);

  const getMixSideFixed = computed(() => appStore.getMenuSetting.mixSideFixed);

  const getTopMenuAlign = computed(() => appStore.getMenuSetting.topMenuAlign);

  const getCloseMixSidebarOnChange = computed(
    () => appStore.getMenuSetting.closeMixSidebarOnChange,
  );

  const getIsSidebarType = computed(() => unref(getMenuLayout) === MenuLayoutEnum.SIDEBAR);

  const getIsTopMenu = computed(() => unref(getMenuLayout) === MenuLayoutEnum.TOP_MENU);

  const getCollapsedShowTitle = computed(() => appStore.getMenuSetting.collapsedShowTitle);

  const getShowTopMenu = computed(() => {
    return unref(getMenuMode) === MenuModeEnum.HORIZONTAL || unref(getSplit);
  });

  const getShowHeaderTrigger = computed(() => {
    if (
      unref(getMenuLayout) === MenuLayoutEnum.TOP_MENU ||
      !unref(getShowMenu) ||
      unref(getMenuHidden)
    ) {
      return false;
    }

    return unref(getTrigger) === TriggerEnum.HEADER;
  });

  const getIsHorizontal = computed(() => {
    return unref(getMenuMode) === MenuModeEnum.HORIZONTAL;
  });

  const getIsMixSidebar = computed(() => {
    return unref(getMenuLayout) === MenuLayoutEnum.MIX_SIDEBAR;
  });

  const getIsMixMode = computed(() => {
    return (
      unref(getMenuMode) === MenuModeEnum.INLINE && unref(getMenuLayout) === MenuLayoutEnum.MIX
    );
  });

  const getRealWidth = computed(() => {
    if (unref(getIsMixSidebar)) {
      return unref(getCollapsed) && !unref(getMixSideFixed)
        ? unref(getMiniWidthNumber)
        : unref(getMenuWidth);
    }
    return unref(getCollapsed) ? unref(getMiniWidthNumber) : unref(getMenuWidth);
  });

  const getMiniWidthNumber = computed(() => {
    const { collapsedShowTitle } = appStore.getMenuSetting;
    return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
  });

  const getCalcContentWidth = computed(() => {
    const width =
      unref(getIsTopMenu) || !unref(getShowMenu) || (unref(getSplit) && unref(getMenuHidden))
        ? 0
        : unref(getIsMixSidebar)
        ? (unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
          (unref(getMixSideFixed) && unref(mixSideHasChildren) ? unref(getRealWidth) : 0)
        : unref(getRealWidth);

    return `calc(100% - ${unref(width)}px)`;
  });

  // Set menu configuration
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting });
  }

  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !unref(getCollapsed),
    });
  }
  return {
    setMenuSetting,

    toggleCollapsed,

    getMenuFixed,
    getRealWidth,
    getMenuLayout,
    getMenuMode,
    getShowMenu,
    getCollapsed,
    getMiniWidthNumber,
    getCalcContentWidth,
    getMenuWidth,
    getTrigger,
    getSplit,
    getMenuTheme,
    getCanDrag,
    getCollapsedShowTitle,
    getIsHorizontal,
    getIsSidebarType,
    getAccordion,
    getShowTopMenu,
    getShowHeaderTrigger,
    getTopMenuAlign,
    getMenuHidden,
    getIsTopMenu,
    getMenuBgColor,
    getShowSidebar,
    getIsMixMode,
    getIsMixSidebar,
    getCloseMixSidebarOnChange,
    getMixSideTrigger,
    getMixSideFixed,
    mixSideHasChildren,
  };
}
