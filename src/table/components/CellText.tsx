import React from 'react';
import { StyledCellText } from './styles';

export default function CellText({ children }: { children: React.ReactNode }) {
  return (
    <StyledCellText component="span" className="sn-table-cell-text">
      {children}
    </StyledCellText>
  );
}
