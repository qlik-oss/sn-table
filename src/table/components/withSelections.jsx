import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { selectCell } from '../utils/selections-utils';
import { getSelectionStyle } from '../utils/styling-utils';
import useAnnounce from '../../hooks/useAnnounce';

export default function withSelections(CellComponent) {
  const HOC = (props) => {
    const { selectionState, cell, selDispatch, styling } = props;
    const announce = useAnnounce();
    const handleMouseUp = (evt) =>
      cell.isDim && evt.button === 0 && selectCell({ selectionState, cell, selDispatch, evt, announce });
    const selectionStyling = useMemo(
      () => getSelectionStyle(styling, cell, selectionState),
      [styling, cell, selectionState]
    );

    return <CellComponent {...props} styling={selectionStyling} onMouseUp={handleMouseUp} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    selectionState: PropTypes.object.isRequired,
    cell: PropTypes.object.isRequired,
    selDispatch: PropTypes.func.isRequired,
  };

  return HOC;
}
