const directionMap = {
  A: 'asc',
  D: 'desc',
};

const MAX_CELLS = 10000;

export function getHighestPossibleRpp(width, rowsPerPageOptions) {
  const highestPossibleOption = [...rowsPerPageOptions].reverse().find((opt) => opt * width <= MAX_CELLS);
  return highestPossibleOption || Math.floor(MAX_CELLS / width); // covering corner case of lowest option being too high
}

export function getColumnOrder({ qColumnOrder, qDimensionInfo, qMeasureInfo }) {
  if (qColumnOrder?.length === qDimensionInfo.length + qMeasureInfo.length) return qColumnOrder;
  return [...Array(qDimensionInfo.length + qMeasureInfo.length).keys()];
}

export function getColumnInfo(qHyperCube, colIndex) {
  const { qDimensionInfo, qMeasureInfo } = qHyperCube;
  const numDims = qDimensionInfo.length;
  const isDim = colIndex < numDims;
  const info = isDim ? qDimensionInfo[colIndex] : qMeasureInfo[colIndex - numDims];
  const isHidden = info.qError?.qErrorCode === 7005;
  return (
    !isHidden && {
      isDim,
      width: 200,
      label: info.qFallbackTitle,
      id: `col-${colIndex}`,
      align: !info.textAlign || info.textAlign.auto ? (isDim ? 'left' : 'right') : info.textAlign.align,
      stylingInfo: info.qAttrExprInfo.map((expr) => expr.id),
      sortDirection: directionMap[info.qSortIndicator],
    }
  );
}

export function getColumns(qHyperCube) {
  const columns = [];
  const columnOrder = getColumnOrder(qHyperCube);
  columnOrder.forEach((colIndex, idx, self) => {
    const column = getColumnInfo(qHyperCube, colIndex);
    if (column) {
      columns.push(column);
      self.splice(idx, 1);
    }
  });
  return { columnOrder, columns };
}

export default async function manageData(model, layout, pageInfo, setPageInfo) {
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;
  const { qHyperCube } = layout;
  const size = qHyperCube.qSize;
  const top = page * rowsPerPage;
  const width = size.qcx;
  const totalHeight = size.qcy;
  const height = Math.min(rowsPerPage, totalHeight - top);
  // When the number of rows is reduced (e.g. confirming selections),
  // you can end up still being on a page that doesn't exist anymore, then go back to the first page and return null
  if (page > 0 && top >= totalHeight) {
    setPageInfo({ ...pageInfo, page: 0 });
    return null;
  }
  // If the number of cells exceeds 10k then we need to lower the rows per page to the maximum possible value
  if (height * width > MAX_CELLS) {
    setPageInfo({ ...pageInfo, rowsPerPage: getHighestPossibleRpp(width, rowsPerPageOptions), page: 0 });
    return null;
  }

  const { columns, columnOrder } = getColumns(qHyperCube);

  const dataPages = await model.getHyperCubeData('/qHyperCubeDef', [
    { qTop: top, qLeft: 0, qHeight: height, qWidth: width },
  ]);
  const rows = dataPages[0].qMatrix.map((r, rowIdx) => {
    const row = { key: `row-${rowIdx}` };
    columns.forEach((c, colIdx) => {
      row[c.id] = {
        ...r[colIdx],
        rowIdx: rowIdx + top,
        colIdx: columnOrder[colIdx],
        isDim: c.isDim,
        rawRowIdx: rowIdx,
        rawColIdx: colIdx,
      };
    });
    return row;
  });

  return { size, rows, columns, columnOrder };
}
