import React from 'react';

export default function withIcon(CellComponent) {
  class HOC extends React.PureComponent {
    render() {
      const { value } = this.props;
      return <CellComponent {...this.props}>{'⚜ ' + value}</CellComponent>;
    }
  }
  return HOC;
}
