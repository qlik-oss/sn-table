import React, { memo, useEffect, useRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../../context';
import { FullSortDirection } from '../../../constants';
import HeadCellContent from '../../../components/head/HeadCellContent';
import ColumnAdjuster from '../../../components/head/ColumnAdjuster';
import CellText from '../../../components/CellText';
import { BORDER_WIDTH, PADDING } from '../../../styling-defaults';
import { StyledHeadCell } from './styles';
import { handleHeadKeyDown } from '../../../utils/handle-keyboard';
import { handleMouseDownToFocusHead } from '../../../utils/handle-mouse';

function TableHeadWrapper() {
  const { columns } = useContextSelector(TableContext, (value) => value.tableData);
  const { layout, styling, constraints, rootElement, keyboard } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const isInSelectionMode = useContextSelector(TableContext, (value) => value.baseProps.selectionsAPI.isModal());
  const headRowRef = useRef<HTMLTableRowElement>(null);
  const isInteractionEnabled = !constraints.active && !isInSelectionMode;

  useEffect(() => {
    if (headRowRef.current) {
      setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
    }
  }, [styling.head.fontSize, columnWidths, setHeadRowHeight]);

  return (
    <TableHead>
      <TableRow ref={headRowRef} className="sn-table-row sn-table-head-row">
        {columns.map((column, columnIndex) => {
          const isActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
          const ariaSort = isActive ? FullSortDirection[column.sortDirection] : undefined;
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
              title={!constraints.passive ? column.label : undefined}
              onKeyDown={handleKeyDown}
              onMouseDown={handleMouseDown}
            >
              <HeadCellContent column={column} isActive={isActive} isInteractionEnabled={isInteractionEnabled}>
                <CellText fontSize={styling.head.fontSize}>{column.label}</CellText>
              </HeadCellContent>
              <ColumnAdjuster column={column} isLastColumn={isLastColumn} />
            </StyledHeadCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
