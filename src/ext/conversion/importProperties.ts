import conversion from 'qlik-object-conversion';
import { setValue } from 'qlik-chart-modules';

import data from '../../qae/data';
import { ExportFormat, PropTree, DimensionProperties, MeasureProperties } from '../../types';
import { ColumnWidthTypes } from '../../table/constants';

export const getColumnInfo = (
  columnInfo: DimensionProperties[] | MeasureProperties[],
  colIdx: number,
  columnWidths: unknown,
  numDims?: number
) => {
  let index = colIdx;
  if (numDims) index = colIdx - numDims;
  const column = columnInfo[index];

  // For converting  "table to sn-table",  -1 -> fitToContent and the rest -> pixels
  if (Array.isArray(columnWidths) && columnWidths.length > 0) {
    const columnWidth = columnWidths[colIdx];

    return {
      ...column,
      qDef: {
        ...column.qDef,
        columnWidth:
          columnWidth === -1
            ? {
                type: ColumnWidthTypes.FIT_TO_CONTENT,
              }
            : {
                type: ColumnWidthTypes.PIXELS,
                pixels: columnWidth,
              },
      },
    };
  }

  return column;
};

const importProperties = (
  exportFormat: ExportFormat,
  initialProperties: EngineAPI.IGenericHyperCubeProperties,
  extension: any,
  hypercubePath?: string
): PropTree => {
  const propertyTree = conversion.hypercube.importProperties({
    exportFormat,
    initialProperties,
    dataDefinition: data().targets[0],
    defaultPropertyValues: {
      defaultDimension: extension.getDefaultDimensionProperties(),
      defaultMeasure: extension.getDefaultMeasureProperties(),
    },
    hypercubePath,
    extension,
  });
  const {
    qHyperCubeDef: { qColumnOrder, columnWidths },
  } = propertyTree.qProperty;
  let {
    qHyperCubeDef: { qDimensions, qMeasures },
  } = propertyTree.qProperty;
  const numDims = qDimensions.length;
  const columnsLength = numDims + qMeasures.length;
  const columnOrder = qColumnOrder?.length === columnsLength ? qColumnOrder : Array.from(Array(columnsLength).keys());

  qDimensions = columnOrder
    .filter((colIdx: number) => colIdx < numDims)
    .map((colIdx: number) => getColumnInfo(qDimensions, colIdx, columnWidths));

  qMeasures = columnOrder
    .filter((colIdx: number) => colIdx >= numDims)
    .map((colIdx: number) => getColumnInfo(qMeasures, colIdx, columnWidths, numDims));

  if (Array.isArray(columnWidths) && columnWidths.length > 0) {
    setValue(propertyTree, 'qProperty.qHyperCubeDef.qDimensions', qDimensions);
    setValue(propertyTree, 'qProperty.qHyperCubeDef.qMeasures', qMeasures);
  }

  conversion.conditionalShow.unquarantine(propertyTree.qProperty);

  return propertyTree;
};

export default importProperties;
