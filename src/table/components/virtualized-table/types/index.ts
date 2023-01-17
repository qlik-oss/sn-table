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
import { Totals } from '../hooks/use-totals';

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
}

export interface TotalsProps {
  rect: Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  columnWidth: number[];
  totals: Totals;
}

export interface BodyProps {
  rect: Rect;
  pageInfo: PageInfo;
  columns: Column[];
  columnWidth: number[];
  forwardRef: React.RefObject<VariableSizeGrid<any>>;
  innerForwardRef: React.RefObject<HTMLDivElement>;
  bodyStyle: BodyStyle;
  totals: Totals;
}
