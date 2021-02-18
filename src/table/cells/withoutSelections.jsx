import React from 'react';
import PropTypes from 'prop-types';

export default function withoutSelections(CellComponent) {
  const HOC = (props) => {
    const { value, stylingClassName } = props;
    return (
      <CellComponent {...props} className={stylingClassName}>
        {`& + ${value}`}
      </CellComponent>
    );
  };

  HOC.propTypes = {
    value: PropTypes.string.isRequired,
    stylingClassName: PropTypes.string.isRequired,
  };

  return HOC;
}
