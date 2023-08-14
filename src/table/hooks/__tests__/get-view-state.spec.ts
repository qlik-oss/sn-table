import * as stardust from '@nebula.js/stardust';
import { TableLayout, ViewService } from '../../../types';
import * as snapshotWrapper from '../use-snapshot';

jest.mock('@nebula.js/stardust', () => ({
  onTakeSnapshot: jest.fn(),
  useImperativeHandle: jest.fn(),
}));

describe('use-snapshot', () => {
  describe.only('useSnapshot', () => {
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
      };
      rootElement = document.createElement('p');
      model = undefined;
      contentRect = { top: 0, left: 0, width: 100, height: 100 };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('useImperativeHandle should run correct getViewState', async () => {
      snapshotWrapper.default({ layout, viewService, model, rootElement, contentRect });
      const { getViewState } = (stardust.useImperativeHandle as jest.Mock).mock.calls[0][0]();
      const result = getViewState();
      expect(result).toEqual({
        scrollLeft: 100,
        visibleLeft: 1,
        visibleWidth: 10,
        visibleTop: -1,
        visibleHeight: 0,
        scrollTopRatio: 1,
        rowsPerPage: 100,
        page: 0,
      });
    });
  });
});
