import React from 'react';
import PropTypes from 'prop-types';

export default function withIcon(CellComponent) {
  class HOC extends React.PureComponent {
    render() {
      const { value } = this.props;
      return <CellComponent {...this.props}>{`⚜ ${value}`}</CellComponent>;
    }
  }

  HOC.propTypes = {
    value: PropTypes.string.isRequired,
  };

  return HOC;
}
