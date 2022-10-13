import React from 'react';
import { useContextSelector, TableContext } from '../context';
import { getSelectionStyle } from '../utils/styling-utils';
import { getCellSelectionState } from '../utils/selections-utils';
import { getSelectionMouseHandlers } from '../utils/handle-click';
import { CellHOC, CellHOCProps } from '../types';

export default function withSelections(CellComponent: CellHOC) {
  const HOC = (props: CellHOCProps) => {
    const { cell, styling, announce, onMouseDown, areBasicFeaturesEnabled } = props;
    const cellSelectionState = useContextSelector(TableContext, (value) =>
      getCellSelectionState(cell, value.selectionState)
    );
    const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

    const { handleMouseDown, handleMouseOver, handleMouseUp } = getSelectionMouseHandlers(
      cell,
      announce,
      onMouseDown,
      selectionDispatch,
      areBasicFeaturesEnabled
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
