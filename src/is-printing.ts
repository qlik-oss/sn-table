import { TableLayout, ViewService } from './types';

const isPrinting = (layout: TableLayout, viewService: ViewService) =>
  !!(layout.snapshotData || viewService.viewState?.visibleHeight);

export default isPrinting;
