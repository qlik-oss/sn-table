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
    scrollbarWidth: 'thin' /* Firefox */,
    '&&::-webkit-scrollbar-track': {
      webkitBoxShadow: 'none',
      backgroundColor: 'transparent',
    },
    '&&::-webkit-scrollbar': {
      width: '6px' /* width of vertical scrollbar */,
      height: '6px' /* height of horizontal scrollbar */,
      backgroundColor: 'transparent',
    },
    '&&::-webkit-scrollbar-thumb': {
      backgroundColor: '#acacac',
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

  let isScrolling;
  useEffect(() => {
    addSelectionListeners(selectionsAPI, selDispatch, setShouldRefocus);
    const handleScroll = () => {
      isScrollbar === false && setIsScrollbar(true);
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);
      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(() => setIsScrollbar(false), 100);
    };
    // to display scrolling bar when the user scrolls in windows
    navigator.appVersion.indexOf('Win') !== -1 && window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <TableBody
      className={`${classes.body} ${classes.cellBase} ${
        navigator.appVersion.indexOf('Win') !== -1 && isScrollbar ? classes.showScrollbar : classes.hideScrollbar
      }`}
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
