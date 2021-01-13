import React from 'react';
import PropTypes from 'prop-types';
import handleSelect from '../handle-select';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, colIdx, selectionObj } = props;
    const isSelected = !!selectionObj.selected.find((s) => s.qElemNumber === cell.qElemNumber);
    const style = isSelected ? { 'background-color': '#00ff00' } : {};

    return <CellComponent {...props} style={style} onClick={() => handleSelect(cell, colIdx, selectionObj)} />;
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    colIdx: PropTypes.number.isRequired,
    selectionObj: PropTypes.object.isRequired,
  };

  return HOC;
}
