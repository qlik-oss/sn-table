import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { selectCell } from '../selections-utils';
import { getSelectionStyle } from '../styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { selState, cell, selDispatch, styling } = props;
    const handleMouseUp = (evt) => {
      cell.isDim && evt.button === 0 && selectCell(selState, cell, selDispatch, evt);
    };

    const selectionStyling = useMemo(() => getSelectionStyle(styling, cell, selState), [styling, cell, selState]);

    return <CellComponent {...props} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
  };

  return HOC;
}
