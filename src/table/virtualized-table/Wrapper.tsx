import { stardust } from "@nebula.js/stardust";
import React, { memo } from "react";
import { PageInfo } from "../../types";
import FooterWrapper from "../components/footer/FooterWrapper";
import PaginationContent from "../components/footer/PaginationContent";
import { StyledTableWrapper } from "../components/styles";
import { TableContext, useContextSelector } from "../context";
import Table from "./Table";

const Wrapper = () => {
  const { theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const { paginationNeeded } = useContextSelector(TableContext, (value) => value.tableData);
  const pageInfo = useContextSelector(TableContext, (value) => value.pageInfo) as PageInfo;
  const setPage = useContextSelector(TableContext, (value) => value.setPage) as stardust.SetStateFn<number>;

  return (
    <StyledTableWrapper data-testid="sn-table" background={theme.background} dir="ltr">
      <Table pageInfo={pageInfo} />
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
