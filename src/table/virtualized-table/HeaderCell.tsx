import React from 'react';
import { Column } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import HeadCellContent from '../components/head/HeadCellContent';
import CellText from '../components/CellText';
import ColumnAdjuster from '../components/head/ColumnAdjuster';

interface HeaderCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    columns: Column[];
    headerStyle: GeneratedStyling;
    columResizeHandler: () => void;
  };
}

const HeaderCell = ({ index, style, data }: HeaderCellProps) => {
  const {
    columns,
    headerStyle: { ...applicableStyle },
    columResizeHandler,
  } = data;

  const { layout, constraints } = useContextSelector(TableContext, (value) => value.baseProps);
  const showRightBorder = useContextSelector(TableContext, (value) => value.showRightBorder);
  const column = columns[index];
  const isLastColumn = columns.length - 1 === index;
  const isActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
  const flexDirection = column.headTextAlign === 'right' ? 'row-reverse' : 'row';

  return (
    <div
      className="sn-table-cell"
      title={!constraints.passive ? column.label : undefined}
      style={{
        ...style,
        ...applicableStyle,
        display: 'flex',
        alignItems: 'flex-end',
        borderStyle: 'solid',
        borderWidth: isLastColumn && !showRightBorder ? '0px 0px 1px 0px' : '0px 1px 1px 0px',
        padding: '4px',
        justifyContent: column.headTextAlign,
        boxSizing: 'border-box',
        cursor: 'default',
        zIndex: columns.length - index,
        flexDirection,
        userSelect: 'none',
      }}
    >
      <HeadCellContent column={column} isActive={isActive}>
        <CellText wordBreak lines={3}>
          {column.label}
        </CellText>
      </HeadCellContent>
      <ColumnAdjuster column={column} isLastColumn={isLastColumn} onColumnResize={columResizeHandler} />
    </div>
  );
};

export default HeaderCell;
