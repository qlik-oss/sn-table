import React from 'react';
import { useContextSelector, TableContext } from '../context';
import { getSelectionStyle } from '../utils/styling-utils';
import { getCellSelectionState } from '../utils/selections-utils';
import { getMouseHandlers } from '../utils/handle-click';
import { CellHOC, CellHOCProps } from '../types';

export default function withSelections(CellComponent: CellHOC) {
  const HOC = (props: CellHOCProps) => {
    const { cell, styling, announce, onClick, isFlagEnabled } = props;
    const cellSelectionState = useContextSelector(TableContext, (value) =>
      getCellSelectionState(cell, value.selectionState)
    );
    const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

    const { handleMouseDown, handleMouseOver, handleMouseUp, handleMouseClick } = getMouseHandlers(
      cell,
      announce,
      onClick,
      selectionDispatch,
      isFlagEnabled
    );

    const selectionStyling = getSelectionStyle(styling, cellSelectionState);

    return (
      <CellComponent
        {...props}
        styling={selectionStyling}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseOver={handleMouseOver}
        onClick={handleMouseClick}
      />
    );
  };

  return HOC;
}
