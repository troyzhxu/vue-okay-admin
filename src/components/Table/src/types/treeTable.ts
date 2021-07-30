import { VNode } from 'vue';

export interface TreeColumn {
  title: string;
  dataIndex: string;
  align?: 'left' | 'right' | 'center';
  customRender?: ({ text, record, index }) => string | VNode | VNode[];
  minWidth?: number;
}

export const basicProps = {
  dataSource: {
    type: Array as PropType<Recordable[]>,
    default: () => [],
  },
  columns: {
    type: Array as PropType<TreeColumn[]>,
    default: () => [],
  },
  indentSize: {
    type: Number as PropType<number>,
    default: 15,
  },
  rowKey: {
    type: String as PropType<string>,
    default: 'id',
  },
  childrenColumnName: {
    type: String as PropType<string>,
    default: 'children',
  },
  defaultExpandAllRows: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  reactiveHeight: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  heightDiff: {
    type: Number as PropType<number>,
    default: 240,
  },
  hasLeafFunc: {
    type: Function as PropType<(record: Recordable) => boolean>,
    default: () => true,
  },
};

export interface TableProps {
  dataSource?: Recordable[];
  columns?: TreeColumn[];
  indentSize?: number;
  rowKey?: string;
  childrenColumnName?: string;
  // 默认true
  defaultExpandAllRows?: boolean;
  // 高度是否支持响应式
  reactiveHeight?: boolean;
  heightDiff?: number;
  hasLeafFunc?: (record: Recordable) => boolean;
}

export const enum TreeAction {
  OpenRow = 'openRow',
  CloseRow = 'closeRow',
  OpenAll = 'openAll',
  OpenTree = 'openTree',
  CloseAll = 'closeAll',
}
