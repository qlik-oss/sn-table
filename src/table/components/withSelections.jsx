import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { selectCell } from '../utils/selections-utils';
import { getSelectionStyle } from '../utils/styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { selectionState, cell, selDispatch, styling, announce, tableBackgroundColor } = props;
    const handleMouseUp = (evt) =>
      cell.isDim && evt.button === 0 && selectCell({ selectionState, cell, selDispatch, evt, announce });
    const selectionStyling = useMemo(
      () => getSelectionStyle(styling, cell, selectionState, tableBackgroundColor),
      [styling, cell, selectionState, tableBackgroundColor]
    );

    return <CellComponent {...props} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    selectionState: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
    tableBackgroundColor: PropTypes.string.isRequired,
    announce: PropTypes.func.isRequired,
  };

  return HOC;
}
