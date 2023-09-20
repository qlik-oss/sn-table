import { handleHorizontalScroll, handleNavigateTop } from "../handle-scroll";

describe("handle-scroll", () => {
  describe("handleHorizontalScroll", () => {
    let evt: WheelEvent;
    let memoedContainer: HTMLDivElement;
    let isRTL: boolean;

    beforeEach(() => {
      evt = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        deltaX: -1,
      } as unknown as WheelEvent;
      memoedContainer = {
        scrollWidth: 200,
        offsetWidth: 100,
        scrollLeft: 0,
      } as HTMLDivElement;
      isRTL = true;
    });

    it("should run preventDefault when the scrollbar is at its leftmost place and is scrolled left in LTR direction", () => {
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it("should run preventDefault when the scrollbar is at its rightmost place and is scrolled right in LTR direction", () => {
      evt = {
        ...evt,
        deltaX: 1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 100.5,
      };
      isRTL = false;
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it("should not run preventDefault when the scrollbar is not at its leftmost place or the rightmost place in LTR direction", () => {
      isRTL = false;
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 50,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it("should early return when the it does not scroll horizontally", () => {
      isRTL = false;
      evt = {
        ...evt,
        deltaX: 0,
      };
      const result = handleHorizontalScroll(evt, isRTL, memoedContainer);

      expect(result).toBe(undefined);
      expect(evt.stopPropagation).not.toHaveBeenCalled();
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it("should run preventDefault when the scrollbar is at its leftmost place and is scrolled left in RTL direction", () => {
      evt = {
        ...evt,
        deltaX: -1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -100,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it("should run preventDefault when the scrollbar is at its rightmost place and and is scrolled right in RTL direction", () => {
      evt = {
        ...evt,
        deltaX: 1,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: 1,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it("should not run preventDefault when the scrollbar is not at its leftmost place or the rightmost place in RTL direction", () => {
      evt = {
        ...evt,
        deltaX: -10,
      };
      memoedContainer = {
        ...memoedContainer,
        scrollLeft: -50,
      };
      handleHorizontalScroll(evt, isRTL, memoedContainer);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe("handleNavigateTop", () => {
    let rowHeight: number;
    let scrollTo: () => void;
    let cellCoord: number[];
    let rootElement: HTMLDivElement;

    beforeEach(() => {
      rowHeight = 100;
      scrollTo = jest.fn();
      cellCoord = [0, 0];
      rootElement = {
        getElementsByClassName: () => [{}],
      } as unknown as HTMLDivElement;
    });

    it("should not do anything when rootElement is not setup yet", () => {
      handleNavigateTop(cellCoord, rootElement);
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("should the scrollbar is at its top when you reach the top two rows", () => {
      cellCoord = [1, 0];
      rootElement = {
        getElementsByClassName: () => [{ scrollTo }],
      } as unknown as HTMLDivElement;

      handleNavigateTop(cellCoord, rootElement);
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
    });

    it("should scroll upwards automatically if it detects the cursor gets behind <TableHead />", () => {
      const SCROLL_TOP_IDX = 7;
      cellCoord = [8, 0];

      rootElement = {
        getElementsByClassName: (query: string) => {
          if (query === "sn-table-container") {
            return [{ scrollTo, scrollTop: SCROLL_TOP_IDX * rowHeight }];
          }

          if (query === "sn-table-head-cell") {
            return [{ offsetHeight: 128 }];
          }

          return Array.from(Array(10).keys()).map((idx) => {
            const rowCell = {
              offsetHeight: rowHeight,
              offsetTop: idx * rowHeight,
            };

            return { getElementsByClassName: () => [rowCell] };
          });
        },
      } as unknown as HTMLDivElement;
      // targetOffsetTop = tableContainer.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      // 700 - 100 - 128 = 472 => so our scrollTo function is called with 472
      const targetOffsetTop = 472;

      handleNavigateTop(cellCoord, rootElement);
      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenCalledWith({ top: targetOffsetTop, behavior: "auto" });
    });
  });
});
