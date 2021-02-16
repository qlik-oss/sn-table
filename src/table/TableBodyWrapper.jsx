import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { addSelectionListeners, reducer } from './selections-utils';
import { getCellRenderer } from './cells/renderer';
import { getBodyStyle } from './styling-utils';

const useStyles = makeStyles({
  tableCell: (props) => ({
    fontSize: props.fontSize,
    color: props.fontColor,
  }),
  hoverTableCell: (props) => ({
    '&:hover': {
      color: props.hoverFontColor,
    },
  }),
  hoverTableRow: (props) => ({
    '&&:hover': {
      backgroundColor: props.hoverBackGroundColor,
    },
  }),
});

export default function TableBodyWrapper({ tableData, constraints, selectionsAPI, layout, theme }) {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.hoverEffect;
  const classes = useStyles(getBodyStyle(layout, theme, hoverEffect));
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
        <TableRow
          hover={hoverEffect}
          role="checkbox"
          tabIndex={-1}
          key={row.key}
          className={hoverEffect && classes.hoverTableRow}
        >
          {columns.map((column, i) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[i];
            return CellRenderer ? (
              <CellRenderer
                stylingClassName={classes.tableCell}
                hoverStylingClassName={hoverEffect && classes.hoverTableCell}
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
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
