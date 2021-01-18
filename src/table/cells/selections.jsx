import React from 'react';
import PropTypes from 'prop-types';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;
<<<<<<< HEAD
    const { selectCell, getSelectionClasses } = selections;

    return (
      <CellComponent
        {...props}
        className={`sn-table-cell ${getSelectionClasses(cell)}`}
        onClick={() => selectCell(cell)}
      />
    );
=======
    const { selectCell, getCellStyle } = selections;

    return <CellComponent {...props} style={getCellStyle(cell)} onClick={() => selectCell(cell)} />;
>>>>>>> main
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    colIdx: PropTypes.number.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
