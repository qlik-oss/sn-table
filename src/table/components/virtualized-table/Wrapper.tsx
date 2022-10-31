import React from 'react';
import { VirtualizedTableProps } from './types';
import PaginationContent from '../PaginationContent';
import { StyledTableWrapper } from '../../styles';
import { PageInfo, TableData } from '../../../types';
import FooterWrapper from '../FooterWrapper';
import TableContainer from './TableContainer';

export default function Wrapper(props: VirtualizedTableProps) {
  const { rect, layout, keyboard, translator, theme } = props;

  return (
    <StyledTableWrapper data-key="wrapper" tableTheme={theme.table} paginationNeeded dir="ltr">
      <TableContainer {...props} />
      <FooterWrapper theme={theme}>
        <PaginationContent
          theme={theme}
          handleChangePage={() => console.log()}
          isSelectionMode={false}
          tableData={
            {
              totalRowCount: layout.qHyperCube.qSize.qcy,
              totalColumnCount: layout.qHyperCube.qSize.qcx,
              totalPages: 1,
              paginationNeeded: true,
            } as TableData
          }
          pageInfo={{ page: 1, rowsPerPage: 10, rowsPerPageOptions: [10] } as unknown as PageInfo}
          setPageInfo={() => {}}
          keyboard={keyboard}
          translator={translator}
          constraints={{}}
          rect={rect}
          announce={() => {}}
        />
      </FooterWrapper>
    </StyledTableWrapper>
  );
}
