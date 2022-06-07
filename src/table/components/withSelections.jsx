import React from 'react';
import PropTypes from 'prop-types';
import { useContextSelector, TableContext } from '../context';
import { getSelectionStyle } from '../utils/styling-utils';
import { getCellSelectionState } from '../utils/selections-utils';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { cell, styling, announce, isLocked, ...passThroughProps } = props;
    const cellSelectionState = useContextSelector(TableContext, (value) => getCellSelectionState(cell, value));
    const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

    const handleMouseUp = (evt) => {
      cell.isDim &&
        evt.button === 0 &&
        !isLocked &&
        selectionDispatch({ type: 'select', payload: { cell, evt, announce } });
    };

    const selectionStyling = getSelectionStyle(styling, cellSelectionState);

    return <CellComponent {...passThroughProps} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.defaultProps = {
    isLocked: null,
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    announce: PropTypes.func.isRequired,
    isLocked: PropTypes.bool,
  };

  return HOC;
}
