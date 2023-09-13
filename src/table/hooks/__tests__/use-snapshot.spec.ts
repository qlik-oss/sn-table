import * as stardust from "@nebula.js/stardust";
import { TableLayout, ViewService } from "../../../types";
import * as getViewStateWrapper from "../../utils/get-view-state";
import * as snapshotWrapper from "../use-snapshot";

jest.mock("@nebula.js/stardust", () => ({
  onTakeSnapshot: jest.fn(),
  useImperativeHandle: jest.fn(),
}));

describe("use-snapshot", () => {
  describe("useSnapshot", () => {
    let layout: TableLayout;
    let viewService: ViewService;
    let rootElement: HTMLElement;
    let model: undefined;
    let contentRect: stardust.stardust.Rect;

    beforeEach(() => {
      layout = {} as TableLayout;
      viewService = {
        scrollLeft: 100,
        visibleLeft: 1,
        visibleWidth: 10,
        scrollTopRatio: 1,
        page: 0,
        rowsPerPage: 100,
        qTop: 0,
        qHeight: 100,
        estimatedRowHeight: 25,
      };
      rootElement = document.createElement("p");
      model = undefined;
      contentRect = { top: 0, left: 0, width: 100, height: 100 };
      jest.spyOn(getViewStateWrapper, "default").mockReturnValue({
        scrollLeft: 1,
        visibleLeft: 2,
        visibleWidth: 3,
        visibleTop: 4,
        visibleHeight: 5,
        scrollTopRatio: 6,
        rowsPerPage: 7,
        page: 0,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("useImperativeHandle should run correct getViewState", async () => {
      snapshotWrapper.default({ layout, viewService, model, rootElement, contentRect });
      const { getViewState } = (stardust.useImperativeHandle as jest.Mock).mock.calls[0][0]();
      const result = getViewState();
      expect(getViewStateWrapper.default).toHaveBeenCalledTimes(1);
      expect(getViewStateWrapper.default).toHaveBeenCalledWith(layout, viewService, rootElement);
      expect(result).toEqual({
        scrollLeft: 1,
        visibleLeft: 2,
        visibleWidth: 3,
        visibleTop: 4,
        visibleHeight: 5,
        scrollTopRatio: 6,
        rowsPerPage: 7,
        page: 0,
      });
    });
  });
});
