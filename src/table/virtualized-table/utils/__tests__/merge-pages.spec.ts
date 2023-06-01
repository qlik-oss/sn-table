import { PageInfo } from '../../../../types';
import { COLUMN_DATA_BUFFER_SIZE, ROW_DATA_BUFFER_SIZE } from '../../constants';
import { GridState } from '../../types';
import mergeAllPages from '../merge-pages';

describe('mergePages', () => {
  let gridState: React.MutableRefObject<GridState>;
  let pageInfo: PageInfo;

  beforeEach(() => {
    gridState = {
      current: {
        overscanColumnStartIndex: 0,
        overscanColumnStopIndex: 10,
        overscanRowStartIndex: 0,
        overscanRowStopIndex: 10,
      },
    };

    pageInfo = {
      page: 0,
      rowsPerPage: 100,
      rowsPerPageOptions: [],
    };
  });

  describe('merge rows', () => {
    test('should merge pages', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 1, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual([{ qLeft: 0, qTop: 0, qHeight: 2, qWidth: 1 }]);
    });

    test('should handle merging some pages but not others', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 1, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 4, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual([
        { qLeft: 0, qTop: 0, qHeight: 2, qWidth: 1 },
        { qLeft: 0, qTop: 4, qHeight: 1, qWidth: 1 },
      ]);
    });

    test('should not merge pages when the pages are not next to each other', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 2, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual(qPages);
    });

    test('should not merge pages when the qLeft does not match', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 1, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual(qPages);
    });

    test('should not merge pages when the qWidth does not match', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 1, qHeight: 1, qWidth: 2 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual(qPages);
    });
  });

  describe('merge columns', () => {
    test('should merge pages', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 0, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual([{ qLeft: 0, qTop: 0, qHeight: 1, qWidth: 2 }]);
    });

    test('should handle merging some pages but not others', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 4, qTop: 0, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual([
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 2 },
        { qLeft: 4, qTop: 0, qHeight: 1, qWidth: 1 },
      ]);
    });

    test('should not merge pages when the pages are not next to each other', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 2, qTop: 0, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual(qPages);
    });

    test('should not merge pages when the Qtop does not match', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 1, qHeight: 1, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual(qPages);
    });

    test('should not merge pages when the qHeight does not match', () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 0, qHeight: 2, qWidth: 1 },
      ];
      const [mergedPages] = mergeAllPages(qPages, gridState, pageInfo);

      expect(mergedPages).toEqual(qPages);
    });
  });

  describe('stale pages', () => {
    test('should consider qPage stale given that is qLeft is less than grid column start index', () => {
      gridState.current.overscanColumnStartIndex = 100;
      gridState.current.overscanColumnStopIndex = 200;

      const qPages: EngineAPI.INxPage[] = [{ qLeft: 99 - COLUMN_DATA_BUFFER_SIZE, qTop: 0, qHeight: 1, qWidth: 1 }];

      const [, stalePages] = mergeAllPages(qPages, gridState, pageInfo);
      expect(stalePages).toEqual(qPages);
    });

    test('should consider qPage stale given that is qLeft is larger than grid column end index', () => {
      gridState.current.overscanColumnStartIndex = 100;
      gridState.current.overscanColumnStopIndex = 200;

      const qPages: EngineAPI.INxPage[] = [{ qLeft: 201 + COLUMN_DATA_BUFFER_SIZE, qTop: 0, qHeight: 1, qWidth: 1 }];

      const [, stalePages] = mergeAllPages(qPages, gridState, pageInfo);
      expect(stalePages).toEqual(qPages);
    });

    test('should consider qPage stale given that is qTop is less than grid row start index', () => {
      gridState.current.overscanRowStartIndex = 100;
      gridState.current.overscanRowStopIndex = 200;

      const qPages: EngineAPI.INxPage[] = [{ qLeft: 0, qTop: 99 - ROW_DATA_BUFFER_SIZE, qHeight: 1, qWidth: 1 }];

      const [, stalePages] = mergeAllPages(qPages, gridState, pageInfo);
      expect(stalePages).toEqual(qPages);
    });

    test('should consider qPage stale given that is qTop is less than grid row start index and the current active page', () => {
      gridState.current.overscanRowStartIndex = 100;
      gridState.current.overscanRowStopIndex = 200;
      pageInfo.page = 1;

      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 99 - ROW_DATA_BUFFER_SIZE + pageInfo.page * pageInfo.rowsPerPage, qHeight: 1, qWidth: 1 },
      ];

      const [, stalePages] = mergeAllPages(qPages, gridState, pageInfo);
      expect(stalePages).toEqual(qPages);
    });

    test('should consider qPage stale given that is qTop is larger than grid row end index', () => {
      gridState.current.overscanRowStartIndex = 100;
      gridState.current.overscanRowStopIndex = 200;

      const qPages: EngineAPI.INxPage[] = [{ qLeft: 0, qTop: 201 + ROW_DATA_BUFFER_SIZE, qHeight: 1, qWidth: 1 }];

      const [, stalePages] = mergeAllPages(qPages, gridState, pageInfo);
      expect(stalePages).toEqual(qPages);
    });

    test('should consider qPage stale given that is qTop is larger than grid row end index and the current active page', () => {
      gridState.current.overscanRowStartIndex = 100;
      gridState.current.overscanRowStopIndex = 200;
      pageInfo.page = 1;

      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 201 + ROW_DATA_BUFFER_SIZE + pageInfo.page * pageInfo.rowsPerPage, qHeight: 1, qWidth: 1 },
      ];

      const [, stalePages] = mergeAllPages(qPages, gridState, pageInfo);
      expect(stalePages).toEqual(qPages);
    });
  });
});
