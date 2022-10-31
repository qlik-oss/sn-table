import { stardust } from '@nebula.js/stardust';
import { VariableSizeGrid } from 'react-window';
import { Column, ExtendedTheme, ExtendedTranslator, TableLayout } from '../../../../types';

export interface VirtualizedTableRenderProps {
  model?: EngineAPI.IGenericObject;
  layout: TableLayout;
  rect: stardust.Rect;
  theme: ExtendedTheme;
  direction?: 'ltr' | 'rtl';
  keyboard: stardust.Keyboard;
  translator: ExtendedTranslator;
}

export interface VirtualizedTableProps extends VirtualizedTableRenderProps {
  forwardRef: React.RefObject<VariableSizeGrid<any>>;
  innerForwardRef: React.RefObject<HTMLDivElement>;
  columns: Column[];
  columnWidth: number[];
  theme: ExtendedTheme;
}
