/* eslint jsx-a11y/no-static-element-interactions: 0 jsx-a11y/mouse-events-have-key-events: 0 */
import React from "react";
import { areEqual } from "react-window";
import CellText from "../components/CellText";
import { TableContext, useContextSelector } from "../context";
import EmptyCell from "./EmptyCell";
import { BORDER_WIDTH, PADDING_LEFT_RIGHT } from "./constants";
import useSelector from "./hooks/use-selector";
import { ItemData } from "./types";
import getCellStyle from "./utils/get-cell-style";

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: ItemData;
}

const Cell = ({ columnIndex, rowIndex, style, data }: CellProps) => {
  const { rowsInPage, columns, bodyStyle, isHoverEnabled, maxLineCount } = data;

  const rowIsHovered = useContextSelector(TableContext, (value) => value.hoverIndex === rowIndex);
  const setHoverIndex = useContextSelector(TableContext, (value) => value.setHoverIndex);
  const { interactions } = useContextSelector(TableContext, (value) => value.baseProps);
  const showRightBorder = useContextSelector(TableContext, (value) => value.showRightBorder);

  const cell = rowsInPage[rowIndex]?.[`col-${columnIndex}`];

  const { handleMouseDown, handleMouseOver, handleMouseUp, cellSelectionState } = useSelector(cell);

  if (typeof cell === "object") {
    const cellStyle = getCellStyle(
      cell,
      columns[columnIndex],
      isHoverEnabled && rowIsHovered,
      cellSelectionState,
      bodyStyle,
    );

    const cellId = { rowindex: rowIndex, columnindex: columnIndex };

    return (
      <div
        className={`sn-table-cell ${cellSelectionState}`}
        style={{
          ...style,
          ...cellStyle,
          display: "flex",
          alignItems: "start",
          borderWidth: "0px",
          borderBottomWidth: cell.isLastRow ? "0px" : `${BORDER_WIDTH}px`,
          borderRightWidth: cell.isLastColumn && !showRightBorder ? "0px" : `${BORDER_WIDTH}px`,
          borderStyle: "solid",
          justifyContent: cell.align,
          padding: `4px ${PADDING_LEFT_RIGHT}px`,
          boxSizing: "border-box",
          cursor: "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOver={handleMouseOver}
        onMouseEnter={isHoverEnabled ? () => setHoverIndex(rowIndex) : undefined}
        onMouseLeave={isHoverEnabled ? () => setHoverIndex(-1) : undefined}
        title={interactions.passive ? cell.qText : undefined}
        {...cellId}
      >
        <CellText wordBreak={!cell.isNumeric} lines={maxLineCount}>
          {cell.qText}
        </CellText>
      </div>
    );
  }

  return (
    <EmptyCell
      style={{
        ...style,
        ...bodyStyle,
        borderWidth: "0px 1px 1px 0px",
        borderStyle: "solid",
        boxSizing: "border-box",
      }}
    />
  );
};

export default React.memo(Cell, areEqual);
