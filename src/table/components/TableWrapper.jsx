import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import TablePaginationActions from './TablePaginationActions';
import useDidUpdateEffect from './useDidUpdateEffect';
import { handleTableWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, handleResetFocus, handleFocusoutEvent } from '../utils/handle-accessibility';
import { handleHorizontalScroll, handleNavigateTop } from '../utils/handle-scroll';
import announcementFactory from '../utils/announcement-factory';

export default function TableWrapper(props) {
  const {
    rootElement,
    tableData,
    pageInfo,
    setPageInfo,
    constraints,
    translator,
    selectionsAPI,
    theme,
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

  const SelectProps = {
    inputProps: {
      'aria-label': translator.get('SNTable.Pagination.RowsPerPage'),
      'data-testid': 'select',
      tabIndex: !keyboard.enabled || keyboard.active ? 0 : -1,
    },
    native: true,
  };

  const paperStyle = {
    borderWidth: '0px 1px 0px',
    borderStyle: 'solid',
    borderColor: theme.isBackgroundDarkColor ? ' #F2F2F3' : '#D9D9D9',
    height: '100%',
    backgroundColor: theme.backgroundColor,
    boxShadow: 'none',
    borderRadius: 'unset',
  };
  const tableContainerStyle = constraints.active
    ? {
        height: '100%',
        overflow: 'hidden',
      }
    : {
        height: 'calc(100% - 53px)',
        overflow: 'auto',
      };
  const paperTablePaginationStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 1,
    backgroundColor: theme.backgroundColor,
    boxShadow: 'none',
    borderRadius: 0,
    borderBottom: theme.isBackgroundDarkColor ? '1px solid #F2F2F3' : '1px solid #D9D9D9',
  };
  const tablePaginationStyle = [
    constraints.active && { display: 'none' },
    {
      color: theme.isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.9)' : '#404040',
      '& .MuiNativeSelect-icon': {
        color: theme.isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.9)' : '#404040',
      },
    },
  ];

  return (
    <Paper
      dir={direction}
      sx={paperStyle}
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
        sx={tableContainerStyle}
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
      <Paper sx={paperTablePaginationStyle}>
        <TablePagination
          sx={tablePaginationStyle}
          rowsPerPageOptions={fixedRowsPerPage ? [rowsPerPage] : rowsPerPageOptions}
          component="div"
          count={size.qcy}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={`${translator.get('SNTable.Pagination.RowsPerPage')}:`}
          page={page}
          SelectProps={SelectProps}
          labelDisplayedRows={({ from, to, count }) =>
            rect.width > 250 && translator.get('SNTable.Pagination.DisplayedRowsLabel', [`${from} - ${to}`, count])
          }
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={() => <div>{null}</div>}
          onPageChange={() => {}}
        />
        <TablePaginationActions
          theme={theme}
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
  direction: null,
};

TableWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  pageInfo: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  translator: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  rect: PropTypes.object.isRequired,
  direction: PropTypes.string,
  announcer: PropTypes.func,
};
