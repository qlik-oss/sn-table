import React from 'react';
import { TableCellProps } from '@mui/material';
import { hocProps } from '../../types';

export default function withStyling(CellComponent: (props: TableCellProps) => JSX.Element) {
  const HOC = (props: hocProps) => {
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

  return HOC;
}
