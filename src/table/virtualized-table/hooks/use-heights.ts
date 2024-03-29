import { VariableSizeList } from "react-window";
import { Column, PageInfo, TotalsPosition, ViewService } from "../../../types";
import { TableContext, useContextSelector } from "../../context";
import { BOLD_FONT_WEIGHT, COMMON_CELL_STYLING } from "../../styling-defaults";
import { GeneratedStyling } from "../../types";
import { isNumeric } from "../../utils/is-numeric";
import { fontSizeToRowHeight } from "../../utils/styling-utils";
import { MIN_BODY_ROW_HEIGHT, PADDING_TOP_BOTTOM } from "../constants";
import useDynamicRowHeight from "./use-dynamic-row-height";

interface UseHeightsProps {
  columns: Column[];
  columnWidths: number[];
  pageInfo: PageInfo;
  totalsPosition: TotalsPosition;
  headerRef: React.RefObject<VariableSizeList<any>>;
  totalsRef: React.RefObject<VariableSizeList<any>>;
  isSnapshot: boolean;
  viewService: ViewService;
}

const getBodyRowHeight = ({ fontSize = COMMON_CELL_STYLING.fontSize }: GeneratedStyling) =>
  Math.max(MIN_BODY_ROW_HEIGHT, fontSizeToRowHeight(fontSize));

const useHeights = ({
  columns,
  columnWidths,
  pageInfo,
  headerRef,
  totalsRef,
  totalsPosition,
  isSnapshot,
  viewService,
}: UseHeightsProps) => {
  const { styling } = useContextSelector(TableContext, (value) => value.baseProps);

  const headerHeight = useDynamicRowHeight({
    style: styling.head,
    columnWidths,
    lineRef: headerRef,
    rowCount: 1,
    pageInfo,
    fontWeight: BOLD_FONT_WEIGHT,
    columns,
    isSnapshot,
    viewService,
  });

  const totalsHeight = useDynamicRowHeight({
    style: styling.totals,
    columnWidths,
    lineRef: totalsRef,
    rowCount: 1,
    pageInfo,
    fontWeight: BOLD_FONT_WEIGHT,
    isSnapshot,
    viewService,
  });

  columns.forEach((col, idx) => {
    headerHeight.setCellSize(col.label, 0, idx);
    totalsHeight.setCellSize(col.totalInfo, 0, idx, isNumeric(col.totalInfo));
  });

  const headerRowHeight = headerHeight.getRowHeight(0) + PADDING_TOP_BOTTOM * 2;
  const totalsRowHeight = totalsHeight.getRowHeight(0);
  const bodyRowHeight = isSnapshot ? viewService.estimatedRowHeight : getBodyRowHeight(styling.body);
  const headerAndTotalsHeight =
    totalsPosition.atTop || totalsPosition.atBottom ? headerRowHeight + totalsRowHeight : headerRowHeight;

  return {
    headerRowHeight,
    totalsRowHeight,
    bodyRowHeight,
    headerAndTotalsHeight,
    resizeAllHeaderCells: headerHeight.resizeAllCells,
    resizeAllTotalCells: totalsHeight.resizeAllCells,
  };
};

export default useHeights;
