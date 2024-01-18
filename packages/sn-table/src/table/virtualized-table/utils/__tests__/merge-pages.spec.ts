import mergePages from "../merge-pages";

describe("mergePages", () => {
  describe("merge rows", () => {
    test("should merge pages", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 1, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual([{ qLeft: 0, qTop: 0, qHeight: 2, qWidth: 1 }]);
    });

    test("should handle merging some pages but not others", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 1, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 4, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual([
        { qLeft: 0, qTop: 0, qHeight: 2, qWidth: 1 },
        { qLeft: 0, qTop: 4, qHeight: 1, qWidth: 1 },
      ]);
    });

    test("should not merge pages when the pages are not next to each other", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 2, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual(qPages);
    });

    test("should not merge pages when the qLeft does not match", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 1, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual(qPages);
    });

    test("should not merge pages when the qWidth does not match", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 0, qTop: 1, qHeight: 1, qWidth: 2 },
      ];

      expect(mergePages(qPages)).toEqual(qPages);
    });
  });

  describe("merge columns", () => {
    test("should merge pages", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 0, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual([{ qLeft: 0, qTop: 0, qHeight: 1, qWidth: 2 }]);
    });

    test("should handle merging some pages but not others", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 4, qTop: 0, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual([
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 2 },
        { qLeft: 4, qTop: 0, qHeight: 1, qWidth: 1 },
      ]);
    });

    test("should not merge pages when the pages are not next to each other", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 2, qTop: 0, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual(qPages);
    });

    test("should not merge pages when the Qtop does not match", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 1, qHeight: 1, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual(qPages);
    });

    test("should not merge pages when the qHeight does not match", () => {
      const qPages: EngineAPI.INxPage[] = [
        { qLeft: 0, qTop: 0, qHeight: 1, qWidth: 1 },
        { qLeft: 1, qTop: 0, qHeight: 2, qWidth: 1 },
      ];

      expect(mergePages(qPages)).toEqual(qPages);
    });
  });
});
