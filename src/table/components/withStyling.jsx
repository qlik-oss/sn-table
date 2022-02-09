import React from 'react';
import PropTypes from 'prop-types';

export default function withStyling(CellComponent) {
  const HOC = (props) => {
    const { styling, ...passThroughProps } = props;
    const { selectedCellClass, ...style } = styling;

    return <CellComponent {...passThroughProps} className={`${selectedCellClass} sn-table-cell`} sx={style} />;
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
