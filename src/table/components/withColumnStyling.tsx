import React, { useMemo } from 'react';
import { getColumnStyle } from '../utils/styling-utils';
import { hocProps } from '../../types';

export default function withColumnStyling(CellComponent: (props: hocProps) => JSX.Element) {
  const HOC = (props: hocProps) => {
    const { cell, column, styling } = props;

    const columnStyling = useMemo(
      () => getColumnStyle(styling, cell.qAttrExps, column.stylingIDs),
      [styling, cell.qAttrExps, column.stylingIDs]
    );

    return <CellComponent {...props} styling={columnStyling} />;
  };

  return HOC;
}
