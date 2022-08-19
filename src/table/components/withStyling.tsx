import React from 'react';
import TableCell from '@mui/material/TableCell';
import { CellHOCProps } from '../../types';

export default function withStyling(CellComponent: typeof TableCell) {
  const HOC = (props: CellHOCProps) => {
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
