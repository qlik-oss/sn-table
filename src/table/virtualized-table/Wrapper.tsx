import React, { useMemo, useState } from 'react';
import { WrapperProps } from './types';
import PaginationContent from '../components/footer/PaginationContent';
import { StyledTableWrapper } from '../components/styles';
import { PageInfo, TableData } from '../../types';
import FooterWrapper from '../components/footer/FooterWrapper';
import Table from './Table';
import { MAX_PAGE_SIZE } from './constants';
import useOnPropsChange from './hooks/use-on-props-change';
import { TableContext, useContextSelector } from '../context';

export default function Wrapper(props: WrapperProps) {
  const { rect } = props;
  const { layout, theme, constraints } = useContextSelector(TableContext, (value) => value.baseProps);
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
    <StyledTableWrapper data-testid="sn-table" background={theme.background} dir="ltr">
      <Table rect={rect} pageInfo={pageInfo} paginationNeeded={paginationNeeded} />
      {paginationNeeded && (
        <FooterWrapper>
          <PaginationContent
            handleChangePage={(currentPage) => setPage(currentPage)}
            isSelectionMode={false}
            tableData={tableData}
            pageInfo={pageInfo}
            setPageInfo={() => {}}
            rect={rect}
            announce={() => {}}
          />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
}
