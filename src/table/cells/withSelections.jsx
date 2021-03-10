import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { selectCell } from '../selections-utils';
import { getSelectionStyle } from '../styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, styling } = props;
    const handleMouseDown = (evt) => cell.isDim && evt.button === 0 && selectCell(cell, selState, selDispatch, evt);
    const selectionStyling = useMemo(() => getSelectionStyle(styling, cell, selState), [cell, selState]);

    return <CellComponent {...props} styling={selectionStyling} onMouseDown={handleMouseDown} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
  };

  return HOC;
}
