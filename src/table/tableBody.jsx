import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { addSelectionListeners, reducer } from './selections-utils';
import getCellRenderer from './cells/renderer';

export default function TableBodyWrapper({ tableData, constraints, selectionsAPI }) {
  const { rows, columns } = tableData;

  const [columnRenderers, setColumnRenderers] = useState([]);
  const [selState, selDispatch] = useReducer(reducer, {
    api: selectionsAPI,
    rows: [],
    colIdx: -1,
    isEnabled: !!selectionsAPI && !constraints.active,
  });

  useEffect(() => {
    const isEnabled = !!selectionsAPI && !constraints.active;
    selDispatch({ type: 'set-enabled', payload: { isEnabled } });
    setColumnRenderers(tableData.columns.map((c) => getCellRenderer(c, isEnabled)));
  }, [constraints]);

  useEffect(() => {
    addSelectionListeners(selectionsAPI, selDispatch);
  }, []);

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
          {columns.map((column, i) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[i];
            return CellRenderer ? (
              <CellRenderer
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
            ) : (
              <TableCell key={column.id} align={column.align}>
                {value}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyWrapper.propTypes = {
  tableData: PropTypes.object.isRequired,
  constraints: PropTypes.array.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
};
