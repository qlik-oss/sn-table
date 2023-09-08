import isPrinting from '../is-printing';
import { SnapshotData, TableLayout, ViewService, ViewState } from '../types';

describe('is-printing', () => {
  let layout: TableLayout;
  let viewService: ViewService;

  beforeEach(() => {
    layout = {} as TableLayout;
    viewService = {
      qTop: 0,
      qHeight: 100,
      viewState: {visibleHeight: 0} as ViewState,
    } as ViewService;

  });
  it('should return true if layout.snapshotData is truthy', () => {
    layout.snapshotData = {} as SnapshotData;
    expect(isPrinting(layout, viewService)).toEqual(true);
  });

  it('should return true if layout.snapshotData is falsy but viewService.viewState.visibleHeight is truthy', () => {
    if(viewService.viewState) viewService.viewState.visibleHeight = 1;
    expect(isPrinting(layout, viewService)).toEqual(true);
  });

  it('should return true if layout.snapshotData is falsy and viewService.viewState.visibleHeight is falsy', () => {
    expect(isPrinting(layout, viewService)).toEqual(false);
  });
});
