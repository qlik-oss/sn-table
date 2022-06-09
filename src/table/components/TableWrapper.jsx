import PropTypes from 'prop-types';
import React, { useEffect, useRef, useCallback } from 'react';
import Table from '@mui/material/Table';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import FooterWrapper from './FooterWrapper';
import PaginationContent from './PaginationContent';
import { useContextSelector, TableContext } from '../context';
import { StyledTableContainer, StyledTableWrapper } from '../styles';
import useDidUpdateEffect from '../hooks/use-did-update-effect';
import useFocusListener from '../hooks/use-focus-listener';
import useScrollListener from '../hooks/use-scroll-lietener';
import { handleTableWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, handleResetFocus, getCellElement } from '../utils/handle-accessibility';
import { handleNavigateTop } from '../utils/handle-scroll';

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

  const handleKeyDown = (evt) => {
    handleTableWrapperKeyDown({
      evt,
      totalRowCount,
      page,
      rowsPerPage,
      handleChangePage,
      setShouldRefocus,
      keyboard,
      isSelectionActive: selectionsAPI.isModal(),
    });
  };

  useFocusListener(tableWrapperRef, shouldRefocus, keyboard);
  useScrollListener(tableContainerRef, direction);

  useEffect(
    () => handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement }),
    [tableContainerRef, focusedCellCoord, rootElement]
  );

  useDidUpdateEffect(() => {
    if (!keyboard.enabled) return;

    updateFocus({ focusType: keyboard.active ? 'focus' : 'blur', cell: getCellElement(rootElement, focusedCellCoord) });
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
      keyboard,
      announce,
    });
  }, [rows.length, totalRowCount, totalColumnCount, page]);

  const tableAriaLabel = `${translator.get('SNTable.Accessibility.RowsAndColumns', [
    rows.length + 1,
    columns.length,
  ])} ${translator.get('SNTable.Accessibility.NavigationInstructions')}`;

  return (
    <StyledTableWrapper
      tableTheme={theme.table}
      paginationNeeded={paginationNeeded}
      dir={direction}
      ref={tableWrapperRef}
      onKeyDown={handleKeyDown}
    >
      <AnnounceElements />
      <StyledTableContainer
        ref={tableContainerRef}
        fullHeight={footerContainer || constraints.active || !paginationNeeded} // the footerContainer always wants height: 100%
        constraints={constraints}
        tabIndex={-1}
        role="application"
        data-testid="table-container"
      >
        <Table stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper {...props} />
          <TableBodyWrapper {...props} setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef} />
        </Table>
      </StyledTableContainer>
      {!constraints.active && (
        <FooterWrapper theme={theme} footerContainer={footerContainer}>
          <PaginationContent {...props} handleChangePage={handleChangePage} />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
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
