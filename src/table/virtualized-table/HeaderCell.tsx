import React from 'react';
import { Column } from '../../types';
import { GeneratedStyling } from '../types';
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
  const datum = columns[index];
  const isLastColumn = columns.length - 1 === index;

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
      <CellText singleLine>{datum.label}</CellText>
    </div>
  );
};

export default HeaderCell;
