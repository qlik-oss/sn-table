import { useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import { Column, PageInfo, TotalsPosition } from '../../../types';
import { TableContext, useContextSelector } from '../../context';
import { COMMON_CELL_STYLING } from '../../styling-defaults';
import { GeneratedStyling } from '../../types';
import { fontSizeToRowHeight } from '../../utils/styling-utils';
import { MIN_BODY_ROW_HEIGHT, PADDING_TOP_BOTTOM } from '../constants';
import useDynamicRowHeight from './use-dynamic-row-height';

interface UseHeaderAndTotalsHeightProps {
  columns: Column[];
  columnWidths: number[];
  pageInfo: PageInfo;
  totalsPosition: TotalsPosition;
  headerRef: React.RefObject<VariableSizeList<any>>;
  totalsRef: React.RefObject<VariableSizeList<any>>;
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
}: UseHeaderAndTotalsHeightProps) => {
  const { styling } = useContextSelector(TableContext, (value) => value.baseProps);

  const headerHeight = useDynamicRowHeight({
    style: styling.head,
    columnWidths,
    lineRef: headerRef,
    rowCount: 1,
    pageInfo,
    boldText: true,
    columns,
  });

  const totalsHeight = useDynamicRowHeight({
    style: styling.totals,
    columnWidths,
    lineRef: totalsRef,
    rowCount: 1,
    pageInfo,
    boldText: true,
  });

  useEffect(() => {
    columns.forEach((col, idx) => {
      headerHeight.setCellSize(col.label, 0, idx);
      totalsHeight.setCellSize(col.totalInfo, 0, idx);
    });
  }, [columns, headerHeight, totalsHeight]);

  const headerRowHeight = headerHeight.getRowHeight(0) + PADDING_TOP_BOTTOM * 2;
  const totalsRowHeight = totalsHeight.getRowHeight(0);
  const bodyRowHeight = getBodyRowHeight(styling.body);
  const headerAndTotalsHeight =
    totalsPosition.atTop || totalsPosition.atBottom ? headerRowHeight + bodyRowHeight : headerRowHeight;

  return {
    headerRowHeight,
    totalsRowHeight,
    bodyRowHeight,
    headerAndTotalsHeight,
  };
};

export default useHeights;
