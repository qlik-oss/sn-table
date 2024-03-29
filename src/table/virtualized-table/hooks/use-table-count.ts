import { useMemo } from "react";
import { PageInfo, TableLayout } from "../../../types";
import { Rect } from "../types";

const useTableCount = (
  layout: TableLayout,
  pageInfo: PageInfo,
  rect: Rect,
  columnWidths: number[],
  bodyRowHeight: number,
) => {
  const rowCount = Math.min(pageInfo.rowsPerPage, layout.qHyperCube.qSize.qcy - pageInfo.page * pageInfo.rowsPerPage);
  const visibleRowCount = Math.min(rowCount, Math.ceil(rect.height / bodyRowHeight));
  const visibleColumnCount = useMemo(
    () =>
      columnWidths.reduce(
        (data, colWidth) => {
          if (data.width < rect.width) {
            data.width += colWidth;
            data.count += 1;
          }

          return data;
        },
        { count: 0, width: 0 },
      ),
    [rect, columnWidths],
  ).count;

  return {
    rowCount,
    visibleRowCount,
    visibleColumnCount,
  };
};

export default useTableCount;
