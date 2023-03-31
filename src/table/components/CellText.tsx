/* eslint-disable react/require-default-props */
import React from 'react';
import { StyledCellText, StyledCellTextWrapper } from './styles';
import { DEFAULT_FONT_SIZE, LINE_HEIGHT } from '../styling-defaults';

interface CellTextProps {
  children: React.ReactNode;
  fontSize?: string;
  wordBreak?: boolean;
  lines?: number;
}

export default function CellText({ children, fontSize = '', wordBreak = false, lines = 3 }: CellTextProps) {
  const size = parseInt(fontSize || DEFAULT_FONT_SIZE, 10);

  const Text = (
    <StyledCellText component="span" className="sn-table-cell-text" wordBreak={wordBreak} lines={lines}>
      {children}
    </StyledCellText>
  );

  return wordBreak ? (
    <>{Text}</>
  ) : (
    <StyledCellTextWrapper minHeight={size * LINE_HEIGHT} maxHeight={size * LINE_HEIGHT * lines}>
      {Text}
    </StyledCellTextWrapper>
  );
}
