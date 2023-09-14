import renderAsPagination from '../render-as-pagination';
import * as isPrinting from '../is-printing';
import { TableLayout, ViewService, ViewState } from '../types';

describe('handle-data', () => {
  let layout: TableLayout;
  let viewService: ViewService;

  beforeEach(() => {
    layout = {} as TableLayout;
    viewService = {
      qTop: 0,
      qHeight: 100,
      viewState: { usePagination: undefined } as ViewState,
    } as ViewService;
    jest.spyOn(isPrinting, 'default').mockReturnValue(true);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('viewService.viewState.usePagination is explicitly set', () => {
    it('should return true if viewService.viewState?.usePagination = true', () => {
      if (viewService.viewState) viewService.viewState.usePagination = true;
      expect(renderAsPagination(layout, viewService)).toEqual(true);
      expect(isPrinting.default).toHaveBeenCalledTimes(0);
    });

    it('should return false if viewService.viewState?.usePagination = false', () => {
      if (viewService.viewState) viewService.viewState.usePagination = false;
      expect(renderAsPagination(layout, viewService)).toEqual(false);
      expect(isPrinting.default).toHaveBeenCalledTimes(0);
    });
  });

  describe('viewService.viewState.usePagination is undefined', () => {
    it('should return true if layout.usePagination = true', () => {
      layout.usePagination = true;
      expect(renderAsPagination(layout, viewService)).toEqual(true);
      expect(isPrinting.default).toHaveBeenCalledTimes(0);
    });

    it('should return true if layout.usePagination = undefined', () => {
      expect(renderAsPagination(layout, viewService)).toEqual(true);
      expect(isPrinting.default).toHaveBeenCalledTimes(0);
    });

    it('should return true if layout.usePagination = false and isPrinting = true', () => {
      layout.usePagination = false;
      expect(renderAsPagination(layout, viewService)).toEqual(true);
      expect(isPrinting.default).toHaveBeenCalledTimes(1);
    });

    it('should return false if layout.usePagination = false and isPrinting = false', () => {
      layout.usePagination = false;
      jest.spyOn(isPrinting, 'default').mockReturnValue(false);
      expect(renderAsPagination(layout, viewService)).toEqual(false);
      expect(isPrinting.default).toHaveBeenCalledTimes(1);
    });
  });
});
