import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  srOnly: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
});

export default function withStyling(CellComponent) {
  const HOC = (props) => {
    const classes = useStyles();
    const { styling, selState, value, cell } = props;

    const isInSelectionMode = selState?.rows.length && cell.rawColIdx === selState.colIdx;
    return (
      <CellComponent
        {...props}
        role={isInSelectionMode ? 'option' : null}
        aria-selected={isInSelectionMode ? !!styling.selectedCellClass : null}
        className={`${styling.selectedCellClass} sn-table-cell`}
        style={styling}
      >
        {value}
        {!!styling.selectedCellClass && <span className={classes.srOnly}>selected</span>}
      </CellComponent>
    );
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
