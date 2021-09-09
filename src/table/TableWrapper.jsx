import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
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

const useStyles2 = makeStyles({
  root: {
    flexShrink: 0,
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.3)',
    '&:hover': {

    }
  }
});

function TablePaginationActions(props) {
  const classes = useStyles2();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const onFirstPage = page === 0;
  const onLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <div className={classes.root}>
      <IconButton 
        onClick={onFirstPage ? undefined : handleFirstPageButtonClick}
        aria-disabled={onFirstPage}
        aria-label="first page"
        title="First page"
        className={onFirstPage && classes.disabled}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton 
        onClick={onFirstPage ? undefined : handleBackButtonClick}
        aria-disabled={onFirstPage}
        aria-label="previous page"
        title="Previous page"
        className={onFirstPage && classes.disabled}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton 
        onClick={onLastPage ? undefined : handleNextButtonClick}
        aria-disabled={onLastPage}
        aria-label="next page"
        title="Next page"
        className={onLastPage && classes.disabled}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton 
        onClick={onLastPage ? undefined : handleLastPageButtonClick}
        aria-disabled={onLastPage}
        aria-label="last page"
        title="Last page"
        className={onLastPage && classes.disabled}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function TableWrapper(props) {
  const { rootElement, tableData, setPageInfo, constraints, selectionsAPI } = props;
  const { size, rows, columns } = tableData;
  const [tableWidth, setTableWidth] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const focusedCellCoord = useRef([0, 0]);
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

  // Except for first render, whenever the size of the data changes (number of rows per page, rows or columns),
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    handleResetFocus(focusedCellCoord, rootElement, shouldRefocus, selectionsAPI.isModal());
  }, [rows.length, size.qcy, size.qcx]);

  return (
    <Paper
      className={classes.paper}
      onKeyDown={(evt) => updatePage(evt, size.qcy, page, rowsPerPage, handleChangePage, setShouldRefocus)}
    >
      <TableContainer ref={tableSection} className={classes[containerMode]}>
        <Table stickyHeader aria-label={`showing ${rows.length + 1} rows and ${columns.length} columns`}>
          <TableHeadWrapper {...props} focusedCellCoord={focusedCellCoord} />
          <TableBodyWrapper {...props} focusedCellCoord={focusedCellCoord} setShouldRefocus={setShouldRefocus} />
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
        ActionsComponent={TablePaginationActions}
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
