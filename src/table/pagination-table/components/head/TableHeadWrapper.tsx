import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { memo, useEffect, useRef } from "react";

import CellText from "../../../components/CellText";
import ColumnAdjuster from "../../../components/head/ColumnAdjuster";
import HeadCellContent from "../../../components/head/HeadCellContent";
import { FullSortDirection } from "../../../constants";
import { TableContext, useContextSelector } from "../../../context";
import { BORDER_WIDTH, PADDING } from "../../../styling-defaults";
import { handleHeadKeyDown } from "../../../utils/handle-keyboard";
import { handleMouseDownToFocusHead } from "../../../utils/handle-mouse";
import { StyledHeadCell } from "./styles";

const TableHeadWrapper = () => {
  const { columns } = useContextSelector(TableContext, (value) => value.tableData);
  const { layout, styling, interactions, rootElement, keyboard, viewService } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const isSelectionMode = useContextSelector(TableContext, (value) => value.baseProps.selectionsAPI?.isModal());
  const isNewHeadCellMenuEnabled = useContextSelector(
    TableContext,
    (value) => value.featureFlags.isNewHeadCellMenuEnabled
  );

  const headRowRef = useRef<HTMLTableRowElement>(null);
  const isInteractionEnabled = !!interactions.active && !isSelectionMode;

  useEffect(() => {
    if (headRowRef.current) {
      setHeadRowHeight(headRowRef.current.clientHeight);
    }
  }, [styling.head.fontSize, columnWidths, setHeadRowHeight]);

  if (viewService.viewState?.skipHeader) return null;

  return (
    <TableHead>
      <TableRow ref={headRowRef} className="sn-table-row sn-table-head-row">
        {columns.map((column, columnIndex) => {
          const isSorted = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
          const ariaSort = isSorted ? FullSortDirection[column.sortDirection] : undefined;

          const isLastColumn = columnIndex === columns.length - 1;
          const cellCoord = [0, column.pageColIdx] as [number, number];

          const handleKeyDown = (evt: React.KeyboardEvent) =>
            handleHeadKeyDown({
              evt,
              rootElement,
              cellCoord,
              setFocusedCellCoord,
              isInteractionEnabled,
            });

          const handleMouseDown = (evt: React.MouseEvent) =>
            handleMouseDownToFocusHead({
              evt,
              rootElement,
              cellCoord,
              setFocusedCellCoord,
              keyboard,
              isInteractionEnabled,
            });

          const widthStyle = {
            width: columnWidths[columnIndex] - (isLastColumn ? PADDING * 2 : PADDING * 2 + BORDER_WIDTH),
            zIndex: columns.length - columnIndex,
          };

          return (
            <StyledHeadCell
              headerStyle={styling.head}
              style={widthStyle} // add by style to reduce number of classes created by mui
              key={column.id}
              align={column.headTextAlign}
              className="sn-table-head-cell sn-table-cell"
              aria-sort={ariaSort}
              tabIndex={-1}
              title={interactions.passive ? column.label : undefined}
              onKeyDown={handleKeyDown}
              onMouseDown={handleMouseDown}
              isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
            >
              <HeadCellContent column={column} isSorted={isSorted} isInteractionEnabled={isInteractionEnabled}>
                <CellText fontSize={styling.head.fontSize}>{column.label}</CellText>
              </HeadCellContent>
              <ColumnAdjuster column={column} isLastColumn={isLastColumn} />
            </StyledHeadCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default memo(TableHeadWrapper);
