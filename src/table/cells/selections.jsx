import React from 'react';
import PropTypes from 'prop-types';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;

    return (
      <CellComponent {...props} style={selections.getCellStyle(cell)} onClick={() => selections.selectCell(cell)} />
    );
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
