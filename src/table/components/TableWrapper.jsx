import PropTypes from 'prop-types';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import Table from '@mui/material/Table';

import TableFooter from '@mui/material/TableFooter';
import AnnounceElements from './AnnounceElements';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import TableTotals from './TableTotals';
import FooterWrapper from './FooterWrapper';
import { useContextSelector, TableContext } from '../context';
import { StyledTableContainer, StyledTableWrapper } from '../styles';

import PaginationContent from './PaginationContent';
import useDidUpdateEffect from '../hooks/use-did-update-effect';
import useFocusListener from '../hooks/use-focus-listener';
import useScrollListener from '../hooks/use-scroll-listener';
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
  const { totalColumnCount, totalRowCount, totalPages, paginationNeeded, rows, columns, totalsPosition } = tableData;
  const { page, rowsPerPage } = pageInfo;
  const isSelectionMode = selectionsAPI.isModal();
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
      announce({
        keys: [['SNTable.Pagination.PageStatusReport', (pageIdx + 1).toString(), totalPages.toString()]],
        politeness: 'assertive',
      });
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
      isSelectionMode,
    });
  };

  useFocusListener(tableWrapperRef, shouldRefocus, keyboard);
  useScrollListener(tableContainerRef, direction);

  useEffect(
    () => handleNavigateTop({ tableContainerRef, focusedCellCoord, rootElement }),
    [tableContainerRef, focusedCellCoord, rootElement]
  );

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
    handleResetFocus({
      focusedCellCoord,
      rootElement,
      shouldRefocus,
      setFocusedCellCoord,
      isSelectionMode,
      keyboard,
      announce,
    });
  }, [rows.length, totalRowCount, totalColumnCount, page]);

  const tableAriaLabel = `${translator.get('SNTable.Accessibility.RowsAndColumns', [
    rows.length + 1,
    columns.length,
  ])} ${translator.get('SNTable.Accessibility.NavigationInstructions')}`;

  const [height, setHeight] = useState(0);

  const updateCellHeight = (newHeight) => {
    setHeight(newHeight);
  };

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
        fullHeight={footerContainer || constraints.active || !paginationNeeded} // the footerContainer always wants height: 100%
        constraints={constraints}
        tabIndex={-1}
        role="application"
        data-testid="table-container"
      >
        <Table stickyHeader aria-label={tableAriaLabel}>
          <TableHeadWrapper {...props} updateCellHeight={updateCellHeight} />
          <TableBodyWrapper {...props} setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef}>
            {totalsPosition === 'top' ? <TableTotals {...props} height={height} /> : undefined}
          </TableBodyWrapper>
          {totalsPosition === 'bottom' && (
            <TableFooter>
              <TableTotals {...props} />
            </TableFooter>
          )}
        </Table>
      </StyledTableContainer>
      {!constraints.active && (
        <FooterWrapper theme={theme} footerContainer={footerContainer}>
          <PaginationContent {...props} handleChangePage={handleChangePage} isSelectionMode={selectionsAPI.isModal()} />
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
