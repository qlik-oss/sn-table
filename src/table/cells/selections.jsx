import React from 'react';
import PropTypes from 'prop-types';
// import handleSelect from '../handle-select';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;
    const { selectCell, getCellStyle } = selections;

    return <CellComponent {...props} style={getCellStyle(cell, true)} onClick={() => selectCell(cell)} />;
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    colIdx: PropTypes.number.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
