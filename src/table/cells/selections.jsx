import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getSelectionClass, selectCell } from '../selections-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, className, cellLockedImage } = props;

    const useStyles = makeStyles({
      excluded: {
        backgroundImage: `url(${cellLockedImage})`,
      },
      selected: {
        color: '#fff !important',
        backgroundColor: '#009845',
      },
      possible: {},
    });

    const classes = useStyles();
    const handleMouseUp = (evt) => cell.isDim && evt.button === 0 && selectCell(cell, selState, selDispatch, evt);
    const selectionClass = getSelectionClass(cell, selState);

    return <CellComponent {...props} className={`${classes[selectionClass]} ${className}`} onMouseUp={handleMouseUp} />;
  };

  HOC.propTypes = {
    className: PropTypes.string.isRequired,
    cell: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
    cellLockedImage: PropTypes.string.isRequired,
  };

  return HOC;
}
