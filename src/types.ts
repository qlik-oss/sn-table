import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { TSelectionActions } from './table/utils/selections-utils';

export interface TableCell {
  qText?: string;
  qAttrExps: EngineAPI.INxAttributeExpressionValues;
  qElemNumber: number;
  rowIdx: number;
  colIdx: number;
  isSelectable: boolean;
  rawRowIdx: number;
  rawColIdx: number;
  prevQElemNumber: number | undefined;
  nextQElemNumber: number | undefined;
}

export interface ExtendedSelectionAPI extends stardust.ObjectSelections {
  on(eventType: string, callback: () => void): void;
  removeListener(eventType: string, callback: () => void): void;
}

export interface ExtendedTranslator extends stardust.Translator {
  language(): string;
}

export interface Galaxy {
  translator: ExtendedTranslator;
  carbon: boolean;
}

export interface UseOptions {
  direction: 'ltr' | 'rtl';
  footerContainer: HTMLElement;
}

export interface SelectionState {
  rows: Record<string, number>;
  colIdx: number;
  api: ExtendedSelectionAPI;
  isSelectMultiValues: boolean;
}

export interface AnnounceArgs {
  keys: Array<string | Array<string>>;
  shouldBeAtomic?: boolean;
  politeness?: 'polite' | 'assertive' | 'off';
}

export type AnnounceFn = (arg0: AnnounceArgs) => void;

export interface ActionPayload {
  cell: TableCell;
  announce: (arg0: AnnounceArgs) => void;
  evt: React.KeyboardEvent | React.MouseEvent;
}

export interface ContextValue {
  headRowHeight: number;
  setHeadRowHeight: React.Dispatch<React.SetStateAction<number>>;
  focusedCellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectionState: SelectionState;
  selectionDispatch: React.Dispatch<ActionPayload> | jest.Mock<any, any>;
}

export interface PaginationColors {
  borderColor: string;
  color: string;
  iconColor: string;
  disabledIconColor: string;
}

export interface BodyColors {
  borderColor: string;
}
export interface TableThemeColors {
  tableBackgroundColorFromTheme: string;
  backgroundColor?: string;
  isBackgroundTransparentColor: boolean;
  isBackgroundDarkColor: boolean;
  borderColor: string;
  body: BodyColors;
  pagination: PaginationColors;
}

export interface ExtendedTheme extends stardust.Theme {
  name(): string;
  table: TableThemeColors;
}

export interface HyperCube extends EngineAPI.IHyperCube {
  qColumnOrder: number[];
  textAlign: string;
}

export type TotalsPosition = 'top' | 'bottom' | 'noTotals';

export interface Column {
  id: string;
  isDim: boolean;
  isLocked: boolean;
  dataColIdx: number;
  width: number;
  label: string;
  align: string;
  stylingIDs: string[];
  sortDirection: string;
}

export interface PaletteColor {
  index: number;
  color: string | null;
}

export interface StylingLayout {
  fontColor?: PaletteColor;
  fontSize?: number;
  hoverColor?: PaletteColor;
  hoverEffect?: boolean;
  hoverFontColor?: PaletteColor;
  padding?: string; // not available as option in the styling panel
}

export interface GeneratedStyling {
  padding: string;
  borderStyle: string;
  borderColor: string;
  fontFamily?: string;
  color?: string;
  fontSize?: string; // following the theme format so this should always be a string
  cursor?: string;
  borderWidth?: string;
  backgroundColor?: string;
  sortLabelColor?: string;
  hoverBackgroundColor?: string;
  hoverFontColor?: string;
}

export interface CellStyle {
  backgroundColor: string | undefined; // This is always set but could be undefined in the theme
  color: string;
  background?: string;
  selectedCellClass?: string;
}

export interface Components {
  key: string;
  content?: StylingLayout;
  header?: StylingLayout;
}

export interface TableLayout extends EngineAPI.IGenericHyperCubeLayout {
  qHyperCube: HyperCube;
  totals: {
    show: boolean;
    position: 'top' | 'bottom' | 'noTotals';
    label: string;
  };
  components?: Components[];
}

export type ChangeSortOrder = (layout: TableLayout, column: Column) => Promise<void>;

export interface RenderWithCarbonArguments {
  env: Galaxy;
  rootElement: HTMLElement;
  model?: EngineAPI.IGenericObject;
  theme: ExtendedTheme;
  selectionsAPI: stardust.ObjectSelections;
  app?: EngineAPI.IApp;
  rect: stardust.Rect;
  layout: TableLayout;
  changeSortOrder?: ChangeSortOrder;
}

export interface HandleWrapperKeyDownProps {
  evt: React.KeyboardEvent;
  totalRowCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage(pageIdx: number): void;
  setShouldRefocus(): void;
  keyboard: stardust.Keyboard;
  isSelectionMode: boolean;
}

export interface handleHeadKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cellCoord: [number, number];
  column: Column;
  changeSortOrder: ChangeSortOrder;
  layout: TableLayout;
  isSortingEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
}

export interface handleBodyKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cell: TableCell;
  selectionDispatch: React.Dispatch<TSelectionActions>;
  isSelectionsEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  announce: AnnounceFn;
  keyboard: stardust.Keyboard;
  totalsPosition: TotalsPosition;
  paginationNeeded: boolean;
  selectionsAPI: ExtendedSelectionAPI;
}
