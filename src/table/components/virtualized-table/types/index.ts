import { stardust } from '@nebula.js/stardust';
import { VariableSizeGrid } from 'react-window';
import { Column, ExtendedTheme, ExtendedTranslator, PageInfo, TableLayout } from '../../../../types';

export interface WrapperProps {
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
  rect: stardust.Rect;
  theme: ExtendedTheme;
  direction?: 'ltr' | 'rtl';
  keyboard: stardust.Keyboard;
  translator: ExtendedTranslator;
}

export interface TableContainerProps {
  layout: TableLayout;
  rect: stardust.Rect;
  pageInfo: PageInfo;
  paginationNeeded: boolean;
  model: EngineAPI.IGenericObject;
}

export interface HeaderProps {
  layout: TableLayout;
  rect: stardust.Rect;
  pageInfo: PageInfo;
  forwardRef: React.RefObject<VariableSizeGrid<any>>;
  columns: Column[];
  columnWidth: number[];
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
}
