/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getSelectionClass, selectCell } from '../selections-utils';

const useStyles = makeStyles({
  excluded: {
    background: 'repeating-linear-gradient(-45deg, #fafafa, #fafafa 2px, #eee 2.5px, #fafafa 3px, #fafafa 5px)',
  },
  selected: {
    color: '#fff',
    backgroundColor: '#009845',
  },
  possible: {},
});

export function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, stylingClassCellName } = props;
    const classes = useStyles();
    const handleMouseUp = (evt) => cell.isDim && selectCell(cell, selState, selDispatch, evt);
    const selectionClass = getSelectionClass(cell, selState);

    return (
      <CellComponent
        {...props}
        className={`${stylingClassCellName} ${selectionClass} ${classes[selectionClass]}`}
        onMouseUp={handleMouseUp}
      />
    );
  };

  HOC.propTypes = {
    stylingClassCellName: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
  };

  return HOC;
}
