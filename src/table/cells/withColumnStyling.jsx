import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getColumnStyling } from '../styling-utils';

export default function withColumnStyling(CellComponent) {
  const HOC = (props) => {
    const { cell, column, styling } = props;
    const columnStyling = useMemo(() => getColumnStyling(styling, cell.qAttrExps, column.stylingInfo), [
      cell.qAttrExps,
    ]);

    return <CellComponent {...props} styling={columnStyling} />;
  };

  HOC.propTypes = {
    cell: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    styling: PropTypes.object.isRequired,
  };

  return HOC;
}
