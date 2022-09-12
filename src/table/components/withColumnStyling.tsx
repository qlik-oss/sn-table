import React, { useMemo } from 'react';
import { getColumnStyle } from '../utils/styling-utils';
import { CellHOCProps, CellHOC } from '../types';

export default function withColumnStyling(CellComponent: CellHOC) {
  const HOC = (props: CellHOCProps) => {
    const { cell, column, styling } = props;

    const columnStyling = useMemo(
      () => getColumnStyle(styling, cell.qAttrExps, column.stylingIDs),
      [styling, cell.qAttrExps, column.stylingIDs]
    );

    return <CellComponent {...props} styling={columnStyling} />;
  };

  return HOC;
}
