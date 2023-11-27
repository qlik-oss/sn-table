import React, { useState } from "react";
import { Column } from "../../../../types";
import CellText from "../../../components/CellText";
import ColumnAdjusterWrapper from "../../../components/head/ColumnAdjusterWrapper";
import HeadCellContent from "../../../components/head/HeadCellContent";
import { FullSortDirection } from "../../../constants";
import { TableContext, useContextSelector } from "../../../context";
import { BORDER_WIDTH, PADDING } from "../../../styling-defaults";
import { handleHeadKeyDown } from "../../../utils/handle-keyboard";
import { handleMouseDownToFocusHead } from "../../../utils/handle-mouse";
import { StyledHeadCell } from "./styles";

interface HeadCellProps {
  column: Column;
  columnIndex: number;
  columnsLength: number;
}

const HeadCell = ({ column, columnIndex, columnsLength }: HeadCellProps) => {
  const [open, setOpen] = useState(false);

  const {
    styling,
    interactions,
    rootElement,
    keyboard,
    styling: {
      head: { activeBackground, background, hoverBackground },
    },
  } = useContextSelector(TableContext, (value) => value.baseProps);
  const { columns } = useContextSelector(TableContext, (value) => value.tableData);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const isSelectionMode = useContextSelector(TableContext, (value) => value.baseProps.selectionsAPI?.isModal());
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const isNewHeadCellMenuEnabled = useContextSelector(
    TableContext,
    (value) => value.featureFlags.isNewHeadCellMenuEnabled
  );

  const isInteractionEnabled = !!interactions.active && !isSelectionMode;

  const ariaSort = column.isActivelySorted ? FullSortDirection[column.sortDirection] : undefined;

  const isLastColumn = columnIndex === columnsLength - 1;
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

  const handleOpenMenu = () => setOpen(true);

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
      background={open ? activeBackground : background}
      hoverBackground={hoverBackground}
      interactions={interactions}
      onClick={handleOpenMenu}
    >
      <HeadCellContent column={column} isInteractionEnabled={isInteractionEnabled} open={open} setOpen={setOpen}>
        <CellText fontSize={styling.head.fontSize}>{column.label}</CellText>
      </HeadCellContent>
      <ColumnAdjusterWrapper column={column} isLastColumn={isLastColumn} />
    </StyledHeadCell>
  );
};

export default HeadCell;
