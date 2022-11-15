import React, { useState } from 'react';
import { WrapperProps } from './types';
import PaginationContent from '../footer/PaginationContent';
import { StyledTableWrapper } from '../styles';
import { PageInfo, TableData } from '../../../types';
import FooterWrapper from '../footer/FooterWrapper';
import TableContainer from './TableContainer';
import { MAX_PAGE_SIZE } from './constants';

export default function Wrapper(props: WrapperProps) {
  const { rect, layout, keyboard, translator, theme, model } = props;
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const pageSize = Math.min(MAX_PAGE_SIZE, totalRowCount);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    page: 0,
    rowsPerPage: pageSize,
    rowsPerPageOptions: [],
  });
  const paginationNeeded = totalRowCount > MAX_PAGE_SIZE;
  const tableData = {
    totalRowCount,
    totalColumnCount: layout.qHyperCube.qSize.qcx,
    totalPages: Math.ceil(totalRowCount / pageSize),
    paginationNeeded,
  } as TableData;

  return (
    <StyledTableWrapper
      data-key="wrapper"
      tableTheme={theme.table}
      paginationNeeded={paginationNeeded}
      dir="ltr"
      style={{ borderWidth: paginationNeeded ? '0px 1px 0px' : '0px 1px 1px' }}
    >
      <TableContainer
        layout={layout}
        rect={rect}
        model={model}
        pageInfo={pageInfo}
        paginationNeeded={paginationNeeded}
        theme={theme}
      />
      {paginationNeeded && (
        <FooterWrapper theme={theme}>
          <PaginationContent
            theme={theme}
            handleChangePage={(page) => setPageInfo((prev) => ({ ...prev, page }))}
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
