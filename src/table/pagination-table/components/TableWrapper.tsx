import React, { useRef, useCallback, useEffect } from 'react';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './body/TableBodyWrapper';
import TableHeadWrapper from './head/TableHeadWrapper';
import FooterWrapper from '../../components/footer/FooterWrapper';
import { useContextSelector, TableContext } from '../../context';
import { StyledTableContainer, StyledTable } from './styles';
import PaginationContent from '../../components/footer/PaginationContent';
import useDidUpdateEffect from '../../hooks/use-did-update-effect';
import useFocusListener from '../../hooks/use-focus-listener';
import useScrollListener from '../../hooks/use-scroll-listener';
import { handleWrapperKeyDown } from '../../utils/handle-keyboard';
import { updateFocus, resetFocus } from '../../utils/accessibility-utils';
import { getCellElement } from '../../utils/get-element-utils';
import { TableWrapperProps } from '../../types';
import { StyledTableWrapper } from '../../components/styles';
import useScrollbarWidth from '../../virtualized-table/hooks/use-scrollbar-width';
import { FIRST_BODY_CELL_COORD, FIRST_HEADER_CELL_COORD, FocusTypes } from '../../constants';

export default function TableWrapper(props: TableWrapperProps) {
  const { pageInfo, setPageInfo, direction, footerContainer, announce, areBasicFeaturesEnabled } = props;
  const { page, rowsPerPage } = pageInfo;

  const { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns, totalsPosition } =
    useContextSelector(TableContext, (value) => value.tableData);
  const { selectionsAPI, rootElement, keyboard, translator, theme, constraints } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );

  // const keyboardActive = useContextSelector(TableContext, (value) => value.baseProps.keyboard.active);
  const focusedCellCoord = useContextSelector(TableContext, (value) => value.focusedCellCoord);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const setYScrollbarWidth = useContextSelector(TableContext, (value) => value.setYScrollbarWidth);

  const isSelectionMode = selectionsAPI.isModal();

  const shouldRefocus = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const { yScrollbarWidth } = useScrollbarWidth(tableContainerRef);

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
  console.log('render wrapper', keyboard.active);

  useEffect(() => {
    console.log('useEffect');
    // When nebula handles keyboard navigation and keyboard.active changes,
    // make sure to focus the first cell or blur the focusedCellCoord
    // when keyboard.focus() runs, keyboard.active is true
    // when keyboard.blur() runs, keyboard.active is false
    const firstCellCoord = isSelectionMode ? FIRST_BODY_CELL_COORD : FIRST_HEADER_CELL_COORD;
    const focusType = isSelectionMode ? FocusTypes.FOCUS_BUTTON : FocusTypes.FOCUS;
    updateFocus({
      focusType: keyboard.active ? focusType : FocusTypes.BLUR,
      cell: getCellElement(rootElement, keyboard.active ? firstCellCoord : focusedCellCoord),
    });
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

  useDidUpdateEffect(() => {
    setYScrollbarWidth(yScrollbarWidth);
  }, [yScrollbarWidth]);

  const tableAriaLabel = `${translator.get('SNTable.Accessibility.RowsAndColumns', [
    String(rows.length + 1),
    String(columns.length),
  ])} ${translator.get('SNTable.Accessibility.NavigationInstructions')}`;

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
        <StyledTable customWidth={areBasicFeaturesEnabled} stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper areBasicFeaturesEnabled={areBasicFeaturesEnabled} />
          <TableBodyWrapper {...props} setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef} />
        </StyledTable>
      </StyledTableContainer>
      {!constraints.active && (
        <FooterWrapper footerContainer={footerContainer} paginationNeeded={paginationNeeded}>
          <PaginationContent {...props} handleChangePage={handleChangePage} isSelectionMode={isSelectionMode} />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
}
