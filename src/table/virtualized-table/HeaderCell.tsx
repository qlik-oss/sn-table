import React from 'react';
import { Column } from '../../types';
import { useContextSelector, TableContext } from '../context';
import { GeneratedStyling } from '../types';
import HeadCellContent from '../components/head/HeadCellContent';

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
  const datum = columns[index];
  const isLastColumn = columns.length - 1 === index;
  const isActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === datum.colIdx;

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
        padding: '4px 12px',
        justifyContent: datum.align,
        boxSizing: 'border-box',
        cursor: 'default',
        fontWeight: 'bold',
      }}
    >
      <HeadCellContent column={datum} columnIndex={index} isActive={isActive} areBasicFeaturesEnabled />
    </div>
  );
};

export default HeaderCell;
