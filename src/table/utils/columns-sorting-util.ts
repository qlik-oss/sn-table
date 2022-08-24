import { QHyperCubeDef, DimensionProperties, MeasureProperties } from '../../types';
/**
 * Swap two items in an array.
 *
 * @param array
 * @param firstIndex
 * @param secondIndex
 */
const swap = (
  array: MeasureProperties[] | DimensionProperties[] | number[],
  firstIndex: number,
  secondIndex: number
) => {
  const firstItem = array[firstIndex];
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = firstItem;
};

/**
 * Validates potential errors in the columnOrder and qInterColumnSortOrder arrays.
 * An array is considered invalid if any of the below conditions is true:
 *
 * 1. The length is different than the number of dims + meas
 * 2. There are duplicate indexes / missing indexes in the array
 * 3. There are gaps in the array
 * 4. The array is not starting with the index 0
 *
 * @param array
 * @returns {boolean}
 */
const isInvalidOrderArray = (dimensions: DimensionProperties[], measures: MeasureProperties[], array: number[]) => {
  const indexSet = {} as Record<number, boolean>;
  let sortedArray = [] as number[];
  let isInvalid = false;

  array.forEach((item) => {
    if (indexSet[item]) {
      isInvalid = true;
    } else {
      indexSet[item] = true;
    }
  });

  isInvalid = isInvalid || dimensions.length + measures.length !== Object.keys(indexSet).length;

  Object.keys(indexSet).forEach((indexStr) => {
    sortedArray.push(parseInt(indexStr, 10));
  });
  sortedArray = sortedArray.sort((a, b) => a - b);

  for (let i = 0; i < sortedArray.length; ++i) {
    isInvalid = isInvalid || sortedArray[i] !== i;
  }

  return isInvalid;
};

/**
 * Validates and fixes potential errors in the columnOrder and qInterColumnSortOrder arrays.
 * An array is considered invalid if any of the below conditions is true:
 *
 * 1. The length is different than the number of dims + meas
 * 2. There are duplicate indexes / missing indexes in the array
 * 3. There are gaps in the array
 * 4. The array is not starting with the index 0
 *
 * @param hypercubeDef
 */
const validateTableHyperCube = (hypercubeDef: QHyperCubeDef) => {
  const dimensions = hypercubeDef.qDimensions;
  const measures = hypercubeDef.qMeasures;

  function buildDefaultArray() {
    const array = [];
    for (let i = 0; i < dimensions.length + measures.length; i++) {
      array.push(i);
    }
    return array;
  }

  if (isInvalidOrderArray(dimensions, measures, hypercubeDef.qColumnOrder)) {
    hypercubeDef.qColumnOrder = buildDefaultArray();
  }

  if (isInvalidOrderArray(dimensions, measures, hypercubeDef.qInterColumnSortOrder)) {
    hypercubeDef.qInterColumnSortOrder = buildDefaultArray();
  }
};

/**
 * Reorders items in the columnOrder, qDimensions, qMeasures and qInterColumnSortOrder arrays
 * into a standardized format. The format describes that both dimensions and measures should be in
 * ascending order (individually) in the columnOrder array.
 *
 * E.g.:
 * If a table has two dimensions and two measures with a columnOrder of [1, 3, 0, 2], this will be
 * reordered to [0, 2, 1, 3] and needed changes will be made to mentioned arrays.
 *
 * The reason why this is needed is because:
 * 1. Functions like Column(n) requires the columnOrder array to be synced with the measures in ascending order.
 * 2. Converting the table into e.g. a barchart should present the dimensions / measures in a similiar order.
 *
 * @param hypercubeDef
 */
export const fixTableHypercubeOrders = (hypercubeDef: QHyperCubeDef) => {
  validateTableHyperCube(hypercubeDef);

  const dimensions = hypercubeDef.qDimensions;
  const measures = hypercubeDef.qMeasures;
  const columnOrder = hypercubeDef.qColumnOrder;
  const interColSortOrder = hypercubeDef.qInterColumnSortOrder;
  const dimColOrders = [] as number[];
  const measColOrders = [] as number[];
  let order;

  for (let i = 0; i < columnOrder.length; i++) {
    order = columnOrder[i];
    if (order < dimensions.length) {
      // Dimension
      dimColOrders.push(order);
    } else {
      // Measure
      measColOrders.push(order);
    }
  }

  function fixDimensions() {
    for (let i = 0; i < dimColOrders.length; i++) {
      if (dimColOrders[i] !== i) {
        const moveFrom = dimColOrders[i];
        const moveToIndex = dimColOrders.indexOf(i);
        const moveTo = dimColOrders[moveToIndex];
        swap(dimColOrders, i, moveToIndex);
        swap(dimensions, moveFrom, moveTo);
        swap(columnOrder, columnOrder.indexOf(moveFrom), columnOrder.indexOf(moveTo));
        swap(interColSortOrder, interColSortOrder.indexOf(moveFrom), interColSortOrder.indexOf(moveTo));
      }
    }
  }

  function fixMeasures() {
    for (let i = 0; i < measColOrders.length; i++) {
      if (measColOrders[i] !== i + dimensions.length) {
        const moveFrom = measColOrders[i];
        const moveToIndex = measColOrders.indexOf(i + dimensions.length);
        const moveTo = measColOrders[moveToIndex];
        swap(measColOrders, i, moveToIndex);
        swap(measures, moveFrom - dimensions.length, moveTo - dimensions.length);
        swap(columnOrder, columnOrder.indexOf(moveFrom), columnOrder.indexOf(moveTo));
        swap(interColSortOrder, interColSortOrder.indexOf(moveFrom), interColSortOrder.indexOf(moveTo));
      }
    }
  }

  fixDimensions();
  fixMeasures();
};

export const storeColumnWidths = (hcDef: QHyperCubeDef) => {
  const { qDimensions, qMeasures, columnWidths } = hcDef;
  for (let i = 0; i < qDimensions.length; i++) {
    qDimensions[i].columnWidth = columnWidths[i];
  }
  for (let i = 0; i < qMeasures.length; i++) {
    qMeasures[i].columnWidth = columnWidths[i + qDimensions.length];
  }
};

export const updateColumnInfoOrders = (hcDef: QHyperCubeDef) => {
  const { qColumnOrder, columnWidths, qDimensions, qMeasures } = hcDef;
  const numDimensions = qDimensions.length;
  qColumnOrder.forEach((item) => {
    columnWidths[item] =
      item < numDimensions ? qDimensions[item].columnWidth : qMeasures[item - numDimensions].columnWidth;
  });
  qDimensions.forEach((item: { columnWidth?: number }) => delete item.columnWidth);
  qMeasures.forEach((item: { columnWidth?: number }) => delete item.columnWidth);
};
