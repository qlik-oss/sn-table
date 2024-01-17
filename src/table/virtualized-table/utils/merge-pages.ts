import { PageInfo } from "../../../types";
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from "../constants";
import { GridState } from "../types";

const isPageStale = (gridState: React.MutableRefObject<GridState>, pageInfo: PageInfo, qPage: EngineAPI.INxPage) => {
  const pageRowStart = pageInfo.page * pageInfo.rowsPerPage;
  const colStartIndex = gridState.current.overscanColumnStartIndex - COLUMN_DATA_BUFFER_SIZE;
  const colEndIndex = gridState.current.overscanColumnStopIndex + COLUMN_DATA_BUFFER_SIZE;
  const rowStartIndex = pageRowStart + gridState.current.overscanRowStartIndex - ROW_DATA_BUFFER_SIZE;
  const rowEndIndex = pageRowStart + gridState.current.overscanRowStopIndex + ROW_DATA_BUFFER_SIZE;
  const { qLeft, qTop, qWidth, qHeight } = qPage;

  // The page is considered stale if both "points" from by the qPage, are outside the rectangle
  // formed by the gridState + buffer.
  return (
    (qLeft < colStartIndex || qLeft > colEndIndex || qTop < rowStartIndex || qTop > rowEndIndex) &&
    (qLeft + qWidth < colStartIndex ||
      qLeft + qWidth > colEndIndex ||
      qTop + qHeight < rowStartIndex ||
      qTop + qHeight > rowEndIndex)
  );
};

/**
 * There is an assumption here that by merging multiple pages into fewer pages
 * with a larger qHeight/qWidth value. The performance on the Engine side is improved.
 *
 * A stale page is a page that is not close to being visible to the user. They are discarded
 * to avoid fetching data is not really needed.
 */
const mergeAllPages = (
  qPages: EngineAPI.INxPage[],
  gridState: React.MutableRefObject<GridState>,
  pageInfo: PageInfo,
) => {
  const stalePages: EngineAPI.INxPage[] = [];
  const filterdPages: EngineAPI.INxPage[] = [];

  qPages.forEach((qPage) => {
    if (isPageStale(gridState, pageInfo, qPage)) {
      stalePages.push(qPage);
    } else {
      filterdPages.push({ ...qPage });
    }
  });

  const mergedPages = filterdPages.reduce((tempMergedPages: EngineAPI.INxPage[], qPage) => {
    const [mergedPage] = tempMergedPages;
    if (mergedPage === undefined) {
      tempMergedPages.push({ ...qPage });
    } else {
      const maxX = Math.max(qPage.qLeft + qPage.qWidth, mergedPage.qLeft + mergedPage.qWidth);
      mergedPage.qLeft = Math.min(qPage.qLeft, mergedPage.qLeft);
      mergedPage.qWidth = maxX - mergedPage.qLeft;

      const maxY = Math.max(qPage.qTop + qPage.qHeight, mergedPage.qTop + mergedPage.qHeight);
      mergedPage.qTop = Math.min(qPage.qTop, mergedPage.qTop);
      mergedPage.qHeight = maxY - mergedPage.qTop;
    }

    return tempMergedPages;
  }, []);

  return [mergedPages, stalePages];
};

export default mergeAllPages;
