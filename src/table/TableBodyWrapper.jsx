import React, { useReducer, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { addSelectionListeners, reducer } from './selections-utils';
import getCellRenderer from './cells/renderer';
import { getBodyStyle, STYLING_DEFAULTS } from './styling-utils';
import { bodyHandleKeyPress } from './cells/handle-key-press';
import { handleClickToFocusBody } from './cells/handle-cell-focus';

const useStyles = makeStyles({
  body: {
    height: ({ height }) => `${height}px`,
  },
  cellBase: {
    '& td': {
      color: ({ color }) => color,
      fontSize: ({ fontSize }) => fontSize,
      padding: ({ padding }) => padding,
      height: STYLING_DEFAULTS.HEIGHT,
      lineHeight: STYLING_DEFAULTS.HEAD_LINE_HEIGHT,
      '&:focus': {
        boxShadow: STYLING_DEFAULTS.FOCUS_OUTLINE,
      },
    },
  },
  hoverTableRow: {
    '&&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      '& td:not(.selected)': {
        backgroundColor: ({ hoverBackgroundColor }) => `${hoverBackgroundColor} !important`,
        color: ({ hoverFontColor }) => `${hoverFontColor} !important`,
      },
    },
  },
});

const TableBodyWrapper = ({
  rootElement,
  tableData,
  constraints,
  selectionsAPI,
  layout,
  theme,
  focusedCellCoord,
  setShouldRefocus,
}) => {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const bodyStyle = useMemo(() => getBodyStyle(layout, theme, rootElement), [layout, theme.name()]);
  const classes = useStyles(bodyStyle);
  const selectionsEnabled = !!selectionsAPI && !constraints.active;
  const getColumnRenderers = tableData.columns.map((c) => getCellRenderer(!!c.stylingInfo.length, selectionsEnabled));
  const [columnRenderers, setColumnRenderers] = useState(() => getColumnRenderers);
  const [selState, selDispatch] = useReducer(reducer, {
    api: selectionsAPI,
    rows: [],
    colIdx: -1,
    isEnabled: selectionsEnabled,
  });

  useEffect(() => {
    selDispatch({ type: 'set-enabled', payload: { isEnabled: selectionsEnabled } });
    setColumnRenderers(getColumnRenderers);
  }, [selectionsEnabled, columns.length]);

  useEffect(() => {
    addSelectionListeners(selectionsAPI, selDispatch, setShouldRefocus);
  }, []);

  return (
    <TableBody className={`${classes.body} ${classes.cellBase}`}>
      {rows.map((row, rowIndex) => (
        <TableRow
          hover={hoverEffect}
          tabIndex={-1}
          key={row.key}
          className={`sn-table-row ${hoverEffect && classes.hoverTableRow}`}
        >
          {columns.map((column, columnIndex) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[columnIndex];
            return (
              CellRenderer && (
                <CellRenderer
                  cell={cell}
                  column={column}
                  value={value}
                  key={column.id}
                  align={column.align}
                  styling={{}}
                  selState={selState}
                  selDispatch={selDispatch}
                  tabIndex={-1}
                  onKeyDown={(evt) =>
                    bodyHandleKeyPress(
                      evt,
                      rootElement,
                      [rowIndex + 1, columnIndex],
                      focusedCellCoord,
                      selState,
                      cell,
                      selDispatch,
                      selectionsEnabled
                    )
                  }
                  onMouseDown={() => handleClickToFocusBody(cell, focusedCellCoord, rootElement)}
                >
                  {value}
                </CellRenderer>
              )
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};

TableBodyWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  focusedCellCoord: PropTypes.object.isRequired,
  setShouldRefocus: PropTypes.func.isRequired,
};

export default React.memo(TableBodyWrapper);
