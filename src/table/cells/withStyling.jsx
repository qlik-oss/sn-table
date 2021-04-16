import React from 'react';
import PropTypes from 'prop-types';

export default function withStyling(CellComponent) {
  const HOC = (props) => {
    const { styling } = props;
    return <CellComponent {...props} className={`${styling.selectedCellClass} sn-table-cell`} style={styling} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
