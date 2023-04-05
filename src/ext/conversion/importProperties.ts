import conversion from 'qlik-object-conversion';
import { setValue } from 'qlik-chart-modules';

import data from '../../qae/data';
import { ExportFormat, PropTree } from '../../types';
import { ColumnWidthTypes } from '../../table/constants';

const importProperties = (
  exportFormat: ExportFormat,
  initialProperties: EngineAPI.IGenericHyperCubeProperties,
  extension: any,
  hypercubePath: string
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
    .map((measureIdx: number) => {
      const { columnWidth } = qDimensions[measureIdx].qDef;

      if (
        (!columnWidth || columnWidth.type === ColumnWidthTypes.AUTO) &&
        Array.isArray(columnWidths) &&
        columnWidths[measureIdx] !== -1
      ) {
        return {
          ...qDimensions[measureIdx],
          qDef: {
            ...qDimensions[measureIdx].qDef,
            columnWidth: {
              type: ColumnWidthTypes.PIXELS,
              pixels: columnWidths[measureIdx],
            },
          },
        };
      }

      return qDimensions[measureIdx];
    });

  qMeasures = columnOrder
    .filter((colIdx: number) => colIdx >= numDims)
    .map((colIdx: number) => {
      const measureIdx = colIdx - numDims;
      const { columnWidth } = qMeasures[measureIdx].qDef;

      if (
        (!columnWidth || columnWidth.type === ColumnWidthTypes.AUTO || columnWidth.type === ColumnWidthTypes.PIXELS) &&
        Array.isArray(columnWidths) &&
        columnWidths[colIdx] !== -1
      ) {
        return {
          ...qMeasures[measureIdx],
          qDef: {
            ...qMeasures[measureIdx].qDef,
            columnWidth: {
              type: ColumnWidthTypes.PIXELS,
              pixels: columnWidths[colIdx],
            },
          },
        };
      }

      return qMeasures[measureIdx];
    });

  if (Array.isArray(columnWidths) && !columnWidths.every((columnWidth) => columnWidth === -1)) {
    setValue(propertyTree, 'qProperty.qHyperCubeDef.qDimensions', qDimensions);
    setValue(propertyTree, 'qProperty.qHyperCubeDef.qMeasures', qMeasures);
  }

  conversion.conditionalShow.unquarantine(propertyTree.qProperty);

  return propertyTree;
};

export default importProperties;
