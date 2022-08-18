import React, { memo, useEffect, useMemo, useRef, createRef } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import { useContextSelector, TableContext } from '../context';
import { VisuallyHidden, StyledHeadRow, StyledSortLabel } from '../styles';
import { getHeaderStyle } from '../utils/styling-utils';
import { headHandleKeyPress } from '../utils/handle-key-press';
import { handleMouseDownLabelToFocusHeadCell, handleClickToFocusHead } from '../utils/handle-accessibility';
import { handleDragStart, handleDragOver, handleDragEnd } from '../utils/handle-drag-columns';
import useDrag from '../hooks/use-drag';

function TableHeadWrapper({
  rootElement,
  tableData,
  theme,
  layout,
  changeSortOrder,
  constraints,
  translator,
  selectionsAPI,
  keyboard,
  model,
  direction,
}) {
  const { columns, paginationNeeded } = tableData;
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const rtl = direction === 'rtl';
  const headRowRef = useRef();
  const tableCellRefs = useRef([]);
  tableCellRefs.current = columns.map((el, i) => tableCellRefs.current[i] ?? createRef());
  const [engagedColumn, setEngagedColumn] = useDrag();

  useEffect(() => {
    setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, headerStyle.fontSize, headRowRef.current?.getBoundingClientRect().height]);

  useEffect(() => {
    columns.forEach((column, i) => {
      if (tableCellRefs.current[i].current) {
        column.width = tableCellRefs.current[i].current.clientWidth;
      }
    });
  }, [tableCellRefs.current]);

  return (
    <TableHead>
      <StyledHeadRow ref={headRowRef} paginationNeeded={paginationNeeded} className="sn-table-row">
        {columns.map((column, columnIndex) => {
          // The first cell in the head is focusable in sequential keyboard navigation,
          // when nebula does not handle keyboard navigation
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.dataColIdx;
          const handleKeyDown = (evt) => {
            headHandleKeyPress({
              evt,
              rootElement,
              cellCoord: [0, columnIndex],
              column,
              changeSortOrder,
              layout,
              isSortingEnabled: !constraints.active,
              setFocusedCellCoord,
            });
          };

          return (
            <TableCell
              sx={headerStyle}
              style={{ opacity: engagedColumn !== undefined && engagedColumn !== columnIndex ? '50%' : null }}
              ref={tableCellRefs.current[columnIndex]}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              tabIndex={tabIndex}
              aria-sort={isCurrentColumnActive ? `${column.sortDirection}ending` : null}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={handleKeyDown}
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() => !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column)}
              draggable
              onDragStart={(event) =>
                handleDragStart({
                  event,
                  layout,
                  cellRef: tableCellRefs.current[columnIndex],
                  headRowRef,
                  cell: column,
                })
              }
              onDragOver={(event) => handleDragOver({ event, rtl, columns, setEngagedColumn })}
              onDragEnd={() => handleDragEnd(model, setEngagedColumn)}
            >
              <StyledSortLabel
                headerStyle={headerStyle}
                active={isCurrentColumnActive}
                title={!constraints.passive ? column.sortDirection : undefined} // passive: turn off tooltips.
                direction={column.sortDirection}
                tabIndex={-1}
                onMouseDown={(evt) => handleMouseDownLabelToFocusHeadCell(evt, rootElement, columnIndex)}
              >
                {column.label}
                {isFocusInHead && (
                  <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
                    {translator.get('SNTable.SortLabel.PressSpaceToSort')}
                  </VisuallyHidden>
                )}
              </StyledSortLabel>
            </TableCell>
          );
        })}
      </StyledHeadRow>
    </TableHead>
  );
}

TableHeadWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  changeSortOrder: PropTypes.func.isRequired,
  constraints: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  // eslint-disable-next-line react/require-default-props
  direction: PropTypes.string,
};

export default memo(TableHeadWrapper);
