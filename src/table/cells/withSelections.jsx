import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { selectCell } from '../selections-utils';
import { getSelectionStyle } from '../styling-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, styling, focusedCell, setFocusedCell, rootElement, pageInfo, page } = props;
    const handleMouseUp = (evt) =>
      cell.isDim &&
      evt.button === 0 &&
      selectCell(cell, selState, selDispatch, focusedCell, setFocusedCell, rootElement, pageInfo, page, evt);
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
    pageInfo: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
  };

  return HOC;
}
