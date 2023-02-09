/* eslint-disable react/require-default-props */
import React from 'react';
import { StyledCellTextWrapper } from './styles';
import { useContextSelector, TableContext } from '../context';
import { LINE_HEIGHT } from '../styling-defaults';

interface CellTextProps {
  children: React.ReactNode;
  lines?: number;
}

export default function CellTextWrapper({ children, lines = 3 }: CellTextProps) {
  const {
    styling: {
      head: { fontSize },
    },
  } = useContextSelector(TableContext, (value) => value.baseProps);
  const size = fontSize ? +fontSize.slice(0, -2) : 12;

  return <StyledCellTextWrapper maxHeight={size * LINE_HEIGHT * lines}>{children}</StyledCellTextWrapper>;
}
