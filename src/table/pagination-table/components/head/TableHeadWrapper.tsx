import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { memo, useEffect, useRef } from "react";

import { TableContext, useContextSelector } from "../../../context";
import HeadCell from "./HeadCell";

const TableHeadWrapper = () => {
  const { columns } = useContextSelector(TableContext, (value) => value.tableData);
  const { styling, viewService } = useContextSelector(TableContext, (value) => value.baseProps);
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);

  const headRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (headRowRef.current) {
      setHeadRowHeight(headRowRef.current.clientHeight);
    }
  }, [styling.head.fontSize, columnWidths, setHeadRowHeight]);

  if (viewService.viewState?.skipHeader) return null;

  return (
    <TableHead>
      <TableRow ref={headRowRef} className="sn-table-row sn-table-head-row">
        {columns.map((column, columnIndex) => (
          <HeadCell column={column} columnIndex={columnIndex} columnsLength={columns.length} />
        ))}
      </TableRow>
    </TableHead>
  );
};

export default memo(TableHeadWrapper);
