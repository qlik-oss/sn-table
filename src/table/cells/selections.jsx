import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  excluded: {
    backgroundColor: '#e8e8e8',
  },
  selected: {
    backgroundColor: '#009845',
  },
  possible: {},
});

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;
    const classes = useStyles();
    const handleMouseUp = () => cell.isDim && selections.selectCell(cell);
    const selectionClass = selections.getSelectionClass(cell);

    return (
      <CellComponent {...props} className={`${selectionClass} ${classes[selectionClass]}`} onMouseUp={handleMouseUp} />
    );
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
