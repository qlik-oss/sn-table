import { stardust } from '@nebula.js/stardust';
import { VariableSizeList } from 'react-window';
import {
  ChangeSortOrder,
  Column,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  PageInfo,
  Row,
  TableData,
  TableLayout,
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
  changeSortOrder: ChangeSortOrder;
  tableData: TableData;
}

export interface WrapperProps {
  rect: stardust.Rect;
}

export interface TableProps {
  rect: stardust.Rect;
  pageInfo: PageInfo;
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
  innerForwardRef: React.RefObject<HTMLDivElement>;
  bodyStyle: BodyStyle;
  rowHeight: number;
  headerAndTotalsHeight: number;
  syncHeight: (innerHeight: number, forceSync?: boolean) => void;
}

export interface BodyRef {
  interpolatedScrollTo: (scrollTopRatio: number, scrollLeft: number) => void;
}

export interface RowMeta {
  lastScrollToRatio: number;
  resetAfterRowIndex: number;
  heights: number[];
  totalHeight: number;
  count: number;
}

export interface ItemData {
  rowsInPage: Row[];
  columns: Column[];
  bodyStyle: BodyStyle;
  isHoverEnabled: boolean;
  maxLineCount: number;
}

export type SetCellSize = (text: string, rowIdx: number, colIdx: number) => void;
