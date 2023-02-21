import React from 'react';
import { Column } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import HeadCellContent from '../components/head/HeadCellContent';
import CellText from '../components/CellText';

interface HeaderCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    columns: Column[];
    headerStyle: GeneratedStyling;
  };
}

const HeaderCell = ({ index, style, data }: HeaderCellProps) => {
  const {
    columns,
    headerStyle: { ...applicableStyle },
  } = data;
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const column = columns[index];
  const isLastColumn = columns.length - 1 === index;
  const isActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
  const flexDirection = column.align === 'right' ? 'row-reverse' : 'row';

  return (
    <div
      className="sn-table-cell"
      style={{
        ...style,
        ...applicableStyle,
        display: 'flex',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: isLastColumn ? '0px' : '0px 1px 0px 0px',
        padding: '4px',
        justifyContent: column.align,
        boxSizing: 'border-box',
        cursor: 'default',
        fontWeight: 'bold',
        flexDirection,
      }}
    >
      <HeadCellContent column={column} isActive={isActive} areBasicFeaturesEnabled>
        <CellText wordBreak lines={1}>
          {column.label}
        </CellText>
      </HeadCellContent>
    </div>
  );
};

export default HeaderCell;
