import React, { useCallback, useEffect, useLayoutEffect, memo, useMemo } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DEFAULT_ROW_HEIGHT, HEADER_HEIGHT } from './constants';
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

const Body = (props: VirtualizedTableProps) => {
  const { rect, layout, model, forwardRef, columns, columnWidth, innerForwardRef } = props;
  const { rows, loadData, debouncedLoadData } = useInfiniteScrollData(model, layout);
  const visibleRowCount = Math.min(layout.qHyperCube.qSize.qcy, Math.ceil(rect.height / DEFAULT_ROW_HEIGHT));
  const visibleColumnCount = useMemo(
    () =>
      columnWidth.reduce(
        (data, colWidth) => {
          if (data.width < rect.width) {
            data.width += colWidth;
            data.count += 1;
          }

          return data;
        },
        { count: 0, width: 0 }
      ),
    [rect, columnWidth]
  ).count;

  console.log('RENDERING BODY', rows);

  useEffect(() => {
    // Initial data load
    setTimeout(() => {
      loadData(0, 0, visibleColumnCount, visibleRowCount);
    }, 5000);
  }, [layout, visibleRowCount, visibleColumnCount, loadData]);

  useLayoutEffect(() => {
    if (!forwardRef.current) return;

    forwardRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, forwardRef]);

  const handleItemsRendered = useCallback(
    ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
    }: OnItemsRendered) => {
      if (overscanColumnStartIndex > 0 || overscanRowStartIndex > 0) {
        const width = overscanColumnStopIndex - overscanColumnStartIndex + 1;
        const height = overscanRowStopIndex - overscanRowStartIndex + 1;

        debouncedLoadData(overscanColumnStartIndex, overscanRowStartIndex, width, height);
      }
    },
    [debouncedLoadData]
  );

  return (
    <VariableSizeGrid
      data-key="body"
      ref={forwardRef}
      innerRef={innerForwardRef}
      style={{ position: 'sticky', top: `${HEADER_HEIGHT}px`, left: '0px', overflow: 'hidden' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={rect.height - HEADER_HEIGHT}
      rowCount={layout.qHyperCube.qSize.qcy}
      rowHeight={() => DEFAULT_ROW_HEIGHT}
      estimatedRowHeight={DEFAULT_ROW_HEIGHT}
      width={rect.width}
      itemData={{ rows, columns }}
      onItemsRendered={handleItemsRendered}
    >
      {Cell}
    </VariableSizeGrid>
  );
};

export default memo(Body);
