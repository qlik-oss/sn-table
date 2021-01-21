import React from 'react';
import PropTypes from 'prop-types';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;
    return selections.enabled ? (
      <CellComponent {...props} style={selections.getCellStyle(cell)} onClick={() => selections.selectCell(cell)} />
    ) : (
      <CellComponent {...props} />
    );
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    colIdx: PropTypes.number.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
