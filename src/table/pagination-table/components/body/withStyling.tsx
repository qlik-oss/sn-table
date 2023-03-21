import React, { ReactElement } from 'react';
import { StyledBodyCell } from './styles';
import { CellHOCProps } from '../../../types';

export default function withStyling(CellComponent: typeof StyledBodyCell) {
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
      onMouseOver,
    } = props;

    return (
      <CellComponent
        cellStyle={style}
        component={component}
        scope={scope}
        align={align}
        tabIndex={tabIndex}
        className={`sn-table-cell ${selectedCellClass || ''}`}
        title={(children as ReactElement).props.children}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onKeyUp={onKeyUp}
        onMouseUp={onMouseUp}
        onMouseOver={onMouseOver}
      >
        {children}
      </CellComponent>
    );
  };

  return HOC;
}
