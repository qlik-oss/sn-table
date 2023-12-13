import { ColumnAdjuster } from "@qlik/nebula-table-utils/lib/components";
import { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import React from "react";
import { TableContext, useContextSelector } from "../../context";
import { AdjusterProps } from "../../types";
import { focusBackToHeadCell } from "../../utils/accessibility-utils";

/**
 * Component that is placed on top of column border.
 * The vertical borders in the header can be used to change the column width.
 * When you start dragging, mouse move and mouse up listeners are added.
 * While dragging the current column is updated, and on mouse up all other columns are updated.
 */
const ColumnAdjusterWrapper = ({ column, isLastColumn, onColumnResize }: AdjusterProps) => {
  const { pageColIdx } = column;
  const { applyColumnWidths, interactions } = useContextSelector(TableContext, (value) => value.baseProps);
  const isNewHeadCellMenuEnabled = useContextSelector(
    TableContext,
    (value) => value.featureFlags.isNewHeadCellMenuEnabled,
  );
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setColumnWidths = useContextSelector(TableContext, (value) => value.setColumnWidths);

  if (!interactions.active) return null;

  const updateWidth = (adjustedWidth: number) => {
    onColumnResize?.();
    const newColumnWidths = [...columnWidths];
    newColumnWidths[pageColIdx] = adjustedWidth;
    setColumnWidths(newColumnWidths);
  };

  const confirmWidth = (newWidthData: ColumnWidth) => {
    applyColumnWidths(newWidthData, column);
  };

  const handleBlur = (event: React.FocusEvent | React.KeyboardEvent) =>
    focusBackToHeadCell(event, isNewHeadCellMenuEnabled);

  // TODO: Pass the new header flag here so we can adjust the min width accordingly
  return (
    <ColumnAdjuster
      columnWidth={columnWidths[pageColIdx]}
      isLastColumn={isLastColumn}
      keyValue={`adjuster-${pageColIdx}`}
      isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
      updateWidthCallback={updateWidth}
      confirmWidthCallback={confirmWidth}
      handleBlur={handleBlur}
    />
  );
};

export default ColumnAdjusterWrapper;
