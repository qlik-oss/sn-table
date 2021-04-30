import React, { useReducer, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { addSelectionListeners, reducer } from './selections-utils';
import getCellRenderer from './cells/renderer';
import { getBodyStyle } from './styling-utils';
import { bodyHandleKeyPress } from './cells/handle-key-press';
import { handleClickToFocusBody } from './cells/handle-cell-focus';

const useStyles = makeStyles({
  body: {
    height: ({ height }) => height,
  },
  cellBase: {
    '& td': {
      color: ({ color }) => color,
      fontSize: ({ fontSize }) => fontSize,
      padding: ({ padding }) => padding,
    },
  },
  hoverTableRow: {
    '&&:hover': {
      '& td:not(.selected)': {
        backgroundColor: ({ hoverBackgroundColor }) => hoverBackgroundColor,
        color: ({ hoverFontColor }) => hoverFontColor,
      },
    },
  },
  hideScrollbar: {
    scrollbarWidth: 'none' /* Firefox */,
    '&&::-webkit-scrollbar-track': {
      webkitBoxShadow: 'none',
      backgroundColor: 'transparent',
    },
    '&&::-webkit-scrollbar': {
      width: '3px',
      backgroundColor: 'transparent',
    },
    '&&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',
    },
  },
  showScrollbar: {
    /* total width and height */
    '&&::-webkit-scrollbar': {
      backgroundColor: 'transparent',
      width: '10px' /* width of vertical scrollbar */,
      height: '10px' /* height of horizontal scrollbar */,
    },

    /* background of the scrollbar except button or resizer */
    '&&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&&::-webkit-scrollbar-track:hover': {
      backgroundColor: '#f4f4f4',
    },

    /* scrollbar itself */
    '&&::-webkit-scrollbar-thumb': {
      backgroundColor: '#babac0',
      borderRadius: '16px',
    },
    '&&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#a0a0a5',
    },

    /* set button(top and bottom of the scrollbar) */
    '&&::-webkit-scrollbar-button': { display: 'none' },
  },
});

const TableBodyWrapper = ({
  rootElement,
  tableData,
  constraints,
  selectionsAPI,
  layout,
  theme,
  bodyHeight,
  focusedCellCoord,
  setShouldRefocus,
}) => {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const bodyStyle = useMemo(() => getBodyStyle(layout, theme), [layout, theme.name()]);
  const classes = useStyles({
    ...bodyStyle,
    height: `${bodyHeight}px`,
  });
  const selectionsEnabled = !!selectionsAPI && !constraints.active;
  const getColumnRenderers = tableData.columns.map((c) => getCellRenderer(!!c.stylingInfo.length, selectionsEnabled));
  const [columnRenderers, setColumnRenderers] = useState(() => getColumnRenderers);
  const [selState, selDispatch] = useReducer(reducer, {
    api: selectionsAPI,
    rows: [],
    colIdx: -1,
    isEnabled: selectionsEnabled,
  });
  const [isScrollbar, setIsScrollbar] = useState(false);

  useEffect(() => {
    selDispatch({ type: 'set-enabled', payload: { isEnabled: selectionsEnabled } });
    setColumnRenderers(getColumnRenderers);
  }, [selectionsEnabled, columns.length]);

  useEffect(() => {
    addSelectionListeners(selectionsAPI, selDispatch, setShouldRefocus);
    const bodyElement = document.getElementsByTagName('tbody')[0];
    const showScroll = () => setIsScrollbar(true);
    const hideScroll = () => setIsScrollbar(false);
    bodyElement.addEventListener('mouseover', showScroll, true);
    bodyElement.addEventListener('mouseleave', hideScroll, true);
    return () => {
      window.removeEventListener('mouseover', showScroll);
      window.removeEventListener('mouseleave', hideScroll);
    };
  }, []);

  return (
    <TableBody
      className={`${classes.body} ${classes.cellBase} ${isScrollbar ? classes.showScrollbar : classes.hideScrollbar}`}
    >
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
  bodyHeight: PropTypes.number.isRequired,
  focusedCellCoord: PropTypes.object.isRequired,
  setShouldRefocus: PropTypes.func.isRequired,
};

export default React.memo(TableBodyWrapper);
