import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  selectionStyle: (props) => props,
});

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, selections } = props;
    const { selectCell, getSelectionStyles } = selections;
    const { style, stateClass } = getSelectionStyles(cell);
    const muiClasses = useStyles(style);

    return (
      <CellComponent
        {...props}
        className={`${stateClass} ${muiClasses.selectionStyle}`}
        onClick={() => cell.isDim && selectCell(cell)}
      />
    );
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    selections: PropTypes.object.isRequired,
  };

  return HOC;
}
