import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getSelectionClass, selectCell } from '../selections-utils';
import handleKeyPress from './handleKeyPress';
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
    const { cell, selState, selDispatch, className, rootElement, rowIndex, columnIndex } = props;

    const classes = useStyles();
    const handleMouseUp = (evt) => cell.isDim && evt.button === 0 && selectCell(cell, selState, selDispatch, evt);
    const selectionClass = getSelectionClass(cell, selState);

    return (
      <CellComponent
        {...props}
        className={`${classes[selectionClass]} ${className}`}
        onMouseUp={handleMouseUp}
        onKeyDown={(evt) => handleKeyPress(evt, rootElement, rowIndex, columnIndex, cell, selState, selDispatch)}
      />
    );
  };

  HOC.propTypes = {
    className: PropTypes.string.isRequired,
    cell: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
    rootElement: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    columnIndex: PropTypes.number.isRequired,
  };

  return HOC;
}
