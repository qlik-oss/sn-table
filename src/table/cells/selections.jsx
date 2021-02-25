import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getSelectionClass, selectCell } from '../selections-utils';
import { STYLING_DEFAULTS } from '../styling-utils';

const useStyles = makeStyles({
  excluded: {
    background: STYLING_DEFAULTS.EXCLUDED_BACKGROUND,
  },
  selected: {
    color: `${STYLING_DEFAULTS.WHITE} !important`,
    background: STYLING_DEFAULTS.SELECTED_BACKGROUND,
  },
  possible: {},
});

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selState, selDispatch, className } = props;

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
  };

  return HOC;
}
