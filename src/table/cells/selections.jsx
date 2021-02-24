import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getSelectionClass, selectCell } from '../selections-utils';

const useStyles = makeStyles({
  excluded: {
    background:
      'repeating-linear-gradient(-45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 6px)',
  },
  selected: {
    color: '#fff !important',
    backgroundColor: '#009845',
  },
  possible: {},
});

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, className } = props;

    const classes = useStyles();
    const handleMouseUp = (evt) => cell.isDim && selectCell(cell, selState, selDispatch, evt);
    const selectionClass = getSelectionClass(cell, selState);

    return <CellComponent {...props} className={`${classes[selectionClass]} ${className}`} onMouseUp={handleMouseUp} />;
  };

  HOC.propTypes = {
    className: PropTypes.string.isRequired,
    cell: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
  };

  return HOC;
}
