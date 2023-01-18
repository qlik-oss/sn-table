import { stardust } from '@nebula.js/stardust';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import {
  Column,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  PageInfo,
  TableLayout,
} from '../../../../types';
import { GeneratedStyling } from '../../../types';

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

export interface WrapperProps {
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
  rect: stardust.Rect;
  theme: ExtendedTheme;
  direction?: 'ltr' | 'rtl';
  keyboard: stardust.Keyboard;
  translator: ExtendedTranslator;
  selectionsAPI: ExtendedSelectionAPI;
  constraints: stardust.Constraints;
}

export interface TableProps {
  layout: TableLayout;
  rect: stardust.Rect;
  pageInfo: PageInfo;
  paginationNeeded: boolean;
  model: EngineAPI.IGenericObject;
  theme: ExtendedTheme;
  selectionsAPI: ExtendedSelectionAPI;
  constraints: stardust.Constraints;
}

export interface HeaderProps {
  layout: TableLayout;
  rect: Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  columnWidth: number[];
  headerStyle: GeneratedStyling;
  rowHeight: number;
}

export interface TotalsProps {
  layout: TableLayout;
  rect: Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  columnWidth: number[];
  theme: ExtendedTheme;
  totals: Totals;
  rowHeight: number;
}

export interface BodyProps {
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
  rect: Rect;
  pageInfo: PageInfo;
  columns: Column[];
  columnWidth: number[];
  forwardRef: React.RefObject<VariableSizeGrid<any>>;
  innerForwardRef: React.RefObject<HTMLDivElement>;
  bodyStyle: BodyStyle;
  selectionsAPI: ExtendedSelectionAPI;
  rowHeight: number;
  headerAndTotalsHeight: number;
}
