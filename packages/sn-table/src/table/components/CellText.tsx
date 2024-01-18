/* eslint-disable react/require-default-props */
import React from "react";
import { DEFAULT_FONT_SIZE, LINE_HEIGHT } from "../styling-defaults";
import { StyledCellText, StyledCellTextWrapper } from "./styles";

interface CellTextProps {
  children: React.ReactNode;
  fontSize?: string;
  wordBreak?: boolean;
  lines?: number;
}

const CellText = ({ children, fontSize = "", wordBreak = false, lines = 3 }: CellTextProps): JSX.Element => {
  const size = parseInt(fontSize || DEFAULT_FONT_SIZE, 10);

  const Text = (
    <StyledCellText component="span" className="sn-table-cell-text" wordBreak={wordBreak} lines={lines}>
      {children}
    </StyledCellText>
  );

  return wordBreak ? (
    Text
  ) : (
    <StyledCellTextWrapper minHeight={size * LINE_HEIGHT} maxHeight={size * LINE_HEIGHT * lines}>
      {Text}
    </StyledCellTextWrapper>
  );
};

export default CellText;
