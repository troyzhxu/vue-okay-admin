<template>
  <div :class="prefixCls">
    <BasicForm submitOnReset v-if="formProps" v-bind="formProps" @submit="onFormSearch" />
    <div class="ant-table-wrapper relative">
      <BasicTitle :class="`${prefixCls}-title`">{{ title }}</BasicTitle>
      <div class="absolute top-2 right-2">
        <slot name="actionBefore"></slot>
        <Button v-if="showOpenAll && !state.allOpen" type="link" @click="() => tableRef.openAll()">
          展开所有
        </Button>
        <Button
          v-if="showOpenTree && !state.treeOpen"
          type="link"
          @click="() => tableRef.openTree()"
        >
          仅展开树
        </Button>
        <Button
          v-if="showCloseAll && !state.allClose"
          type="link"
          @click="() => tableRef.closeAll()"
        >
          收起所有
        </Button>
        <slot name="actionAfter"></slot>
      </div>
      <TreeTable v-bind="tableProps" @action="onTreeAction" ref="tableRef">
        <template v-for="item in Object.keys($slots)" :key="item" #[item]="data">
          <slot :name="item" v-bind="data"></slot>
        </template>
      </TreeTable>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { Button } from 'ant-design-vue';
  import { TreeTable } from '/@/components/Table';
  import { BasicForm, FormProps } from '/@/components/Form';
  import { BasicTitle } from '/@/components/Basic';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { TableProps, TreeAction } from './types/treeTable';

  export default defineComponent({
    name: 'BasicTreeTable',
    components: {
      Button,
      TreeTable,
      BasicForm,
      BasicTitle,
    },
    props: {
      title: {
        type: String as PropType<string>,
        required: true,
      },
      formProps: {
        type: Object as PropType<FormProps>,
        default: () => {},
      },
      tableProps: {
        type: Object as PropType<TableProps>,
        default: () => {},
      },
      showOpenAll: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      showOpenTree: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      showCloseAll: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
    },
    emits: ['search'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('basic-treetable');
      const tableRef = ref<any>();

      const defaultExpandAll = unref(props.tableProps.defaultExpandAllRows);

      const state = reactive({
        allOpen: defaultExpandAll === undefined || defaultExpandAll,
        allClose: defaultExpandAll !== undefined && defaultExpandAll,
        treeOpen: false,
      });
      function onFormSearch(params: Recordable) {
        emit('search', params);
      }
      function onTreeAction(type: TreeAction) {
        state.allOpen = false;
        state.allClose = false;
        state.treeOpen = false;
        switch (type) {
          case TreeAction.OpenAll:
            state.allOpen = true;
            break;
          case TreeAction.CloseAll:
            state.allClose = true;
            break;
          case TreeAction.OpenTree:
            state.treeOpen = true;
            break;
        }
      }
      return {
        prefixCls,
        tableRef,
        onFormSearch,
        onTreeAction,
        state,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-treetable';
  .@{prefix-cls} {
    .ant-form {
      padding: 12px 10px 6px 10px;
      margin-bottom: 16px;
      background-color: @component-background;
      border-radius: 2px;
    }

    .ant-table-wrapper {
      padding: 6px;
      background-color: @component-background;
      border-radius: 2px;

      .@{prefix-cls}-title {
        height: 40px;
        padding-top: 5px;
      }

      .ant-table {
        border: 1px solid #f0f0f0;
        min-width: 1100px;

        tr td,
        .ant-table-thead tr th {
          padding: 12px 8px !important;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .@{prefix-cls} .ant-table-wrapper .ant-table {
      border: 1px solid #303030;
    }
  }
</style>
