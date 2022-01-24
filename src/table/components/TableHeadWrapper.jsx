import { styled } from '@mui/system';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { getHeadStyle } from '../utils/styling-utils';
import { headHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusHead } from '../utils/handle-accessibility';

const CustomTableCell = styled(TableCell)(({ headCellStyle }) => ({
  color: headCellStyle.color,
  fontSize: headCellStyle.fontSize,
  padding: headCellStyle.padding,
}));

const VisuallyHidden = styled('span')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  top: 20,
  width: 1,
});

const TableSortLabelSection = styled(TableSortLabel)({
  '&.Mui-active': {
    color: 'inherit',
  },
});

function TableHeadWrapper({
  rootElement,
  tableData,
  theme,
  layout,
  changeSortOrder,
  constraints,
  translator,
  selectionsAPI,
  focusedCellCoord,
  setFocusedCellCoord,
  keyboard,
}) {
  const headCellStyle = useMemo(() => getHeadStyle(layout, theme), [layout, theme.name()]);

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {tableData.columns.map((column, columnIndex) => {
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.dataColIdx;
          const isFocusInHead = focusedCellCoord[0] === 0;

          return (
            <CustomTableCell
              headCellStyle={headCellStyle}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              tabIndex={tabIndex}
              aria-sort={isCurrentColumnActive ? `${column.sortDirection}ending` : null}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={(e) =>
                headHandleKeyPress(
                  e,
                  rootElement,
                  [0, columnIndex],
                  column,
                  changeSortOrder,
                  layout,
                  !constraints.active,
                  setFocusedCellCoord
                )
              }
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() => !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column)}
            >
              <TableSortLabelSection active={isCurrentColumnActive} direction={column.sortDirection} tabIndex={-1}>
                {column.label}
                {isFocusInHead && (
                  <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
                    {translator.get('SNTable.SortLabel.PressSpaceToSort')}
                  </VisuallyHidden>
                )}
              </TableSortLabelSection>
            </CustomTableCell>
          );
        })}
      </TableRow>
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
  selectionsAPI: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  focusedCellCoord: PropTypes.arrayOf(PropTypes.number).isRequired,
  setFocusedCellCoord: PropTypes.func.isRequired,
  translator: PropTypes.object.isRequired,
};

export default TableHeadWrapper;
