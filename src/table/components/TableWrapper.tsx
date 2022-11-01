import React, { useRef, useCallback } from 'react';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import FooterWrapper from './FooterWrapper';
import { useContextSelector, TableContext } from '../context';
import { StyledTableContainer, StyledTableWrapper, StyledTable } from '../styles';

import PaginationContent from './PaginationContent';
import useDidUpdateEffect from '../hooks/use-did-update-effect';
import useFocusListener from '../hooks/use-focus-listener';
import useScrollListener from '../hooks/use-scroll-listener';
import { handleWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, resetFocus, getCellElement } from '../utils/accessibility-utils';
import { TableWrapperProps } from '../types';

export default function TableWrapper(props: TableWrapperProps) {
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
  const { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns, totalsPosition } = tableData;
  const { page, rowsPerPage } = pageInfo;
  const isSelectionMode = selectionsAPI.isModal();
  const focusedCellCoord = useContextSelector(TableContext, (value) => value.focusedCellCoord);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const shouldRefocus = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>();
  const tableWrapperRef = useRef<HTMLDivElement>();

  const setShouldRefocus = useCallback(() => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  }, [rootElement]);

  const handleChangePage = useCallback(
    (pageIdx: number) => {
      setPageInfo({ ...pageInfo, page: pageIdx });
      announce({
        keys: [['SNTable.Pagination.PageStatusReport', (pageIdx + 1).toString(), totalPages.toString()]],
        politeness: 'assertive',
      });
    },
    [pageInfo, setPageInfo, totalPages, announce]
  );

  const handleKeyDown = (evt: React.KeyboardEvent) => {
    handleWrapperKeyDown({
      evt,
      totalRowCount,
      page,
      rowsPerPage,
      handleChangePage,
      setShouldRefocus,
      keyboard,
      isSelectionMode,
    });
  };

  useFocusListener(tableWrapperRef, shouldRefocus, keyboard);
  useScrollListener(tableContainerRef, direction);

  useDidUpdateEffect(() => {
    // When nebula handles keyboard navigation and keyboard.active changes,
    // make sure to blur or focus the cell corresponding to focusedCellCoord
    // when keyboard.focus() runs, keyboard.active is true
    // when keyboard.blur() runs, keyboard.active is false
    updateFocus({ focusType: keyboard.active ? 'focus' : 'blur', cell: getCellElement(rootElement, focusedCellCoord) });
  }, [keyboard.active]);

  // Except for first render, whenever the size of the data (number of rows per page, rows, columns) or page changes,
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    resetFocus({
      focusedCellCoord,
      rootElement,
      shouldRefocus,
      setFocusedCellCoord,
      isSelectionMode,
      keyboard,
      announce,
      totalsPosition,
    });
  }, [rows.length, totalRowCount, totalColumnCount, page]);

  const tableAriaLabel = `${translator.get('SNTable.Accessibility.RowsAndColumns', [
    String(rows.length + 1),
    String(columns.length),
  ])} ${translator.get('SNTable.Accessibility.NavigationInstructions')}`;

  return (
    <StyledTableWrapper
      ref={tableWrapperRef}
      tableTheme={theme.table}
      paginationNeeded={paginationNeeded}
      dir={direction}
      onKeyDown={handleKeyDown}
    >
      <AnnounceElements />
      <StyledTableContainer
        ref={tableContainerRef}
        className="sn-table-container"
        fullHeight={footerContainer || constraints.active || !paginationNeeded} // the footerContainer always wants height: 100%
        constraints={constraints}
        tabIndex={-1}
        role="application"
        data-testid="table-container"
      >
        <StyledTable stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper {...props} />
          <TableBodyWrapper {...props} setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef} />
        </StyledTable>
      </StyledTableContainer>
      {!constraints.active && (
        <FooterWrapper theme={theme} footerContainer={footerContainer}>
          <PaginationContent {...props} handleChangePage={handleChangePage} isSelectionMode={isSelectionMode} />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
}
