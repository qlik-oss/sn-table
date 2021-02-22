import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { addSelectionListeners, reducer } from './selections-utils';
import getCellRenderer from './cells/renderer';
import { getBodyStyle } from './styling-utils';

const useStyles = makeStyles({
  // 1. hoverEffect is true, there is no font color (hover or non-hover) and a hover background color, the font color does not change when the background color is set.
  // 2. hoverEffect is true, there is a hover font color but no hover background color, only a hover font color is applied when hovering
  // 3. hoverEffect is true, there is a font color and a hover font colors and no hover background color
  // 4. hoverEffect is true, there is a font color and no hover font colors and no hover background color
  tableCell: (props) => ({
    fontSize: props.fontSize,
    color: props.fontColor,
  }),
  hoverTableRow: (props) => ({
    '&&:hover': {
      backgroundColor: props.hoverBackGroundColor,
      '& td': {
        color: props.hoverFontColor,
      },
    },
  }),
});

export default function TableBodyWrapper({ tableData, constraints, selectionsAPI, layout, theme, cellLockedImage }) {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const classes = useStyles(getBodyStyle(layout, theme, hoverEffect));
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
      {rows.map((row) => (
        <TableRow
          hover={selState.isEnabled && hoverEffect}
          role="checkbox"
          tabIndex={-1}
          key={row.key}
          className={selState.isEnabled && hoverEffect && classes.hoverTableRow}
        >
          {columns.map((column, i) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[i];
            return (
              CellRenderer && (
                <CellRenderer
                  className={classes.tableCell}
                  cell={cell}
                  column={column}
                  value={value}
                  key={column.id}
                  align={column.align}
                  cellLockedImage={cellLockedImage}
                  selState={selState}
                  selDispatch={selDispatch}
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
}

TableBodyWrapper.propTypes = {
  tableData: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  cellLockedImage: PropTypes.string.isRequired,
};
