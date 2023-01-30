import { stardust } from '@nebula.js/stardust';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { Column, ExtendedSelectionAPI, ExtendedTheme, ExtendedTranslator, PageInfo, TableLayout } from '../../../types';
import { GeneratedStyling } from '../../types';

export interface Totals {
  atBottom: boolean;
  atTop: boolean;
}

export type TotalsPosition = 'bottom' | 'noTotals' | 'top';

export interface Rect {
  width: number;
  height: number;
}
export interface BodyStyle extends GeneratedStyling {
  background: string;
}

export interface VirtualTableRenderProps {
  selectionsAPI: ExtendedSelectionAPI;
  layout: TableLayout;
  model: EngineAPI.IGenericObject;
  translator: ExtendedTranslator;
  constraints: stardust.Constraints;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  rect: stardust.Rect;
  rootElement: HTMLElement;
  embed: stardust.Embed;
}

export interface WrapperProps {
  rect: stardust.Rect;
}

export interface TableProps {
  rect: stardust.Rect;
  pageInfo: PageInfo;
  paginationNeeded: boolean;
}

export interface HeaderProps {
  rect: Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  columnWidth: number[];
  headerStyle: GeneratedStyling;
  rowHeight: number;
}

export interface TotalsProps {
  rect: Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  columnWidth: number[];
  totals: Totals;
  rowHeight: number;
}

export interface BodyProps {
  rect: Rect;
  pageInfo: PageInfo;
  columns: Column[];
  columnWidth: number[];
  forwardRef: React.RefObject<VariableSizeGrid<any>>;
  innerForwardRef: React.RefObject<HTMLDivElement>;
  bodyStyle: BodyStyle;
  rowHeight: number;
  headerAndTotalsHeight: number;
  onRowCountChange: (deferredRowCount: number) => void;
}

export interface RenderedGrid {
  startRowIndex: number;
  stopRowIndex: number;
  startColumnIndex: number;
  stopColumnIndex: number;
}

export interface BodyRef {
  scrollToIndex: (qTop: number) => Promise<void>;
  scrollTo: (scrollTop: number, count: number) => Promise<void>;
}
