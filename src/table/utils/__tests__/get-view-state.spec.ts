import { TableLayout, ViewService, ViewState } from '../../../types';
import getViewState from '../get-view-state';
import * as visibleRowsUtils from '../find-visible-rows';
import * as handleData from '../../../handle-data';
import * as renderAsPagination from '../../../render-as-pagination';

describe('getViewState', () => {
  let layout: TableLayout;
  let viewService: ViewService;
  let rootElement: HTMLElement;

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
    rootElement = document.createElement('p');
    jest.spyOn(visibleRowsUtils, 'findVirtualizedVisibleRows').mockReturnValue({});
    jest.spyOn(visibleRowsUtils, 'findPaginationVisibleRows').mockReturnValue({});
    jest.spyOn(handleData, 'getTotalPosition').mockReturnValue({ atTop: false, atBottom: false });
    jest.spyOn(renderAsPagination, 'default').mockReturnValue(false);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return viewService.viewState if viewService.viewState.isMultiPage is falsy', async () => {
    viewService.viewState = { visibleTop: 10, visibleHeight: 20 } as ViewState;
    const res = getViewState(layout, viewService, rootElement);
    expect(res).toEqual(viewService.viewState);
    expect(renderAsPagination.default).toHaveBeenCalledTimes(0);
    expect(handleData.getTotalPosition).toHaveBeenCalledTimes(0);
    expect(visibleRowsUtils.findPaginationVisibleRows).toHaveBeenCalledTimes(0);
    expect(visibleRowsUtils.findVirtualizedVisibleRows).toHaveBeenCalledTimes(0);
  });

  it('should run correct functions in virtualized table mode', async () => {
    getViewState(layout, viewService, rootElement);
    expect(handleData.getTotalPosition).toHaveBeenCalledTimes(0);
    expect(visibleRowsUtils.findPaginationVisibleRows).toHaveBeenCalledTimes(0);
    expect(visibleRowsUtils.findVirtualizedVisibleRows).toHaveBeenCalledTimes(1);
  });

  it('should return correct result in virtualized table mode', async () => {
    const result = getViewState(layout, viewService, rootElement);
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

  it('should run correct functions in pagination table mode', async () => {
    jest.spyOn(renderAsPagination, 'default').mockReturnValue(true);
    getViewState(layout, viewService, rootElement);
    expect(handleData.getTotalPosition).toHaveBeenCalledTimes(1);
    expect(visibleRowsUtils.findPaginationVisibleRows).toHaveBeenCalledTimes(1);
    expect(visibleRowsUtils.findVirtualizedVisibleRows).toHaveBeenCalledTimes(0);
  });

  it('should return correct result in pagination table mode', async () => {
    jest.spyOn(renderAsPagination, 'default').mockReturnValue(true);
    const result = getViewState(layout, viewService, rootElement);
    expect(result).toEqual({
      rowPartialHeight: undefined,
      scrollLeft: 100,
      visibleTop: -1,
      visibleHeight: 0,
      rowsPerPage: 100,
      page: 0,
    });
  });
});
