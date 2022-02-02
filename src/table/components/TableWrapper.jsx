import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import TablePaginationActions from './TablePaginationActions';
import useDidUpdateEffect from './useDidUpdateEffect';
import { handleTableWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, handleResetFocus, handleFocusoutEvent } from '../utils/handle-accessibility';
import { handleHorizontalScroll, handleNavigateTop } from '../utils/handle-scroll';
import announcementFactory from '../utils/announcement-factory';

const useStyles = makeStyles({
  paper: {
    height: '100%',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  containerOverflowAuto: {
    height: 'calc(100% - 52px)',
    overflow: 'auto',
  },
  containerOverflowHidden: {
    height: '100%',
    overflow: 'hidden',
  },
  tablePaginationSection: {
    backgroundColor: 'rgb(255, 255, 255)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  paginationHidden: {
    display: 'none',
  },
});

export default function TableWrapper(props) {
  const {
    rootElement,
    tableData,
    pageInfo,
    setPageInfo,
    constraints,
    translator,
    selectionsAPI,
    keyboard,
    rect,
    direction,
    announcer, // this is only for testing purposes
  } = props;
  const { size, rows, columns } = tableData;
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;
  const [focusedCellCoord, setFocusedCellCoord] = useState([0, 0]);
  const shouldRefocus = useRef(false);
  const tableContainerRef = useRef();
  const tableWrapperRef = useRef();

  const classes = useStyles();

  const containerMode = constraints.active ? 'containerOverflowHidden' : 'containerOverflowAuto';
  const paginationHidden = constraints.active && 'paginationHidden';
  const fixedRowsPerPage = selectionsAPI.isModal() || rect.width < 550 || size.qcx > 100;
  /* eslint-disable react-hooks/rules-of-hooks */
  const announce = announcer || useMemo(() => announcementFactory(rootElement, translator), [translator.language]);
  const totalPages = Math.ceil(size.qcy / rowsPerPage);
  const tableAriaLabel = `${translator.get('SNTable.Accessibility.RowsAndColumns', [
    rows.length + 1,
    columns.length,
  ])} ${translator.get('SNTable.Accessibility.NavigationInstructions')}`;

  const setShouldRefocus = () => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  };

  const handleChangePage = (pageIdx) => {
    setPageInfo({ ...pageInfo, page: pageIdx });
    announce({ keys: [['SNTable.Pagination.PageStatusReport', [pageIdx + 1, totalPages]]], politeness: 'assertive' });
  };
  const handleChangeRowsPerPage = (evt) => {
    setPageInfo({ ...pageInfo, page: 0, rowsPerPage: +evt.target.value });
    announce({ keys: [['SNTable.Pagination.RowsPerPageChange', evt.target.value]], politeness: 'assertive' });
  };

  useEffect(() => {
    const memoedWrapper = tableWrapperRef.current;
    if (!memoedWrapper) return () => {};

    const focusOutCallback = (evt) => handleFocusoutEvent(evt, shouldRefocus, keyboard);
    memoedWrapper.addEventListener('focusout', focusOutCallback);

    return () => {
      memoedWrapper.removeEventListener('focusout', focusOutCallback);
    };
  }, []);

  useEffect(() => {
    const memoedContainer = tableContainerRef.current;
    if (!memoedContainer) return () => {};

    const horizontalScrollCallback = (evt) => handleHorizontalScroll(evt, direction === 'rtl', memoedContainer);
    memoedContainer.addEventListener('wheel', horizontalScrollCallback);

    return () => {
      memoedContainer.removeEventListener('wheel', horizontalScrollCallback);
    };
  }, [direction]);

  useEffect(
    () => handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement }),
    [tableContainerRef, focusedCellCoord]
  );

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
      shouldAddTabstop: !keyboard.enabled || keyboard.active,
      announce,
    });
  }, [rows.length, size.qcy, size.qcx, page]);

  return (
    <Paper
      dir={direction}
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
          isSelectionActive: selectionsAPI.isModal(),
        })
      }
    >
      <AnnounceElements />
      <TableContainer
        ref={tableContainerRef}
        className={classes[containerMode]}
        tabIndex={-1}
        role="application"
        data-testid="table-wrapper"
      >
        <Table stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper {...props} setFocusedCellCoord={setFocusedCellCoord} focusedCellCoord={focusedCellCoord} />
          <TableBodyWrapper
            {...props}
            announce={announce}
            focusedCellCoord={focusedCellCoord}
            setFocusedCellCoord={setFocusedCellCoord}
            setShouldRefocus={setShouldRefocus}
            tableWrapperRef={tableWrapperRef}
          />
        </Table>
      </TableContainer>
      <Paper className={classes.tablePaginationSection}>
        <TablePagination
          className={classes[paginationHidden]}
          rowsPerPageOptions={fixedRowsPerPage ? [rowsPerPage] : rowsPerPageOptions}
          component="div"
          count={size.qcy}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={translator.get('SNTable.Pagination.RowsPerPage')}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': translator.get('SNTable.Pagination.RowsPerPage'),
              'data-testid': 'select',
              style: {
                color: '#404040',
              },
              tabIndex: !keyboard.enabled || keyboard.active ? 0 : -1,
            },
            native: true,
          }}
          labelDisplayedRows={({ from, to, count }) =>
            rect.width > 250 && translator.get('SNTable.Pagination.DisplayedRowsLabel', [`${from} - ${to}`, count])
          }
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={() => <div>{null}</div>}
          onPageChange={() => {}}
        />
        <TablePaginationActions
          direction={direction}
          page={page}
          onPageChange={handleChangePage}
          lastPageIdx={Math.ceil(size.qcy / rowsPerPage) - 1}
          keyboard={keyboard}
          isInSelectionMode={selectionsAPI.isModal()}
          tableWidth={rect.width}
          translator={translator}
        />
      </Paper>
    </Paper>
  );
}

TableWrapper.defaultProps = {
  announcer: null,
};

TableWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  pageInfo: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  translator: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  rect: PropTypes.object.isRequired,
  direction: PropTypes.string.isRequired,
  announcer: PropTypes.func,
};
