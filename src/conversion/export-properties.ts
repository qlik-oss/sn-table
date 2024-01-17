import { setValue } from "qlik-chart-modules";
import conversion from "qlik-object-conversion";

import { ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import { DimensionProperties, ExportFormat, MeasureProperties, PropTree } from "../types";

const getColumnWidth = (colIdx: number, qDimensions: DimensionProperties[], qMeasures: MeasureProperties[]) => {
  const numDims = qDimensions.length;
  const isDim = colIdx < numDims;
  const info = isDim ? qDimensions[colIdx] : qMeasures[colIdx - numDims];

  const { columnWidth } = info.qDef;

  // For converting "sn-table to table", columnWidth is -1 unless the width type is pixels.
  return columnWidth?.type === "pixels" ? columnWidth.pixels ?? ColumnWidthValues.PixelsDefault : -1;
};

export const getColumnWidths = (
  qDimensions: DimensionProperties[],
  qMeasures: MeasureProperties[],
  qColumnOrder?: number[],
) => {
  const columnsLength = qDimensions.length + qMeasures.length;
  const columnOrder = qColumnOrder?.length === columnsLength ? qColumnOrder : Array.from(Array(columnsLength).keys());
  const columnWidths = columnOrder.map((colIdx: number) => getColumnWidth(colIdx, qDimensions, qMeasures));

  return columnWidths;
};

type ExportProperties = {
  propertyTree: PropTree;
  hyperCubePath?: string;
};

const exportProperties = ({ propertyTree, hyperCubePath }: ExportProperties): ExportFormat => {
  const expFormat = conversion.hypercube.exportProperties({
    propertyTree,
    hyperCubePath,
  });
  const {
    qHyperCubeDef: { qColumnOrder, qDimensions, qMeasures },
  } = expFormat.properties;
  const columnWidths = getColumnWidths(qDimensions, qMeasures, qColumnOrder);
  const qHyperCubeDef = {
    ...expFormat.properties.qHyperCubeDef,
    columnWidths,
  };

  setValue(expFormat, "properties.qHyperCubeDef", qHyperCubeDef);

  conversion.quarantineProperty(expFormat.properties, "qHyperCubeDef.columnWidths", "straightTableColumnWidths");
  conversion.quarantineProperty(expFormat.properties, "qHyperCubeDef.qColumnOrder", "straightTableColumnOrder");
  conversion.quarantineProperty(expFormat.properties, "qHyperCubeDef.columnOrder", "straightTableColumnOrder");

  return expFormat;
};

export default exportProperties;
