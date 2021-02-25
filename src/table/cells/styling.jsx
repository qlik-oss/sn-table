import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getColumnStyling } from '../styling-utils';

const useStyles = makeStyles({
  columnStyling: (props) => props,
});

export default function withStyling(CellComponent) {
  const HOC = (props) => {
    const { cell, column, styling } = props;
    const newStyling = useMemo(() => getColumnStyling(styling, cell.qAttrExps, column.stylingInfo), [cell.qAttrExps]);
    const classes = useStyles(newStyling);

    return <CellComponent {...props} className={`${classes.columnStyling}`} />;
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
