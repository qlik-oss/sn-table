import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { STYLING_DEFAULTS } from '../styling-utils';

const useStyles = makeStyles({
  cellBackground: (props) => ({
    background: props.background,
  }),
  cellStyling: (props) => ({
    color: props.fontColor,
    backgroundColor: props.backgroundColor,
    fontSize: props.fontSize,
    padding: props.padding,
    height: STYLING_DEFAULTS.HEIGHT,
    lineHeight: STYLING_DEFAULTS.BODY_LINE_HEIGHT,
    '&&:focus': {
      boxShadow: STYLING_DEFAULTS.FOCUS_OUTLINE,
    },
  }),
});

export default function withStyling(CellComponent) {
  const HOC = (props) => {
    const { styling } = props;
    const classes = useStyles(styling);
    return (
      <CellComponent
        {...props}
        className={`${classes.cellStyling} ${classes.cellBackground} ${styling.selectedCellClass} sn-table-cell`}
      />
    );
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
