import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getColumnStyle } from '../styling-utils';

export default function withColumnStyling(CellComponent) {
  const HOC = (props) => {
    const { cell, column, styling, selState } = props;
    console.log('column', styling);
    const columnStyling = useMemo(() => getColumnStyle(styling, cell.qAttrExps, column.stylingInfo), [
      styling,
      cell.qAttrExps,
      column.stylingInfo,
      selState,
    ]);

    return <CellComponent {...props} styling={columnStyling} />;
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    styling: PropTypes.object.isRequired,
    selState: PropTypes.object.isRequired,
  };

  return HOC;
}
