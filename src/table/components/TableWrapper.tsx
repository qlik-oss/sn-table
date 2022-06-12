import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import Table from '@mui/material/Table';

import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import FooterWrapper from './FooterWrapper';
import PaginationContent from './PaginationContent';
import useDidUpdateEffect from './useDidUpdateEffect';
import { useContextSelector, TableContext } from '../context';
import { StyledTableContainer, StyledTableWrapper } from '../styles';
import { handleTableWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, handleResetFocus, handleFocusoutEvent, getCellElement } from '../utils/handle-accessibility';
import { handleHorizontalScroll, handleNavigateTop } from '../utils/handle-scroll';
import announcementFactory from '../utils/announcement-factory';
import { TableWrapperProps } from '../../types';

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
  } = props;
  const { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns } = tableData;
  const { page, rowsPerPage } = pageInfo;
  const focusedCellCoord = useContextSelector(
    TableContext,
    (value: { focusedCellCoord: number[] }) => value.focusedCellCoord
  );
  const setFocusedCellCoord = useContextSelector(
    TableContext,
    (value: { setFocusedCellCoord: React.Dispatch<React.SetStateAction<number[]>> }) => value.setFocusedCellCoord
  );
  const shouldRefocus = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const announce = useMemo(() => announcementFactory(rootElement, translator), [translator.language]);

  const setShouldRefocus = useCallback(() => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  }, [rootElement]);

  const handleChangePage = useCallback(
    (pageIdx: number) => {
      setPageInfo({ ...pageInfo, page: pageIdx });
      announce({
        keys: ['SNTable.Pagination.PageStatusReport', [(pageIdx + 1).toString(), totalPages.toString()]],
        shouldBeAtomic: true,
        politeness: 'assertive',
      });
    },
    [pageInfo, setPageInfo, totalPages, announce]
  );

  const handleKeyDown = (evt: React.SyntheticEvent) => {
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
    (rows.length + 1).toString(),
    columns.length.toString(),
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
        fullHeight={footerContainer !== undefined || constraints.active || !paginationNeeded} // the footerContainer always wants height: 100%
        constraints={constraints}
        tabIndex={-1}
        role="application"
        data-testid="table-container"
      >
        <Table stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper {...props} />
          <TableBodyWrapper
            {...props}
            announce={announce}
            setShouldRefocus={setShouldRefocus}
            tableWrapperRef={tableWrapperRef}
          />
        </Table>
      </StyledTableContainer>
      {!constraints.active && (
        <FooterWrapper theme={theme} footerContainer={footerContainer}>
          <PaginationContent {...props} handleChangePage={handleChangePage} announce={announce} />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
}

TableWrapper.defaultProps = {
  announcer: null,
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
  footerContainer: PropTypes.object,
  direction: PropTypes.string,
  announcer: PropTypes.func,
};
