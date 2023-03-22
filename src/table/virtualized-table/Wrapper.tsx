import React, { memo } from 'react';
import { stardust } from '@nebula.js/stardust';
import PaginationContent from '../components/footer/PaginationContent';
import { StyledTableWrapper } from '../components/styles';
import FooterWrapper from '../components/footer/FooterWrapper';
import Table from './Table';
import { TableContext, useContextSelector } from '../context';
import { PageInfo } from '../../types';

const Wrapper = () => {
  const { theme, rect } = useContextSelector(TableContext, (value) => value.baseProps);
  const { paginationNeeded } = useContextSelector(TableContext, (value) => value.tableData);
  const pageInfo = useContextSelector(TableContext, (value) => value.pageInfo) as PageInfo;
  const setPage = useContextSelector(TableContext, (value) => value.setPage) as stardust.SetStateFn<number>;

  return (
    <StyledTableWrapper data-testid="sn-table" background={theme.background} dir="ltr">
      <Table rect={rect} pageInfo={pageInfo} />
      {paginationNeeded && (
        <FooterWrapper>
          <PaginationContent
            handleChangePage={(currentPage) => setPage(currentPage)}
            isSelectionMode={false}
            pageInfo={pageInfo}
            setPageInfo={() => {}}
            announce={() => {}}
          />
        </FooterWrapper>
      )}
    </StyledTableWrapper>
  );
};

export default memo(Wrapper);
