import React from 'react';
import PropTypes from 'prop-types';

export default function withIcon(CellComponent) {
  const HOC = (props) => {
    const { value } = props;
    return <CellComponent {...props}>{`⚜ ${value}`}</CellComponent>;
  };

  HOC.propTypes = {
    value: PropTypes.string.isRequired,
  };

  return HOC;
}
