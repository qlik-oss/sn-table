import { ColumnWidthType } from "@qlik/nebula-table-utils/lib/constants";
import { setValue } from "qlik-chart-modules";
import conversion from "qlik-object-conversion";
import data from "../qae/data";
import { DimensionProperties, ExportFormat, MeasureProperties, PropTree } from "../types";

export const getColumnInfo = (
  columnInfo: DimensionProperties[] | MeasureProperties[],
  colIdx: number,
  columnWidths?: number[],
  numDims?: number,
) => {
  let index = colIdx;
  if (numDims) index = colIdx - numDims;
  const column = JSON.parse(JSON.stringify(columnInfo[index]));

  // For converting  "table to sn-table",  -1 -> fitToContent and the rest -> pixels
  if (Array.isArray(columnWidths) && columnWidths.length > 0) {
    const columnWidth = columnWidths[colIdx];

    column.qDef.columnWidth =
      columnWidth === -1
        ? {
            type: ColumnWidthType.FitToContent,
          }
        : {
            type: ColumnWidthType.Pixels,
            pixels: columnWidth,
          };
  }

  return column;
};

export const getMultiColumnInfo = (
  qDimensions: DimensionProperties[],
  qMeasures: MeasureProperties[],
  qColumnOrder?: number[],
  columnWidths?: number[],
) => {
  const numDims = qDimensions.length;
  const columnsLength = numDims + qMeasures.length;
  const columnOrder = qColumnOrder?.length === columnsLength ? qColumnOrder : Array.from(Array(columnsLength).keys());

  const dimensions = columnOrder
    .filter((colIdx: number) => colIdx < numDims)
    .map((colIdx: number) => getColumnInfo(qDimensions, colIdx, columnWidths));

  const measures = columnOrder
    .filter((colIdx: number) => colIdx >= numDims)
    .map((colIdx: number) => getColumnInfo(qMeasures, colIdx, columnWidths, numDims));

  return { dimensions, measures };
};

export type ImportProperties = {
  exportFormat: ExportFormat;
  initialProperties: EngineAPI.IGenericHyperCubeProperties;
  extension?: any;
  hypercubePath?: string;
  defaultPropertyValues?: any;
  viewDataMode?: boolean;
};

const importProperties = ({
  exportFormat,
  initialProperties,
  extension,
  hypercubePath,
  defaultPropertyValues,
  viewDataMode,
}: ImportProperties): PropTree => {
  const propertyTree = conversion.hypercube.importProperties({
    exportFormat,
    initialProperties,
    dataDefinition: data().targets[0],
    defaultPropertyValues,
    hypercubePath,
    extension,
  });
  conversion.unquarantineProperty(propertyTree.qProperty, "straightTableColumnOrder");
  const {
    qHyperCubeDef: { qDimensions, qMeasures, qColumnOrder, columnWidths },
  } = propertyTree.qProperty;
  const { dimensions, measures } = getMultiColumnInfo(qDimensions, qMeasures, qColumnOrder, columnWidths);

  if (Array.isArray(columnWidths) && columnWidths.length > 0) {
    setValue(propertyTree, "qProperty.qHyperCubeDef.qDimensions", dimensions);
    setValue(propertyTree, "qProperty.qHyperCubeDef.qMeasures", measures);
  }

  if (viewDataMode) {
    setValue(propertyTree, "qProperty.totals.show", false);
    setValue(propertyTree, "qProperty.usePagination", true);
  }

  conversion.conditionalShow.unquarantine(propertyTree.qProperty);

  return propertyTree;
};

export default importProperties;
