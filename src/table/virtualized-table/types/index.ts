import { stardust } from '@nebula.js/stardust';
import { VariableSizeList } from 'react-window';
import {
  ApplyColumnWidths,
  ChangeSortOrder,
  Column,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  PageInfo,
  Row,
  TableData,
  TableLayout,
  ViewService,
} from '../../../types';
import { GeneratedStyling } from '../../types';

export interface Totals {
  atBottom: boolean;
  atTop: boolean;
}

export interface Rect {
  width: number;
  height: number;
}
export interface BodyStyle extends GeneratedStyling {
  background: string;
}

export interface VirtualTableRenderProps {
  app: EngineAPI.IApp | undefined;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  layout: TableLayout;
  model: EngineAPI.IGenericObject;
  translator: ExtendedTranslator;
  constraints: stardust.Constraints;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  rect: stardust.Rect;
  rootElement: HTMLElement;
  embed: stardust.Embed;
  changeSortOrder: ChangeSortOrder;
  tableData: TableData;
  applyColumnWidths: ApplyColumnWidths;
  setPage: stardust.SetStateFn<number>;
  pageInfo: PageInfo;
  initialDataPages: EngineAPI.INxDataPage[];
  viewService: ViewService;
}

export interface TableProps {
  pageInfo: PageInfo;
}

export interface HeaderProps {
  rect: Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  headerStyle: GeneratedStyling;
  rowHeight: number;
  columResizeHandler: () => void;
}

export interface TotalsProps {
  rect: Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  totals: Totals;
  rowHeight: number;
}

export interface BodyProps {
  rect: Rect;
  pageInfo: PageInfo;
  columns: Column[];
  innerForwardRef: React.RefObject<HTMLDivElement>;
  bodyStyle: BodyStyle;
  rowHeight: number;
  headerAndTotalsHeight: number;
  syncHeight: (innerHeight: number, forceSync?: boolean) => void;
  viewService: ViewService;
}

export interface BodyRef {
  interpolatedScrollTo: (scrollTopRatio: number, scrollLeft: number) => void;
  resizeCells: () => void;
}

export interface RowMeta {
  lastScrollToRatio: number;
  resetAfterRowIndex: number;
  heights: number[];
  totalHeight: number;
  count: number;
  measuredCells: Map<string, [string, number, number, boolean]>;
}

export interface ItemData {
  rowsInPage: Row[];
  columns: Column[];
  bodyStyle: BodyStyle;
  isHoverEnabled: boolean;
  maxLineCount: number;
}

export type SetCellSize = (
  text: string,
  rowIdx: number,
  colIdx: number,
  isNumeric?: boolean,
  batchStateUpdate?: boolean
) => void;

export interface GridState {
  overscanColumnStartIndex: number;
  overscanColumnStopIndex: number;
  overscanRowStartIndex: number;
  overscanRowStopIndex: number;
}
