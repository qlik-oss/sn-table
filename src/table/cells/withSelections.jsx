import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { handleCellFocus } from './handle-cell-focus';
import { selectCell } from '../selections-utils';
import { getSelectionStyle } from '../styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, styling, focusedCell, setFocusedCell, rootElement } = props;
    const handleMouseUp = (evt) => {
      cell.isDim &&
        evt.button === 0 &&
        handleCellFocus(cell, focusedCell, setFocusedCell, rootElement) &&
        selectCell(cell, selState, selDispatch, evt);
    };

    const selectionStyling = useMemo(() => getSelectionStyle(styling, cell, selState), [styling, cell, selState]);

    return <CellComponent {...props} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
    focusedCell: PropTypes.array.isRequired,
    setFocusedCell: PropTypes.func.isRequired,
    rootElement: PropTypes.object.isRequired,
  };

  return HOC;
}
