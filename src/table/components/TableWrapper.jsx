import PropTypes from 'prop-types';
import React, { useEffect, useRef, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import FooterWrapper from './FooterWrapper';
import PaginationContent from './PaginationContent';
import useDidUpdateEffect from '../../hooks/use-did-update-effect';
import { useContextSelector, TableContext } from '../context';
import { handleTableWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, handleResetFocus, handleFocusoutEvent } from '../utils/handle-accessibility';
import { handleHorizontalScroll, handleNavigateTop } from '../utils/handle-scroll';

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
    direction,
    footerContainer,
    announce,
  } = props;
  const { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns } = tableData;
  const { page, rowsPerPage } = pageInfo;
  const focusedCellCoord = useContextSelector(TableContext, (value) => value.focusedCellCoord);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const shouldRefocus = useRef(false);
  const tableContainerRef = useRef();
  const tableWrapperRef = useRef();

  const setShouldRefocus = useCallback(() => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  }, [rootElement]);

  const handleChangePage = useCallback(
    (pageIdx) => {
      setPageInfo({ ...pageInfo, page: pageIdx });
      announce({ keys: [['SNTable.Pagination.PageStatusReport', [pageIdx + 1, totalPages]]], politeness: 'assertive' });
    },
    [pageInfo, setPageInfo, totalPages, announce]
  );

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
  }, [rows.length, totalRowCount, totalColumnCount, page]);

  const tableAriaLabel = `${translator.get('SNTable.Accessibility.RowsAndColumns', [
    rows.length + 1,
    columns.length,
  ])} ${translator.get('SNTable.Accessibility.NavigationInstructions')}`;

  const paperStyle = {
    borderWidth: paginationNeeded ? '0px 1px 0px' : '0px',
    borderStyle: 'solid',
    borderColor: theme.table.borderColor,
    height: '100%',
    backgroundColor: theme.table.tableBackgroundColorFromTheme,
    boxShadow: 'none',
    borderRadius: 'unset',
  };

  const tableContainerStyle = {
    // the footerContainer always wants height: 100%
    height: footerContainer || constraints.active || !paginationNeeded ? '100%' : 'calc(100% - 49px)',
    overflow: constraints.active ? 'hidden' : 'auto',
  };

  return (
    <Paper
      dir={direction}
      sx={paperStyle}
      ref={tableWrapperRef}
      onKeyDown={(evt) =>
        handleTableWrapperKeyDown({
          evt,
          totalRowCount,
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
        data-testid="table-container"
      >
        <Table stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper {...props} />
          <TableBodyWrapper {...props} setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef} />
        </Table>
      </TableContainer>
      {!constraints.active && (
        <FooterWrapper theme={theme} footerContainer={footerContainer}>
          <PaginationContent {...props} handleChangePage={handleChangePage} />
        </FooterWrapper>
      )}
    </Paper>
  );
}

TableWrapper.defaultProps = {
  direction: null,
  footerContainer: null,
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
  announce: PropTypes.func.isRequired,
  footerContainer: PropTypes.object,
  direction: PropTypes.string,
};
