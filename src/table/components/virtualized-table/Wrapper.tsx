import React, { useMemo, useState } from 'react';
import { WrapperProps } from './types';
import PaginationContent from '../footer/PaginationContent';
import { StyledTableWrapper } from '../styles';
import { PageInfo, TableData } from '../../../types';
import FooterWrapper from '../footer/FooterWrapper';
import Table from './TableContainer';
import { MAX_PAGE_SIZE } from './constants';
import useOnPropsChange from './hooks/use-on-props-change';

export default function Wrapper(props: WrapperProps) {
  const { rect, layout, keyboard, translator, theme, model, selectionsAPI } = props;
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
  const paginationNeeded = totalRowCount > MAX_PAGE_SIZE;
  const tableData = {
    totalRowCount,
    totalColumnCount: layout.qHyperCube.qSize.qcx,
    totalPages: Math.ceil(totalRowCount / pageSize),
    paginationNeeded,
  } as TableData;

  // Reset page on new layout
  useOnPropsChange(() => setPage(0), [layout]);

  return (
    <StyledTableWrapper
      data-key="wrapper"
      tableTheme={theme.table}
      paginationNeeded={paginationNeeded}
      dir="ltr"
      style={{ borderWidth: paginationNeeded ? '0px 1px 0px' : '0px 1px 1px' }}
    >
      <Table
        layout={layout}
        rect={rect}
        model={model}
        pageInfo={pageInfo}
        paginationNeeded={paginationNeeded}
        theme={theme}
        selectionsAPI={selectionsAPI}
      />
      {paginationNeeded && (
        <FooterWrapper theme={theme}>
          <PaginationContent
            theme={theme}
            handleChangePage={(currentPage) => setPage(currentPage)}
            isSelectionMode={false}
            tableData={tableData}
            pageInfo={pageInfo}
            setPageInfo={() => {}}
            keyboard={keyboard}
            translator={translator}
            constraints={{}}
            rect={rect}
            announce={() => {}}
          />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
}
