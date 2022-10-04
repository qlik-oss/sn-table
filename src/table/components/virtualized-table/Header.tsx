import React, { useMemo, useLayoutEffect } from 'react';
import { VariableSizeGrid } from 'react-window';
import { getColumnInfo, getColumnOrder } from '../../../handle-data';
import { Column } from '../../../types';
import useMeasureText from '../../hooks/use-measure-text';
import { VirtualTableProps } from '../../types';
import HeaderCell from './HeaderCell';

const Header = (props: VirtualTableProps) => {
  const { layout, rect, forwardRef } = props;
  const { measureText } = useMeasureText('13px', 'Arial');

  useLayoutEffect(() => {
    if (!layout) return;
    forwardRef?.current?.resetAfterColumnIndex(0, true);
    forwardRef?.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, forwardRef]);

  const columns = useMemo(() => {
    const { qHyperCube } = layout;
    const columnOrder = getColumnOrder(qHyperCube);
    // using filter to remove hidden columns (represented with false)
    const cols = columnOrder
      .map((colIndex) => getColumnInfo(layout, colIndex, columnOrder))
      .filter(Boolean) as Column[];

    console.log('columns', cols);

    return cols;
  }, [layout]);

  columns.forEach((c) => {
    c.width = Math.min(500, measureText(c.label));
    // console.log('measureText', measureText(c.label));
  });

  return (
    <VariableSizeGrid
      ref={forwardRef}
      style={{ position: 'sticky', top: 0, left: 0, overflow: 'hidden', backgroundColor: 'rgb(247, 247, 247)' }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columns[index].width}
      height={33}
      rowCount={1}
      rowHeight={() => 32}
      width={rect.width}
      itemData={{ columns }}
    >
      {HeaderCell}
    </VariableSizeGrid>
  );
};

export default Header;
