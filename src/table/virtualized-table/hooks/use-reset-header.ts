import { useLayoutEffect } from "react";
import { VariableSizeList } from "react-window";
import { PageInfo, TableLayout } from "../../../types";

const useResetHeader = (
  forwardRef: React.RefObject<VariableSizeList<unknown>>,
  layout: TableLayout,
  pageInfo: PageInfo,
  columnWidths: number[],
  themeName: string,
) => {
  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndex(0, true);
  }, [layout, pageInfo, forwardRef, columnWidths, themeName]);
};

export default useResetHeader;
