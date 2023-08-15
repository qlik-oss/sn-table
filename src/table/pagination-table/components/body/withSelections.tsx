import React from "react";
import { TableContext, useContextSelector } from "../../../context";
import { CellHOC, CellHOCProps } from "../../../types";
import { getSelectionMouseHandlers } from "../../../utils/handle-mouse";
import { getCellSelectionState } from "../../../utils/selections-utils";
import { getSelectionStyle } from "../../../utils/styling-utils";

export default function withSelections(CellComponent: CellHOC) {
  const HOC = (props: CellHOCProps) => {
    const { cell, styling, announce, onMouseDown } = props;
    const cellSelectionState = useContextSelector(TableContext, (value) =>
      getCellSelectionState(cell, value.selectionState)
    );
    const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

    const { handleMouseDown, handleMouseOver, handleMouseUp } = getSelectionMouseHandlers(
      onMouseDown,
      cell,
      selectionDispatch,
      announce
    );

    const selectionStyling = getSelectionStyle(styling, cellSelectionState);

    return (
      <CellComponent
        {...props}
        styling={selectionStyling}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseOver={handleMouseOver}
      />
    );
  };

  return HOC;
}
