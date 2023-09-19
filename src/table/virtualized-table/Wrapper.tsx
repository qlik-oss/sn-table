import React, { memo } from 'react';
import { stardust } from '@nebula.js/stardust';
import { PaginationFooter } from "@qlik/nebula-table-utils/lib/components";
import { StyledTableWrapper } from '../components/styles';
import Table from './Table';
import { TableContext, useContextSelector } from '../context';
import { PageInfo } from '../../types';

const Wrapper = () => {
  const { theme, keyboard, translator, interactions, rect, layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const { paginationNeeded,totalRowCount, totalColumnCount, totalPages } = useContextSelector(TableContext, (value) => value.tableData);
  const pageInfo = useContextSelector(TableContext, (value) => value.pageInfo) as PageInfo;
  const setPage = useContextSelector(TableContext, (value) => value.setPage) as stardust.SetStateFn<number>;

  return (
    <StyledTableWrapper data-testid="sn-table" background={theme.background} dir="ltr">
      <Table pageInfo={pageInfo} />
      <PaginationFooter
        paginationNeeded={paginationNeeded}
        handleChangePage={(currentPage) => setPage(currentPage)}
        pageInfo={pageInfo}
        totalRowCount={totalRowCount}
        totalColumnCount={totalColumnCount}
        totalPages={totalPages}
        keyboard={keyboard}
        translator={translator}
        theme={theme}
        interactions={interactions}
        rect={rect}
        layout={layout as unknown as EngineAPI.IGenericHyperCubeLayout}
      />
    </StyledTableWrapper>
  );
};

export default memo(Wrapper);
