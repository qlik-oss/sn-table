import React from 'react';
import { useContextSelector, TableContext } from '../context';
import { getSelectionStyle } from '../utils/styling-utils';
import { getCellSelectionState, SelectionActions, TSelectionActions } from '../utils/selections-utils';
import { hocProps, SelectionState } from '../../types';

export default function withSelections(CellComponent: (props: hocProps) => JSX.Element) {
  const HOC = (props: hocProps) => {
    const { cell, styling, announce } = props;
    const cellSelectionState = useContextSelector(TableContext, (value) =>
      getCellSelectionState(cell, value.selectionState as SelectionState)
    );
    const selectionDispatch = useContextSelector(
      TableContext,
      (value) => value.selectionDispatch as React.Dispatch<TSelectionActions>
    );

    const handleMouseUp = (evt: React.MouseEvent) =>
      cell.isSelectable &&
      evt.button === 0 &&
      selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });

    const selectionStyling = getSelectionStyle(styling, cellSelectionState);

    return <CellComponent {...props} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  return HOC;
}
