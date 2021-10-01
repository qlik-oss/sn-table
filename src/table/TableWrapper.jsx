import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import TablePaginationActions from './TablePaginationActions';
import useDidUpdateEffect from './useDidUpdateEffect';
import { handleTableWrapperKeyDown } from './cells/handle-key-press';
import { updateFocus, handleResetFocus, handleNavigateTop, handleFocusoutEvent } from './cells/handle-cell-focus';
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
  const { rootElement, tableData, setPageInfo, constraints, translator, selectionsAPI, keyboard } = props;
  const { size, rows, columns } = tableData;
  const [tableWidth, setTableWidth] = useState(rootElement.clientWidth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [focusedCellCoord, setFocusedCellCoord] = useState([0, 0]);
  const shouldRefocus = useRef(false);
  const tableSectionRef = useRef();
  const tableWrapperRef = useRef();
  const classes = useStyles();
  const containerMode = constraints.active ? 'containerOverflowHidden' : 'containerOverflowAuto';
  const paginationHidden = constraints.active && 'paginationHidden';
  const paginationFixedRpp = selectionsAPI.isModal() || tableWidth < 475;
  const setShouldRefocus = () => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  };

  const handleChangePage = (event, newPage) => {
    setPageInfo({ top: newPage * rowsPerPage, height: rowsPerPage });
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
    const resizeCallback = () => setTableWidth(rootElement.clientWidth);
    const scrollCallback = (evt) => handleScroll(evt, tableSectionRef);
    const focusOutCallback = (evt) => handleFocusoutEvent(evt, shouldRefocus, keyboard.blur);

    window.addEventListener('resize', resizeCallback);
    tableSectionRef.current.addEventListener('wheel', scrollCallback);
    tableWrapperRef.current.addEventListener('focusout', focusOutCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
      tableSectionRef.current.removeEventListener('wheel', scrollCallback);
      tableWrapperRef.current.removeEventListener('focusout', focusOutCallback);
    };
  }, []);

  useEffect(() => {
    handleNavigateTop({
      tableSectionRef,
      focusedCellCoord,
      rootElement,
    });
  }, [tableSectionRef, focusedCellCoord]);

  useDidUpdateEffect(() => {
    if (!keyboard.enabled) return;

    updateFocus({
      focusType: keyboard.active ? 'focus' : 'blur',
      rowElements: rootElement.getElementsByClassName('sn-table-row'),
      cellCoord: focusedCellCoord,
    });
  }, [keyboard.active]);

  // Except for first render, whenever the size of the data (number of rows per page, rows, columns) or page changes,
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    handleResetFocus({
      focusedCellCoord,
      rootElement,
      shouldRefocus,
      setFocusedCellCoord,
      hasSelections: selectionsAPI.isModal(),
      shouldAddTabstop: keyboard.active,
    });
  }, [rows.length, size.qcy, size.qcx, page]);

  return (
    <Paper
      className={classes.paper}
      ref={tableWrapperRef}
      onKeyDown={(evt) =>
        handleTableWrapperKeyDown({
          evt,
          totalRowSize: size.qcy,
          page,
          rowsPerPage,
          handleChangePage,
          setShouldRefocus,
          keyboard,
        })
      }
    >
      <TableContainer
        ref={tableSectionRef}
        className={classes[containerMode]}
        tabIndex="-1"
        data-testid="table-wrapper"
      >
        <Table
          stickyHeader
          aria-label={translator.get('SNTable.Accessibility.RowsAndColumns', [
            `${rows.length + 1}`,
            `${columns.length}`,
          ])}
        >
          <TableHeadWrapper {...props} setFocusedCellCoord={setFocusedCellCoord} />
          <TableBodyWrapper {...props} setFocusedCellCoord={setFocusedCellCoord} setShouldRefocus={setShouldRefocus} />
        </Table>
      </TableContainer>
      <TablePagination
        className={classes[paginationHidden]}
        rowsPerPageOptions={paginationFixedRpp ? [rowsPerPage] : [10, 25, 100]}
        component="div"
        count={size.qcy}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={`${translator.get('SNTable.Pagination.RowsPerPage')}:`}
        page={page}
        SelectProps={{
          inputProps: {
            'aria-label': translator.get('SNTable.Pagination.RowsPerPage'),
            'data-testid': 'select',
          },
          native: true,
        }}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}

TableWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  translator: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
};
