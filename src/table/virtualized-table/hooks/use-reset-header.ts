import { useLayoutEffect } from 'react';
import { VariableSizeList } from 'react-window';
import { Column, PageInfo, TableLayout } from '../../../types';

const useResetHeader = (
  forwardRef: React.RefObject<VariableSizeList<any>>,
  layout: TableLayout,
  pageInfo: PageInfo,
  columnWidth: number[],
  columns: Column[]
) => {
  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndex(0, true);
  }, [layout, pageInfo, forwardRef, columnWidth]);

  useLayoutEffect(() => {
    forwardRef?.current?.scrollTo(0);
  }, [columns.length, forwardRef]);
};

export default useResetHeader;
