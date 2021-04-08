import React from 'react';
import PropTypes from 'prop-types';

export default function withStyling(CellComponent) {
  const HOC = (props) => {
    const { styling } = props;
    return (
      <CellComponent
        {...props}
        className={`${styling.selectedCellClass} sn-table-cell`}
        style={{
          // excluded doesn't work properly yet, but should be fixable
          background: styling.background,
          color: styling.fontColor,
          backgroundColor: styling.backgroundColor,
          fontSize: styling.fontSize,
          padding: styling.padding,
        }}
      />
    );
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
