import React from 'react';
import { stardust } from '@nebula.js/stardust';

export interface TableCell {
  qText?: string;
  qAttrExps: EngineAPI.INxAttributeExpressionValues;
  qElemNumber: number;
  rowIdx: number;
  colIdx: number;
  isSelectable: boolean;
  rawRowIdx: number;
  rawColIdx: number;
  prevQElemNumber: number;
  nextQElemNumber: number;
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

export type Announce = (arg0: AnnounceArgs) => void;

export interface ActionPayload {
  cell: TableCell;
  announce: Announce;
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

export interface PageInfo {
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
}

export type SetPageInfo = stardust.SetStateFn<PageInfo>;

export interface Row {
  // for the row key, string is needed
  [key: string]: TableCell | string;
}

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
  totalInfo?: string;
}

export interface PaletteColor {
  index: number;
  color: string | null;
}

interface TextAlign {
  auto: boolean;
  align: string;
}

export interface ExtendedNxAttrExprInfo extends EngineAPI.INxAttrExprInfo {
  id: string;
}

export interface ExtendedNxDimensionInfo extends Omit<EngineAPI.INxDimensionInfo, 'qAttrExprInfo'> {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
}

export interface ExtendedNxMeasureInfo extends EngineAPI.INxMeasureInfo {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
}

export interface HyperCube extends Omit<EngineAPI.IHyperCube, 'qDimensionInfo' | 'qMeasureInfo'> {
  qColumnOrder: number[];
  textAlign: string;
  qDimensionInfo: ExtendedNxDimensionInfo[];
  qMeasureInfo: ExtendedNxMeasureInfo[];
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

export interface TableLayout extends Omit<EngineAPI.IGenericHyperCubeLayout, 'qHyperCube'> {
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

export type TotalsPosition = 'top' | 'bottom' | 'noTotals';

export type TableData = {
  totalColumnCount: number;
  totalRowCount: number;
  totalPages: number;
  paginationNeeded: boolean;
  rows: Row[] | undefined;
  columns: Column[];
  totalsPosition: TotalsPosition;
};

export interface RenderProps {
  direction?: 'ltr' | 'rtl';
  selectionsAPI: stardust.ObjectSelections;
  rootElement?: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  rect: stardust.Rect;
  tableData?: TableData;
  pageInfo?: PageInfo;
  setPageInfo?: SetPageInfo;
  constraints?: stardust.Constraints;
  translator?: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard?: stardust.Keyboard;
  footerContainer?: HTMLElement;
  announce?: Announce;
  model?: EngineAPI.IGenericObject;
  manageData?(
    model: EngineAPI.IGenericObject | undefined,
    layout: TableLayout,
    pageInfo: PageInfo,
    setPageInfo: SetPageInfo
  ): Promise<TableData | null>;
  app?: EngineAPI.IApp;
}

export interface RootProps {
  direction: 'ltr' | 'rtl';
  selectionsAPI: stardust.ObjectSelections;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  rect: stardust.Rect;
  tableData: TableData;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  footerContainer: HTMLElement;
  announce: Announce;
}
