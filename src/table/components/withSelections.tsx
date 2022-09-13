import React from 'react';
import { useContextSelector, TableContext } from '../context';
import { getSelectionStyle } from '../utils/styling-utils';
import { getCellSelectionState, SelectionActions } from '../utils/selections-utils';
import { CellHOC, CellHOCProps } from '../types';

export default function withSelections(CellComponent: CellHOC) {
  const HOC = (props: CellHOCProps) => {
    const { cell, styling, announce, onClick } = props;
    const cellSelectionState = useContextSelector(TableContext, (value) =>
      getCellSelectionState(cell, value.selectionState)
    );
    const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

    const handleMouseDown = () => {
      selectionDispatch({ type: SelectionActions.SELECT_MULTI_START, payload: { cell } });
    };

    const handleMouseOver = (evt: React.MouseEvent) => {
      if (evt.button === 0 && evt.buttons === 1)
        selectionDispatch({ type: SelectionActions.SELECT_MULTI_ADD, payload: { cell, evt, announce } });
    };

    const handleMouseUp = (evt: React.MouseEvent) => {
      onClick?.(evt as React.MouseEvent<HTMLTableCellElement>);
      if (evt.button === 0) selectionDispatch({ type: SelectionActions.SELECT_MULTI_END });
    };

    const handleMouseClick = (evt: React.MouseEvent) => {
      if (cell.isSelectable && evt.button === 0)
        selectionDispatch({ type: SelectionActions.SELECT, payload: { cell, evt, announce } });
    };

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
