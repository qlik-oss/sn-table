import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { addSelectionListeners, reducer } from './selections-utils';
import getCellRenderer from './cells/renderer';
import { getBodyStyle } from './styling-utils';

const useStyles = makeStyles({
  tableCell: (props) => ({
    fontSize: props.fontSize,
    color: props.fontColor,
  }),
});

export default function TableBodyWrapper({ tableData, constraints, selectionsAPI, layout, theme }) {
  const { rows, columns } = tableData;
  const classes = useStyles(getBodyStyle(layout, theme));
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
    setColumnRenderers(tableData.columns.map((c) => getCellRenderer(c, selectionsEnabled)));
  }, [constraints, layout]);

  useEffect(() => {
    addSelectionListeners(selectionsAPI, selDispatch);
  }, []);

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.key}>
          {columns.map((column, i) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[i];
            return (
              <CellRenderer
                className={classes.tableCell}
                stylingClassName={classes.tableCell}
                cell={cell}
                column={column}
                value={value}
                key={column.id}
                align={column.align}
                selState={selState}
                selDispatch={selDispatch}
              >
                {value}
              </CellRenderer>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyWrapper.propTypes = {
  tableData: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
