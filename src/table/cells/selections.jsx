import React from 'react';
import PropTypes from 'prop-types';
// import handleSelect from '../handle-select';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;
    const { api, selected, selectCell } = selections;
    const isSelected = !!selected.find((s) => s.qElemNumber === cell.qElemNumber);
    const isExcluded = api.isActive() && selected[0]?.colIdx !== cell.colIdx;
    const style = isSelected ? { 'background-color': '#009845' } : isExcluded ? { 'background-color': '#e8e8e8' } : {};

    return <CellComponent {...props} style={style} onClick={() => selectCell(cell)} />;
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    colIdx: PropTypes.number.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
