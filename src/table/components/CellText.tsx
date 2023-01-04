import React from 'react';
import { StyledCellText } from './styles';

interface CellTextProps {
  children: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties | undefined;
}

export default function CellText({ children, style }: CellTextProps) {
  return (
    <StyledCellText component="span" className="sn-table-cell-text" style={style}>
      {children}
    </StyledCellText>
  );
}
