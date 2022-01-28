import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { selectCell } from '../utils/selections-utils';
import { getSelectionStyle } from '../utils/styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { selectionstate: selectionState, cell, selectiondispatch: selectionDispatch, styling, announce } = props;
    const handleMouseUp = (evt) =>
      cell.isDim && evt.button === 0 && selectCell({ selectionState, cell, selectionDispatch, evt, announce });
    const selectionStyling = useMemo(
      () => getSelectionStyle(styling, cell, selectionState),
      [styling, cell, selectionState]
    );

    return <CellComponent {...props} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    selectionstate: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selectiondispatch: PropTypes.func.isRequired,
    announce: PropTypes.func.isRequired,
  };

  return HOC;
}
