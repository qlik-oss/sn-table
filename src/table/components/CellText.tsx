/* eslint-disable react/require-default-props */
import React from 'react';
import { StyledCellText } from './styles';

interface CellTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  singleLine?: boolean;
}

export default function CellText(props: CellTextProps) {
  const { children, style, singleLine } = props;
  return (
    <StyledCellText component="span" className="sn-table-cell-text" style={style} singleLine={singleLine}>
      {children}
    </StyledCellText>
  );
}
