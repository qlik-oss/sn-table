import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import { useContextSelector, TableContext } from '../context';
import { VisuallyHidden, StyledHeadRow, StyledSortLabel } from '../styles';
import { getHeaderStyle } from '../utils/styling-utils';
import { handleHeadKeyDown } from '../utils/handle-key-press';
import { handleMouseDownLabelToFocusHeadCell, handleClickToFocusHead } from '../utils/handle-click';
import { TableHeadWrapperProps } from '../types';
import { TextField } from '@mui/material';

type ColumnFilter = {
  idx: number;
  name: string;
  type: string; // text, numeric, range?
  value: string;
};

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
}: TableHeadWrapperProps) {
  const { columns, paginationNeeded } = tableData;
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const headRowRef = useRef<HTMLElement>();
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();

  useEffect(() => {
    headRowRef.current && setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, headerStyle.fontSize, headRowRef.current?.getBoundingClientRect().height]);

  const hcColumns = columns.map((c) => {
    const hcColumns = [...layout.qHyperCube.qDimensionInfo, ...layout.qHyperCube.qMeasureInfo];
    return hcColumns[c.dataColIdx];
  });
  const columnNames = hcColumns.map((c) => c.qFallbackTitle).join('|');
  const columnNamesMemo = useMemo(() => hcColumns.map((c) => c.qFallbackTitle), [columnNames]);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);

  // Reset filters when column names changes
  useEffect(() => {
    setFilters(
      columnNamesMemo.map((name, idx) => ({
        name,
        idx,
        type: 'text',
        value: '',
      }))
    );
  }, [columnNamesMemo]);

  const getFilterValue = (i) => filters[i]?.value ?? '';

  const handleFilterChange = (i) => (evt) => {
    setFilters((f) => {
      const newFilters = structuredClone(f);
      newFilters[i].value = evt.target.value;
      return newFilters;
    });
  };

  const basicScript = `Replace Load ${columnNamesMemo.map((name) => `"${name}" as "${name}"`).join(', ')} Resident HC1`;
  const populatedFilters = filters.filter((f) => f.value.length > 0);
  const whereClause = populatedFilters
    .map((f) => {
      const trimmed = f.value.trim() ?? '';
      const start = trimmed.at(0) ?? '';
      if (['=', '>', '<'].includes(start)) {
        // need to validate value here...
        if (isNaN(parseFloat(trimmed.at(-1) ?? ''))) return '';
        return `"${f.name}" ${f.value}`;
      }
      return `WildMatch("${f.name}", '*${f.value}*')`;
    })
    .filter((s) => s.length > 0)
    .join(' AND ');

  const chartScript = basicScript + (whereClause.length > 0 ? ` WHERE ${whereClause}` : '');

  // Debounced: on filters change, update chart script
  useEffect(() => {
    model.applyPatches([
      {
        qOp: 'replace',
        qPath: '/qHyperCubeDef/qDynamicScript',
        qValue: JSON.stringify([chartScript]),
      },
    ]);
  }, [chartScript]);

  return (
    <TableHead>
      <StyledHeadRow ref={headRowRef} paginationNeeded={paginationNeeded} className="sn-table-row">
        {columns.map((column, columnIndex) => {
          // The first cell in the head is focusable in sequential keyboard navigation,
          // when nebula does not handle keyboard navigation
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.dataColIdx;
          const ariaSort = isCurrentColumnActive
            ? (`${column.sortDirection}ending` as 'ascending' | 'descending')
            : undefined;

          const handleKeyDown = (evt: React.KeyboardEvent) => {
            handleHeadKeyDown({
              evt,
              rootElement,
              cellCoord: [0, columnIndex],
              column,
              changeSortOrder,
              layout,
              isInteractionEnabled,
              setFocusedCellCoord,
            });
          };

          return (
            <TableCell
              sx={headerStyle}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              tabIndex={tabIndex}
              aria-sort={ariaSort}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={handleKeyDown}
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() => isInteractionEnabled && changeSortOrder(layout, column)}
            >
              <StyledSortLabel
                headerStyle={headerStyle}
                active={isCurrentColumnActive}
                title={!constraints.passive ? column.sortDirection : undefined} // passive: turn off tooltips.
                direction={column.sortDirection}
                tabIndex={-1}
                onMouseDown={(evt: React.MouseEvent) =>
                  handleMouseDownLabelToFocusHeadCell(evt, rootElement, columnIndex)
                }
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
      <StyledHeadRow className="sn-table-row">
        {columns.map((column, columnIndex) => (
          <TableCell
            sx={[headerStyle, { top: '36px', cursor: 'auto' }]}
            key={column.id}
            align={column.align}
            className="sn-table-head-cell sn-table-cell"

            // tabIndex={tabIndex}
            // aria-sort={ariaSort}
            // aria-pressed={isCurrentColumnActive}
            // onKeyDown={handleKeyDown}
            // onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
            // onClick={() => isInteractionEnabled && changeSortOrder(layout, column)}
          >
            <TextField
              size="small"
              placeholder="Search"
              sx={{
                padding: 0,
                width: '100%',
                '& .MuiInputBase-root': {
                  width: '100%',
                },
              }}
              value={getFilterValue(columnIndex)}
              onChange={handleFilterChange(columnIndex)}
            />
          </TableCell>
        ))}
      </StyledHeadRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
