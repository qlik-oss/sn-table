import React, { useCallback, useLayoutEffect } from 'react';
import { VariableSizeGrid } from 'react-window';
import useInfiniteScrollData from '../../hooks/use-infinite-scroll-data';
import { VirtualizedTableProps } from '../../types';
import Cell from './Cell';

interface OnItemsRendered {
  overscanColumnStartIndex: number;
  overscanColumnStopIndex: number;
  overscanRowStartIndex: number;
  overscanRowStopIndex: number;
  visibleColumnStartIndex: number;
  visibleColumnStopIndex: number;
  visibleRowStartIndex: number;
  visibleRowStopIndex: number;
}

const VirtualScrollBody = (props: VirtualizedTableProps) => {
  const { rect, layout, model, forwardRef, columns, columnWidth } = props;
  const { data: rows, loadData, debouncedLoadData } = useInfiniteScrollData(model, layout);

  useLayoutEffect(() => {
    if (!layout) return;
    forwardRef?.current?.resetAfterColumnIndex(0, true);
    forwardRef?.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, forwardRef]);

  const handleItemsRendered = useCallback(
    ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
    }: OnItemsRendered) => {
      const width = overscanColumnStopIndex - overscanColumnStartIndex;
      const height = overscanRowStopIndex - overscanRowStartIndex;

      if (overscanColumnStartIndex === 0 && overscanRowStartIndex === 0) {
        loadData(0, 0, width + 1, height + 1); // TODO Act as a way to load data on first render or layout changes. But will also be trigged when user scrolls to top
      } else {
        debouncedLoadData(overscanColumnStartIndex, overscanRowStartIndex, width + 1, height + 1);
      }
    },
    [loadData, debouncedLoadData]
  );

  return (
    <VariableSizeGrid
      ref={forwardRef}
      style={{ position: 'sticky', top: '33px', left: '0px', overflow: 'hidden' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={rect.height - 33} // - the height of the headers
      rowCount={layout.qHyperCube.qSize.qcy}
      rowHeight={() => 32}
      width={rect.width}
      itemData={{ rows, columns }}
      onItemsRendered={handleItemsRendered}
    >
      {Cell}
    </VariableSizeGrid>
  );
};

export default VirtualScrollBody;
