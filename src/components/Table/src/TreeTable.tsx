import { CSSProperties, defineComponent, reactive, ref, unref, watch, watchEffect } from 'vue';
import { Button } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { useEventListener } from '/@/hooks/event/useEventListener';
import { basicProps, TreeColumn, TreeAction } from './types/treeTable';

interface TreeRow {
  record: Recordable; // 行数据
  expanded: boolean; // 是否展开
  level: number; // 树层级
  parentKey: any; // 父健健
  show: boolean; // 本行是否展示
  leaf?: boolean; // 是否是叶子节点
  hasLeaf: boolean; // 是否拥有叶子
}

export default defineComponent({
  name: 'TreeTable',
  components: { Icon, Button },
  props: basicProps,
  emits: ['action'],
  setup(props, { slots, emit, expose }) {
    const dataList = ref<TreeRow[]>([]);

    function isOpen(key: any, rowKey: string, expandAll: boolean) {
      const row = dataList.value.find((r) => r.record[rowKey] === key);
      return row === undefined ? expandAll : row.expanded;
    }

    function flatArray(list: Recordable[] = [], childrenName = 'children') {
      const result: TreeRow[] = [];
      const rowKey = unref(props.rowKey);
      const expandAll = unref(props.defaultExpandAllRows);
      const hasLeafFunc = unref(props.hasLeafFunc);
      const loop = (array: Recordable[], level: number, parentKey: any, show: boolean) => {
        array.forEach((item) => {
          const expanded = isOpen(item[rowKey], rowKey, expandAll);
          const children = item[childrenName];
          if (children) {
            const newItem = { ...item };
            delete newItem[childrenName];
            result.push({
              record: { ...newItem },
              expanded,
              level,
              parentKey,
              show,
              leaf: children.length === 0,
              hasLeaf: hasLeafFunc(item),
            });
            if (children.length > 0) {
              loop(children, level + 1, item[rowKey], expanded);
            }
          } else {
            result.push({
              record: { ...item },
              expanded,
              level,
              parentKey,
              show,
              leaf: true,
              hasLeaf: hasLeafFunc(item),
            });
          }
        });
      };
      loop(list, 0, null, true);
      return result;
    }

    watchEffect(() => {
      dataList.value = flatArray(props.dataSource, props.childrenColumnName);
    });

    function onClickRow(row: TreeRow) {
      const rowKey = unref(props.rowKey);
      row.expanded = !row.expanded;
      const key = row.record[rowKey];
      dataList.value
        .filter((r) => r.parentKey === key)
        .forEach((r) => {
          r.show = row.expanded;
        });
      emit('action', row.expanded ? TreeAction.OpenRow : TreeAction.CloseRow, key);
      if (row.expanded) {
        // 判断是否全部展开
        if (dataList.value.findIndex((r) => !r.show || (r.hasLeaf && !r.expanded)) === -1) {
          emit('action', TreeAction.OpenAll);
        }
        // 判断是否枝干全部展开
        if (
          !row.leaf &&
          dataList.value.findIndex((r) => !r.show || (r.hasLeaf && r.expanded)) === -1
        ) {
          emit('action', TreeAction.OpenTree);
        }
      } else {
        // 判断是否关闭所有
        if (row.level == 0 && dataList.value.findIndex((r) => r.level == 0 && r.expanded) === -1) {
          emit('action', TreeAction.CloseAll);
        }
        // 判断是否叶子全部关闭 且 枝干全部展开
        if (
          row.leaf &&
          dataList.value.findIndex((r) => !r.show || (r.hasLeaf && r.expanded)) === -1
        ) {
          emit('action', TreeAction.OpenTree);
        }
      }
    }

    // 展开所有
    function openAll() {
      dataList.value.forEach((r) => {
        r.show = true;
        r.expanded = true;
      });
      emit('action', TreeAction.OpenAll);
    }

    // 仅展开树
    function openTree() {
      dataList.value.forEach((r) => {
        r.show = true;
        r.expanded = !r.leaf;
      });
      emit('action', TreeAction.OpenTree);
    }

    // 收起所有
    function closeAll() {
      dataList.value.forEach((r) => {
        r.show = r.level == 0;
        r.expanded = false;
      });
      emit('action', TreeAction.CloseAll);
    }

    expose({ openAll, openTree, closeAll });

    function doRenderColumn(column: TreeColumn, row: TreeRow, index: number) {
      const { customRender } = column;
      const record = row.record;
      const text = record[column.dataIndex];
      if (customRender) {
        return customRender({
          text,
          record,
          index,
        });
      }
      return text;
    }

    function renderHeaders() {
      return props.columns.map((column, index) => (
        <th
          style={{
            textAlign: index === 0 ? 'left' : column.align || 'center',
            minWidth: column.minWidth || 'auto',
          }}
          class="ant-table-row-cell-ellipsis ant-table-row-cell-break-word"
        >
          {column.title}
        </th>
      ));
    }

    function calculateIndent(row: TreeRow) {
      const size = props.indentSize * row.level;
      if (row.leaf && !(row.hasLeaf && slots.expandLeaf)) {
        return size + 40 + 'px';
      }
      return size + 'px';
    }

    function renderExpandButton(row: TreeRow) {
      if (!row.leaf || (row.hasLeaf && slots.expandLeaf)) {
        return (
          <Button size="small" class="mr-2" onClick={onClickRow.bind(null, row)}>
            {row.expanded ? (
              <Icon icon="ant-design:minus-outlined" />
            ) : (
              <Icon icon="ant-design:plus-outlined" />
            )}
          </Button>
        );
      }
    }

    function renderColumn(column: TreeColumn, row: TreeRow, index: number) {
      if (index == 0) {
        return (
          <>
            <span style={{ paddingLeft: calculateIndent(row) }}></span>
            {renderExpandButton(row)}
            {doRenderColumn(column, row, index)}
          </>
        );
      } else {
        return doRenderColumn(column, row, index);
      }
    }

    function renderRow(row: TreeRow) {
      return (
        <tr class="ant-table-row">
          {props.columns.map((column, index) => (
            <td
              style={{ textAlign: index === 0 ? 'left' : column.align || 'center' }}
              class="ant-table-row-cell-ellipsis ant-table-row-cell-break-word"
            >
              {renderColumn(column, row, index)}
            </td>
          ))}
        </tr>
      );
    }

    function renderLeaf(row: TreeRow) {
      if (row.leaf && row.expanded && slots.expandLeaf) {
        return <tr class="ant-table-row">{slots.expandLeaf(row)}</tr>;
      }
    }

    const containerStyle = reactive({
      overflowX: 'scroll',
      overflowY: unref(props.reactiveHeight) ? 'scroll' : 'hidden',
      height: 'auto',
    });

    watch(
      () => [props.reactiveHeight, props.heightDiff],
      () => {
        if (unref(props.reactiveHeight)) {
          containerStyle.overflowY = 'scroll';
          caculateHeight();
        } else {
          containerStyle.overflowY = 'hidden';
          containerStyle.height = 'auto';
        }
      }
    );

    function caculateHeight() {
      const bodyHegith = document.body.clientHeight;
      if (unref(props.reactiveHeight)) {
        containerStyle.height = bodyHegith - unref(props.heightDiff) + 'px';
      }
    }

    useEventListener({
      el: window,
      name: 'resize',
      listener: caculateHeight,
    });

    caculateHeight();

    return () => (
      <div style={containerStyle as CSSProperties}>
        <table class="ant-table ant-table-bordered" style="min-width: 100%">
          <thead class="ant-table-thead">
            <tr>{renderHeaders()}</tr>
          </thead>
          <tbody class="ant-table-tbody">
            {dataList.value
              .filter((row) => row.show)
              .map((row) => (
                <>
                  {renderRow(row)}
                  {renderLeaf(row)}
                </>
              ))}
          </tbody>
        </table>
      </div>
    );
  },
});
