import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { selectCell } from '../utils/selections-utils';
import { getSelectionStyle } from '../utils/styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { selectionState, cell, selectionDispatch, styling, announce, column, theme, ...passThroughProps } = props;

    const handleMouseUp = (evt) =>
      cell.isDim && evt.button === 0 && selectCell({ selectionState, cell, selectionDispatch, evt, announce });

    const selectionStyling = useMemo(
      () => getSelectionStyle(styling, cell, selectionState, theme),
      [styling, cell, selectionState, theme]
    );

    return <CellComponent {...passThroughProps} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.defaultProps = {
    column: null,
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    selectionState: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selectionDispatch: PropTypes.func.isRequired,
    announce: PropTypes.func.isRequired,
    column: PropTypes.object,
    theme: PropTypes.object.isRequired,
  };

  return HOC;
}
