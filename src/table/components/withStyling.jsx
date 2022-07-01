import React from 'react';
import PropTypes from 'prop-types';

export default function withStyling(CellComponent) {
  const HOC = (props) => {
    const {
      styling: { selectedCellClass, ...style },
      component,
      align,
      children,
      scope,
      tabIndex,
      onKeyDown,
      onMouseDown,
      onKeyUp,
      onMouseUp,
    } = props;

    return (
      <CellComponent
        component={component}
        scope={scope}
        align={align}
        tabIndex={tabIndex}
        className={`sn-table-cell ${selectedCellClass || ''}`}
        sx={style}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onKeyUp={onKeyUp}
        onMouseUp={onMouseUp}
      >
        {children}
      </CellComponent>
    );
  };

  HOC.defaultProps = {
    component: null,
    scope: null,
    onMouseUp: null,
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    component: PropTypes.string,
    align: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    scope: PropTypes.string,
    tabIndex: PropTypes.number.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func,
  };

  return HOC;
}
