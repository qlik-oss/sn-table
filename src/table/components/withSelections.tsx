import React from 'react';
import { useContextSelector, TableContext } from '../context';
import { getSelectionStyle } from '../utils/styling-utils';
import { getCellSelectionState, SelectionActions } from '../utils/selections-utils';
import { CellHOC, CellHOCProps } from '../types';

export default function withSelections(CellComponent: CellHOC) {
  const HOC = (props: CellHOCProps) => {
    const { cell, styling, announce } = props;
    const cellSelectionState = useContextSelector(TableContext, (value) =>
      getCellSelectionState(cell, value.selectionState)
    );
    const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

    const handleMouseUp = (evt: React.MouseEvent) =>
      cell.isSelectable &&
      evt.button === 0 &&
      selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });

    const selectionStyling = getSelectionStyle(styling, cellSelectionState);

    return <CellComponent {...props} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  return HOC;
}
