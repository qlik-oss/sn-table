import { PageInfo } from '../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../constants';
import { GridState } from '../types';

const canMergeRows = (prevPage: EngineAPI.INxPage | undefined, qPage: EngineAPI.INxPage) =>
  prevPage !== undefined &&
  prevPage.qTop + prevPage.qHeight === qPage.qTop &&
  prevPage.qLeft === qPage.qLeft &&
  prevPage.qWidth === qPage.qWidth;

const canMergeColumns = (prevPage: EngineAPI.INxPage | undefined, qPage: EngineAPI.INxPage) =>
  prevPage !== undefined &&
  prevPage.qLeft + prevPage.qWidth === qPage.qLeft &&
  prevPage.qTop === qPage.qTop &&
  prevPage.qHeight === qPage.qHeight;

const isPageStale = (gridState: React.MutableRefObject<GridState>, pageInfo: PageInfo, qPage: EngineAPI.INxPage) => {
  const pageRowStart = pageInfo.page * pageInfo.rowsPerPage;
  const colStartIndex = gridState.current.overscanColumnStartIndex - COLUMN_DATA_BUFFER_SIZE;
  const colEndIndex = gridState.current.overscanColumnStopIndex + COLUMN_DATA_BUFFER_SIZE;
  const rowStartIndex = pageRowStart + gridState.current.overscanRowStartIndex - ROW_DATA_BUFFER_SIZE;
  const rowEndIndex = pageRowStart + gridState.current.overscanRowStopIndex + ROW_DATA_BUFFER_SIZE;

  // qWidth and qHeight is assumed to always be 1. So that is ignored in this check.
  if (
    qPage.qLeft >= colStartIndex &&
    qPage.qLeft <= colEndIndex &&
    qPage.qTop >= rowStartIndex &&
    qPage.qTop <= rowEndIndex
  ) {
    return false;
  }

  return true;
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
  pageInfo: PageInfo
) => {
  const mergedPages: EngineAPI.INxPage[] = [];
  const stalePages: EngineAPI.INxPage[] = [];

  qPages.forEach((qPage) => {
    const prevPage = mergedPages[mergedPages.length - 1];

    if (isPageStale(gridState, pageInfo, qPage)) {
      stalePages.push(qPage);
    } else if (canMergeRows(prevPage, qPage)) {
      prevPage.qHeight += qPage.qHeight;
    } else if (canMergeColumns(prevPage, qPage)) {
      prevPage.qWidth += qPage.qWidth;
    } else {
      mergedPages.push({ ...qPage });
    }
  });

  return [mergedPages, stalePages];
};

export default mergeAllPages;
