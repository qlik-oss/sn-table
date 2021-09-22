import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getCellSrNotation } from './handle-cell-focus';

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
  const classes = useStyles();
  const HOC = (props) => {
    const { styling, hasFocus, selState, value } = props;
    let selectionStatus;
    if (hasFocus && selState.rows.length) {
      selectionStatus = getCellSrNotation(selState.rows, !!styling.selectedCellClass);
    }
    return (
      <CellComponent {...props} className={`${styling.selectedCellClass} sn-table-cell`} style={styling}>
        {value}
        <span className={classes.srOnly}>{selectionStatus}</span>
      </CellComponent>
    );
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    hasFocus: PropTypes.bool.isRequired,
    selState: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
  };

  return HOC;
}
