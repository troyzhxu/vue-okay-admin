<template>
  <div v-if="getShowDarkModeToggle" :class="getClass" @click="toggleDarkMode">
    <div :class="`${prefixCls}-inner`"> </div>
    <SvgIcon size="14" name="auto" style="z-index: 1" />
    <SvgIcon size="12" name="moon" style="z-index: 1; margin: 1px" />
    <SvgIcon size="14" name="sun" style="z-index: 1" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { SvgIcon } from '/@/components/Icon';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useDarkMode } from '/@/hooks/web/useDarkMode';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
  import { updateDarkTheme } from '/@/logics/theme/dark';
  import { ThemeEnum } from '/@/enums/appEnum';

  const { prefixCls } = useDesign('dark-switch');
  const { getAppTheme, setDarkMode, getShowDarkModeToggle } = useRootSetting();

  const getClass = computed(() => [
    prefixCls,
    {
      [`${prefixCls}--dark`]: getAppTheme.value === ThemeEnum.DARK,
      [`${prefixCls}--light`]: getAppTheme.value === ThemeEnum.LIGHT,
    },
  ]);

  const { isNowNight } = useDarkMode();

  function toggleAutoMode(oldMode: ThemeEnum): ThemeEnum | null {
    const isNight = isNowNight();
    if (isNight && oldMode === ThemeEnum.LIGHT) {
      return ThemeEnum.DARK;
    }
    if (!isNight && oldMode === ThemeEnum.DARK) {
      return ThemeEnum.LIGHT;
    }
    return null;
  }

  function toggleDarkMode() {
    const oldMode = getAppTheme.value;
    const darkMode =
      oldMode === ThemeEnum.DARK
        ? ThemeEnum.LIGHT
        : oldMode === ThemeEnum.LIGHT
        ? ThemeEnum.AUTO
        : ThemeEnum.DARK;
    setDarkMode(darkMode);
    if (darkMode == ThemeEnum.AUTO) {
      const targetMode = toggleAutoMode(oldMode);
      if (targetMode) {
        updateDarkTheme(targetMode);
        updateHeaderBgColor();
        updateSidebarBgColor();
      }
    } else {
      updateDarkTheme(darkMode);
      updateHeaderBgColor();
      updateSidebarBgColor();
    }
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-dark-switch';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    width: 75px;
    height: 26px;
    padding: 0 6px;
    margin-left: auto;
    cursor: pointer;
    background-color: #151515;
    border-radius: 30px;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &-inner {
      position: absolute;
      left: 4px;
      width: 18px;
      height: 18px;
      border-color: white;
      border-width: 1px;
      border-radius: 50%;
      transition: transform 0.5s, background-color 0.5s;
      will-change: transform;
    }

    &--dark {
      .@{prefix-cls}-inner {
        transform: translateX(calc(100% + 6px));
      }
    }

    &--light {
      .@{prefix-cls}-inner {
        transform: translateX(calc(100% + 29px));
      }
    }
  }
</style>
