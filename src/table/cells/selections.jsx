import React from 'react';
import PropTypes from 'prop-types';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;
    const { selectCell, getSelectionClasses } = selections;

    return (
      <CellComponent
        {...props}
        className={`sn-table-cell ${getSelectionClasses(cell)}`}
        onClick={() => selectCell(cell)}
      />
    );
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    colIdx: PropTypes.number.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
