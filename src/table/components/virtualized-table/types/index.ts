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

export interface TableContainerProps {
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
  rect: stardust.Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  columnWidth: number[];
  headerStyle: GeneratedStyling;
}

export interface TotalsProps {
  layout: TableLayout;
  rect: stardust.Rect;
  pageInfo: PageInfo;
  paginationNeeded: boolean;
  forwardRef: React.RefObject<VariableSizeList<any>>;
  columns: Column[];
  columnWidth: number[];
  theme: ExtendedTheme;
  totals: Totals;
}

export interface BodyProps {
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
  rect: stardust.Rect;
  pageInfo: PageInfo;
  paginationNeeded: boolean;
  columns: Column[];
  columnWidth: number[];
  forwardRef: React.RefObject<VariableSizeGrid<any>>;
  innerForwardRef: React.RefObject<HTMLDivElement>;
  bodyStyle: BodyStyle;
  selectionsAPI: ExtendedSelectionAPI;
  totals: Totals;
}
