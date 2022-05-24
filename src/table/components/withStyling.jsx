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
      handleKeyDown,
      handleMouseDown,
      handleMouseUp,
    } = props;

    return (
      <CellComponent
        component={component}
        scope={scope}
        align={align}
        tabIndex={tabIndex}
        className={selectedCellClass ? `${selectedCellClass} sn-table-cell` : `sn-table-cell`}
        sx={style}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {children}
      </CellComponent>
    );
  };

  HOC.defaultProps = {
    component: null,
    scope: null,
    handleMouseUp: null,
  };

  HOC.propTypes = {
    styling: PropTypes.object.isRequired,
    component: PropTypes.string,
    align: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    scope: PropTypes.string,
    tabIndex: PropTypes.number.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    handleMouseUp: PropTypes.func,
  };

  return HOC;
}
