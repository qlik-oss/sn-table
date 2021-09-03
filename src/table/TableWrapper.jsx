import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import useDidUpdateEffect from './useDidUpdateEffect';
import { updatePage } from './cells/handle-key-press';
import { handleResetFocus } from './cells/handle-cell-focus';
import handleScroll from './handle-scroll';

const useStyles = makeStyles({
  paper: {
    height: '100%',
  },
  containerOverflowAuto: {
    height: 'calc(100% - 52px)',
    overflow: 'auto',
  },
  containerOverflowHidden: {
    height: '100%',
    overflow: 'hidden',
  },
  paginationHidden: {
    display: 'none',
  },
});

export default function TableWrapper(props) {
  const { rootElement, tableData, setPageInfo, constraints, selectionsAPI } = props;
  const { size, rows, columns } = tableData;
  const [tableWidth, setTableWidth] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [focusedCellCoordsState, setFocusedCellCoordsState] = useState([0, 0]);
  const [isMovingTop, setIsMovingTop] = useState(false);
  const shouldRefocus = useRef(false);
  const tableSection = useRef();
  const classes = useStyles();
  const containerMode = constraints.active ? 'containerOverflowHidden' : 'containerOverflowAuto';
  const paginationHidden = constraints.active && 'paginationHidden';
  const paginationFixedRpp = selectionsAPI.isModal() || tableWidth < 400;
  const setShouldRefocus = () => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  };

  const handleChangePage = (event, newPage) => {
    setPageInfo({ top: newPage * rowsPerPage, height: rowsPerPage });
    handleFocusedCellCordsUpd([0, 0]);
    setPage(newPage);
  };

  // should trigger reload
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPageInfo({ top: 0, height: +event.target.value });
    setPage(0);
  };

  if (!rows.length && page > 0) {
    handleChangePage(null, 0);
    return null;
  }

  useEffect(() => {
    const updateSize = () => setTableWidth(rootElement.clientWidth);
    window.addEventListener('resize', updateSize);
    tableSection.current.addEventListener('wheel', (evt) => handleScroll(evt, tableSection));
    return () => {
      window.removeEventListener('resize', updateSize);
      tableSection.current.removeEventListener('wheel', (evt) => handleScroll(evt, tableSection));
    };
  }, []);

  useEffect(() => {
    if (focusedCellCoordsState[0] < 2) {
      tableSection.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else if (isMovingTop) {
      setIsMovingTop(false);

      const rowElements = rootElement.getElementsByClassName('sn-table-row');
      const [x, y] = focusedCellCoordsState;
      const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y];

      if (cell.offsetTop - cell.offsetHeight * 2 < tableSection.current.scrollTop) {
        tableSection.current.scrollTo({
          top: tableSection.current.scrollTop - cell.offsetHeight || 0,
          behavior: 'smooth',
        });
      }
    }
  }, [tableSection, focusedCellCoordsState, isMovingTop, rootElement]);

  const handleFocusedCellCordsUpd = useCallback((newCoords) => {
    setFocusedCellCoordsState(newCoords);
  }, []);

  const handleSetMovingTop = useCallback((val) => setIsMovingTop(val), []);

  // Except for first render, whenever the size of the data changes (number of rows per page, rows or columns),
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    handleResetFocus({
      focusedCellCoordsState,
      rootElement,
      shouldRefocus,
      setFocusedCellCoordsState,
      hasSelections: selectionsAPI.isModal(),
    });
  }, [rows.length, size.qcy, size.qcx]);

  return (
    <Paper
      className={classes.paper}
      onKeyDown={(evt) => updatePage(evt, size.qcy, page, rowsPerPage, handleChangePage, setShouldRefocus)}
    >
      <TableContainer ref={tableSection} className={classes[containerMode]}>
        <Table stickyHeader aria-label={`showing ${rows.length + 1} rows and ${columns.length} columns`}>
          <TableHeadWrapper
            {...props}
            focusedCellCoord={focusedCellCoordsState}
            handleFocusedCellCordsUpd={handleFocusedCellCordsUpd}
          />
          <TableBodyWrapper
            {...props}
            focusedCellCoord={focusedCellCoordsState}
            handleFocusedCellCordsUpd={handleFocusedCellCordsUpd}
            setShouldRefocus={setShouldRefocus}
            handleSetMovingTop={handleSetMovingTop}
          />
        </Table>
      </TableContainer>
      <TablePagination
        className={classes[paginationHidden]}
        rowsPerPageOptions={paginationFixedRpp ? [rowsPerPage] : [10, 25, 100]}
        component="div"
        count={size.qcy}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page', 'data-testid': 'select' },
          native: true,
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

TableWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
};
