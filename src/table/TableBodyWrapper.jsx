import React, { useReducer, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { addSelectionListeners, reducer } from './selections-utils';
import getCellRenderer from './cells/renderer';
import { STYLING_DEFAULTS, getBodyStyle } from './styling-utils';

const useStyles = makeStyles({
  tableCell: (props) => ({
    fontSize: props.fontSize,
    color: props.fontColor,
    padding: props.padding,
    height: STYLING_DEFAULTS.HEIGHT,
    lineHeight: STYLING_DEFAULTS.BODY_LINE_HEIGHT,
  }),
  hoverTableRow: (props) => ({
    '&&:hover': {
      backgroundColor: props.hoverBackgroundColor,
      '& td': {
        color: props.hoverFontColor,
      },
    },
  }),
});

const TableBodyWrapper = ({ rootElement, tableData, constraints, selectionsAPI, layout, theme }) => {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const styling = useMemo(() => getBodyStyle(layout, theme), [layout, theme]);
  const classes = useStyles(styling);
  const getColumnRenderers = (selectionsEnabled) => tableData.columns.map((c) => getCellRenderer(c, selectionsEnabled));
  const [columnRenderers, setColumnRenderers] = useState(getColumnRenderers(false));
  const [selState, selDispatch] = useReducer(reducer, {
    api: selectionsAPI,
    rows: [],
    colIdx: -1,
    isEnabled: !!selectionsAPI && !constraints.active,
  });

  useEffect(() => {
    const selectionsEnabled = !!selectionsAPI && !constraints.active;
    selDispatch({ type: 'set-enabled', payload: { isEnabled: selectionsEnabled } });
    setColumnRenderers(getColumnRenderers(selectionsEnabled));
  }, [constraints, layout]);

  useEffect(() => {
    addSelectionListeners(selectionsAPI, selDispatch);
  }, []);

  return (
    <TableBody>
      {rows.map((row, rowIndex) => (
        <TableRow
          hover={hoverEffect}
          role="checkbox"
          tabIndex={-1}
          key={row.key}
          className={`sn-table-row ${hoverEffect} && ${classes.hoverTableRow}`}
        >
          {columns.map((column, columnIndex) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[columnIndex];
            return (
              CellRenderer && (
                <CellRenderer
                  className={`${classes.tableCell} sn-table-cell`}
                  cell={cell}
                  column={column}
                  value={value}
                  key={column.id}
                  align={column.align}
                  selState={selState}
                  selDispatch={selDispatch}
                  tabIndex={-1}
                  rootElement={rootElement}
                  rowIndex={rowIndex + 1}
                  columnIndex={columnIndex}
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
};

export default React.memo(TableBodyWrapper);
