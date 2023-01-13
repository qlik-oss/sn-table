import React, { useMemo, useState } from 'react';
import { WrapperProps } from './types';
import PaginationContent from '../footer/PaginationContent';
import { StyledTableWrapper } from '../styles';
import { PageInfo, TableData } from '../../../types';
import FooterWrapper from '../footer/FooterWrapper';
import Table from './Table';
import { MAX_PAGE_SIZE } from './constants';
import useOnPropsChange from './hooks/use-on-props-change';

export default function Wrapper(props: WrapperProps) {
  const {
    rect,
    layout,
    keyboard,
    translator,
    theme,
    model,
    constraints,
    selectionsAPI,
    embed,
    changeSortOrder,
    rootElement,
  } = props;
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const pageSize = Math.min(MAX_PAGE_SIZE, totalRowCount);
  const [page, setPage] = useState(0);
  const pageInfo = useMemo<PageInfo>(
    () => ({
      page,
      rowsPerPage: pageSize,
      rowsPerPageOptions: [],
    }),
    [pageSize, page]
  );
  const paginationNeeded = totalRowCount > MAX_PAGE_SIZE && !constraints.active;
  const tableData = {
    totalRowCount,
    totalColumnCount: layout.qHyperCube.qSize.qcx,
    totalPages: Math.ceil(totalRowCount / pageSize),
    paginationNeeded,
  } as TableData;

  // Reset page on new layout
  useOnPropsChange(() => setPage(0), [layout]);

  return (
    <StyledTableWrapper data-key="wrapper" background={theme.background} dir="ltr">
      <Table
        layout={layout}
        rect={rect}
        model={model}
        pageInfo={pageInfo}
        paginationNeeded={paginationNeeded}
        theme={theme}
        selectionsAPI={selectionsAPI}
        constraints={constraints}
        embed={embed}
        translator={translator}
        changeSortOrder={changeSortOrder}
        rootElement={rootElement}
      />
      {paginationNeeded && (
        <FooterWrapper theme={theme} withoutBorders>
          <PaginationContent
            theme={theme}
            handleChangePage={(currentPage) => setPage(currentPage)}
            isSelectionMode={false}
            tableData={tableData}
            pageInfo={pageInfo}
            setPageInfo={() => {}}
            keyboard={keyboard}
            translator={translator}
            constraints={constraints}
            rect={rect}
            announce={() => {}}
          />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
}
