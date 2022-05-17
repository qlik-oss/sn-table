import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getSelectionStyle } from '../utils/styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const {
      selectionState,
      cell,
      selectionDispatch,
      styling,
      themeBackgroundColor,
      announce,
      column,
      ...passThroughProps
    } = props;
    const handleMouseUp = (evt) =>
      cell.isDim && evt.button === 0 && selectionDispatch({ type: 'select', payload: { cell, evt, announce } });

    const selectionStyling = useMemo(
      () => getSelectionStyle(styling, cell, selectionState, themeBackgroundColor),
      [styling, cell, selectionState, themeBackgroundColor]
    );

    return <CellComponent {...passThroughProps} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.defaultProps = {
    column: null,
    themeBackgroundColor: null,
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    themeBackgroundColor: PropTypes.string,
    selectionState: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selectionDispatch: PropTypes.func.isRequired,
    announce: PropTypes.func.isRequired,
    column: PropTypes.object,
  };

  return HOC;
}
