/* eslint-disable react/require-default-props */
import React from 'react';
import { StyledCellText, StyledCellTextWrapper } from './styles';
import { useContextSelector, TableContext } from '../context';
import { LINE_HEIGHT } from '../styling-defaults';

interface CellTextProps {
  children: React.ReactNode;
  wordBreak?: boolean;
  lines?: number;
}

export default function CellText({ children, wordBreak = false, lines = 3 }: CellTextProps) {
  const fontSize = useContextSelector(TableContext, (value) => value.baseProps.styling.head.fontSize);
  const size = fontSize ? +fontSize.slice(0, -2) : 12;

  const Text = (
    <StyledCellText component="span" className="sn-table-cell-text" wordBreak={wordBreak} lines={lines}>
      {children}
    </StyledCellText>
  );

  return wordBreak ? (
    <>{Text}</>
  ) : (
    <StyledCellTextWrapper maxHeight={size * LINE_HEIGHT * lines}>{Text}</StyledCellTextWrapper>
  );
}
