const canMergeRows = (prevPage: EngineAPI.INxPage, page: EngineAPI.INxPage) =>
  prevPage.qTop + prevPage.qHeight === page.qTop && prevPage.qLeft === page.qLeft && prevPage.qWidth === page.qWidth;

const canMergeColumns = (prevPage: EngineAPI.INxPage, page: EngineAPI.INxPage) =>
  prevPage.qLeft + prevPage.qWidth === page.qLeft && prevPage.qTop === page.qTop && prevPage.qHeight === page.qHeight;

/**
 * There is an assumption here that by merging multiple pages into fewer pages
 * with a larger qHeight/qWidth value. The performance on the Engine side is improved.
 */
const mergePages = (qPages: EngineAPI.INxPage[]) => {
  const pages: EngineAPI.INxPage[] = [];
  qPages.forEach((page) => {
    if (pages.length > 0) {
      const prevPage = pages[pages.length - 1];
      if (canMergeRows(prevPage, page)) {
        prevPage.qHeight += page.qHeight;
      } else if (canMergeColumns(prevPage, page)) {
        prevPage.qWidth += page.qWidth;
      } else {
        pages.push({ ...page });
      }
    } else {
      pages.push({ ...page });
    }
  });

  return pages;
};

export default mergePages;
