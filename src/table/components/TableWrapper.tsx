import React, { useRef, useCallback } from 'react';
import Table from '@mui/material/Table';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './body/TableBodyWrapper';
import TableHeadWrapper from './head/TableHeadWrapper';
import FooterWrapper from './footer/FooterWrapper';
import { useContextSelector, TableContext } from '../context';
import { StyledTableContainer, StyledTableWrapper } from './styles';
import PaginationContent from './footer/PaginationContent';
import useDidUpdateEffect from '../hooks/use-did-update-effect';
import useFocusListener from '../hooks/use-focus-listener';
import useScrollListener from '../hooks/use-scroll-listener';
import { handleWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, resetFocus, getCellElement } from '../utils/accessibility-utils';
import { TableWrapperProps } from '../types';

export default function TableWrapper(props: TableWrapperProps) {
  const { tableData, pageInfo, setPageInfo, direction, footerContainer, announce } = props;
  const { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns, totalsPosition } = tableData;
  const { page, rowsPerPage } = pageInfo;
  const { selectionsAPI, rootElement, keyboard, translator, theme, constraints } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const focusedCellCoord = useContextSelector(TableContext, (value) => value.focusedCellCoord);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const shouldRefocus = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const isSelectionMode = selectionsAPI.isModal();

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

  console.log(focusedCellCoord);

  useFocusListener(tableWrapperRef, shouldRefocus, keyboard);
  useScrollListener(tableContainerRef, direction);

  useDidUpdateEffect(() => {
    // When nebula handles keyboard navigation and keyboard.active changes,
    // make sure to blur or focus the cell corresponding to focusedCellCoord
    // when keyboard.focus() runs, keyboard.active is true
    // when keyboard.blur() runs, keyboard.active is false
    const focusType = keyboard.active ? 'focusButton' : 'blur';
    const cellCoord = keyboard.active ? ([0, 0] as [number, number]) : focusedCellCoord;
    updateFocus({ focusType, cell: getCellElement(rootElement, cellCoord) });
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
    <StyledTableWrapper ref={tableWrapperRef} background={theme.background} dir={direction} onKeyDown={handleKeyDown}>
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
        <Table stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper {...props} />
          <TableBodyWrapper {...props} setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef} />
        </Table>
      </StyledTableContainer>
      {!constraints.active && (
        <FooterWrapper footerContainer={footerContainer} paginationNeeded={paginationNeeded}>
          <PaginationContent {...props} handleChangePage={handleChangePage} isSelectionMode={isSelectionMode} />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
}
