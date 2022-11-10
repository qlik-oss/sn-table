import { stardust } from '@nebula.js/stardust';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { Column, ExtendedTheme, ExtendedTranslator, PageInfo, TableLayout } from '../../../../types';
import { GeneratedStyling } from '../../../types';

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
  theme: ExtendedTheme;
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
  bodyStyle: GeneratedStyling;
}
