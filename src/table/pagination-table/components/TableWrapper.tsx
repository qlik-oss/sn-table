import React, { useRef, useCallback, useEffect, memo } from 'react';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './body/TableBodyWrapper';
import TableHeadWrapper from './head/TableHeadWrapper';
import FooterWrapper from '../../components/FooterWrapper';
import { useContextSelector, TableContext } from '../../context';
import { StyledTableContainer, StyledTable } from './styles';
import useDidUpdateEffect from '../../hooks/use-did-update-effect';
import useFocusListener from '../../hooks/use-focus-listener';
import useScrollListener from '../../hooks/use-scroll-listener';
import { handleWrapperKeyDown } from '../../utils/handle-keyboard';
import { resetFocus } from '../../utils/accessibility-utils';
import { TableWrapperProps } from '../../types';
import { StyledTableWrapper } from '../../components/styles';
import useScrollbarWidth from '../../virtualized-table/hooks/use-scrollbar-width';
import useKeyboardActiveListener from '../../hooks/use-keyboard-active-listener';
import { SelectionActions } from '../../constants';

function TableWrapper(props: TableWrapperProps) {
  const { pageInfo, setPageInfo, direction, footerContainer, announce, viewService } = props;
  const { page, rowsPerPage } = pageInfo;

  const tableData = useContextSelector(TableContext, (value) => value.tableData);
  const { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns, totalsPosition } = tableData;
  const { selectionsAPI, rootElement, keyboard, translator, theme, constraints, styling } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const focusedCellCoord = useContextSelector(TableContext, (value) => value.focusedCellCoord);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const setYScrollbarWidth = useContextSelector(TableContext, (value) => value.setYScrollbarWidth);
  const showRightBorder = useContextSelector(TableContext, (value) => value.showRightBorder);
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

  const shouldRefocus = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const { yScrollbarWidth } = useScrollbarWidth(tableContainerRef);
  const isSelectionMode = selectionsAPI?.isModal();

  const tableAriaLabel = `${translator.get('SNTable.Accessibility.RowsAndColumns', [
    String(rows.length + 1),
    String(columns.length),
  ])} ${translator.get('SNTable.Accessibility.NavigationInstructions')}`;

  const { scrollLeft } = viewService;

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
  useScrollListener(tableContainerRef, direction, viewService);
  useKeyboardActiveListener();

  useEffect(() => {
    tableContainerRef.current?.scrollTo(scrollLeft, 0);
  }, [pageInfo, totalRowCount, scrollLeft]);

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

  useDidUpdateEffect(() => {
    setYScrollbarWidth(yScrollbarWidth);
  }, [yScrollbarWidth]);

  useDidUpdateEffect(() => {
    selectionDispatch({ type: SelectionActions.UPDATE_PAGE_ROWS, payload: { pageRows: rows } });
  }, [rows]);

  return (
    <StyledTableWrapper
      ref={tableWrapperRef}
      background={theme.background}
      dir={direction}
      onKeyDown={handleKeyDown}
      data-testid="sn-table"
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
        <StyledTable styling={styling} showRightBorder={showRightBorder} stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper />
          <TableBodyWrapper {...props} setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef} />
        </StyledTable>
      </StyledTableContainer>
      {!constraints.active && (
        <FooterWrapper {...props} handleChangePage={handleChangePage} isSelectionMode={isSelectionMode} />
      )}
    </StyledTableWrapper>
  );
}

export default memo(TableWrapper);
