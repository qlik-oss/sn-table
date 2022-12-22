import { useMemo } from 'react';
import { PageInfo, TableLayout } from '../../../../types';
import { DEFAULT_ROW_HEIGHT } from '../constants';
import { TableRect } from '../types';

const useTableCount = (layout: TableLayout, pageInfo: PageInfo, rect: TableRect, columnWidth: number[]) => {
  const rowCount = Math.min(pageInfo.rowsPerPage, layout.qHyperCube.qSize.qcy - pageInfo.page * pageInfo.rowsPerPage);
  const visibleRowCount = Math.min(rowCount, Math.ceil(rect.height / DEFAULT_ROW_HEIGHT));
  const visibleColumnCount = useMemo(
    () =>
      columnWidth.reduce(
        (data, colWidth) => {
          if (data.width < rect.width) {
            data.width += colWidth;
            data.count += 1;
          }

          return data;
        },
        { count: 0, width: 0 }
      ),
    [rect, columnWidth]
  ).count;

  return {
    rowCount,
    visibleRowCount,
    visibleColumnCount,
  };
};

export default useTableCount;
