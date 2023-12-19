/* eslint-disable react/require-default-props */
import React from "react";
import { DEFAULT_FONT_SIZE, LINE_HEIGHT } from "../styling-defaults";
import { StyledCellText, StyledCellTextWrapper } from "./styles";

interface CellTextProps {
  children: React.ReactNode;
  fontSize?: string;
  wordBreak?: boolean;
  lines?: number;
  image?: boolean;
}
let imageUrl: string;

const CellText = ({
  children,
  fontSize = "",
  wordBreak = false,
  lines = 3,
  image = false,
}: CellTextProps): JSX.Element => {
  const size = parseInt(fontSize || DEFAULT_FONT_SIZE, 10);

  imageUrl = JSON.stringify(children);
  imageUrl = imageUrl.substring(1, imageUrl.length - 1);
  // TODO do this check somewhere else, not here
  // if(!imageUrl.includes('http')){
  //   image = false;
  // }

  const Image = (
    <StyledCellText component="span" className="sn-table-cell-text" wordBreak={wordBreak} lines={lines}>
      <img src={imageUrl} alt={imageUrl} width="200" height="200" />
    </StyledCellText>
  );

  const Text = (
    <StyledCellText component="span" className="sn-table-cell-text" wordBreak={wordBreak} lines={lines}>
      {children}
    </StyledCellText>
  );

  if (image) {
    return Image;
  }
  if (wordBreak) {
    return Text;
  }
  return (
    <StyledCellTextWrapper minHeight={size * LINE_HEIGHT} maxHeight={size * LINE_HEIGHT * lines}>
      {Text}
    </StyledCellTextWrapper>
  );
};

export default CellText;
