import { useMemo } from "react";
import { ExtendedTheme, TableData, TableLayout } from "../../types";
import { getBodyStyle, getHeaderStyle, getTotalsStyle } from "../utils/styling-utils";

const useTableStyling = (layout: TableLayout, theme: ExtendedTheme, tableData: TableData, rootElement: HTMLElement) => {
  const styling = useMemo(() => {
    const totalsAtTop = tableData.totalsPosition.atTop;
    const body = getBodyStyle(layout, theme, tableData.rows.length, rootElement);
    const head = getHeaderStyle(layout, theme, !totalsAtTop);
    const totals = getTotalsStyle(layout, theme, totalsAtTop);

    return { body, head, totals };
  }, [layout, theme.name(), tableData, rootElement]);

  return styling;
};

export default useTableStyling;
