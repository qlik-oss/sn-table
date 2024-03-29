import React, { memo } from "react";
import { VariableSizeList } from "react-window";
import { TableContext, useContextSelector } from "../context";
import { listStyle } from "./Header";
import TotalsCell from "./TotalsCell";
import useResetHeader from "./hooks/use-reset-header";
import { TotalsProps } from "./types";

const Totals = (props: TotalsProps) => {
  const { rect, forwardRef, pageInfo, totals, rowHeight, columns } = props;
  const { layout, styling, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);

  useResetHeader(forwardRef, layout, pageInfo, columnWidths, theme.name());

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={listStyle}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidths[index]}
      height={rowHeight}
      width={rect.width}
      itemData={{ totalsStyle: styling.totals, columns, totals }}
    >
      {TotalsCell}
    </VariableSizeList>
  );
};

export default memo(Totals);
