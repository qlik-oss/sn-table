import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getSelectionClass, selectCell } from '../selections-utils';
import cellLocked from '../../image/NR_Locked.png';

const useStyles = makeStyles({
  excluded: {
    backgroundImage: `url(${cellLocked})`,
  },
  selected: {
    color: '#fff !important',
    backgroundColor: '#009845',
  },
  possible: {},
});

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, stylingClassName } = props;
    const classes = useStyles();
    const handleMouseUp = (evt) => cell.isDim && selectCell(cell, selState, selDispatch, evt);
    const selectionClass = getSelectionClass(cell, selState);

    return (
      <CellComponent
        {...props}
        className={`${classes[selectionClass]} ${stylingClassName}`}
        onMouseUp={handleMouseUp}
      />
    );
  };

  HOC.propTypes = {
    stylingClassName: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
  };

  return HOC;
}
