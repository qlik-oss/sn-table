import React from 'react';
import PropTypes from 'prop-types';
import { getSelectionStyle } from '../utils/styling-utils';
import { SelectionContext, getCellSelectionState } from '../utils/selections-utils';
import useContextSelector from '../utils/useContextSelector';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, styling, themeBackgroundColor, announce, column, ...passThroughProps } = props;
    const cellSelectionState = useContextSelector(SelectionContext, (value) => getCellSelectionState(cell, value));
    const selectionDispatch = useContextSelector(SelectionContext, (value) => value.selectionDispatch);

    const handleMouseUp = (evt) =>
      cell.isDim && evt.button === 0 && selectionDispatch({ type: 'select', payload: { cell, evt, announce } });
    const selectionStyling = getSelectionStyle(styling, cellSelectionState, themeBackgroundColor);

    return <CellComponent {...passThroughProps} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.defaultProps = {
    column: null,
    themeBackgroundColor: null,
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    themeBackgroundColor: PropTypes.string,
    cell: PropTypes.object.isRequired,
    announce: PropTypes.func.isRequired,
    column: PropTypes.object,
  };

  return HOC;
}
