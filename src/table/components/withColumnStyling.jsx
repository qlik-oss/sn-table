import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getColumnStyle } from '../utils/styling-utils';

export default function withColumnStyling(CellComponent) {
  const HOC = (props) => {
    const { cell, column, styling, ...passThroughProps } = props;

    const columnStyling = useMemo(
      () => getColumnStyle(styling, cell.qAttrExps, column.stylingInfo),
      [styling, cell.qAttrExps, column.stylingInfo]
    );

    return <CellComponent {...passThroughProps} cell={cell} styling={columnStyling} />;
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
