import { stardust } from '@nebula.js/stardust';

interface TextAlign {
  auto: boolean;
  align: 'left' | 'center' | 'right';
}

// properties
interface InlineDimensionDef extends EngineAPI.INxInlineDimensionDef {
  textAlign: TextAlign;
}
interface InlineMeasureDef extends EngineAPI.INxInlineMeasureDef {
  textAlign: TextAlign;
}
interface AttributeExpressionProperties extends EngineAPI.INxAttrExprDef {
  id: 'cellForegroundColor' | 'cellBackgroundColor';
}
interface DimensionProperties extends Omit<EngineAPI.INxDimension, 'qDef' | 'qAttributeExpressions'> {
  qDef: InlineDimensionDef;
  qAttributeExpressions: AttributeExpressionProperties[];
}
interface MeasureProperties extends Omit<EngineAPI.INxMeasure, 'qDef' | 'qAttributeExpressions'> {
  qDef: InlineMeasureDef;
  qAttributeExpressions: AttributeExpressionProperties[];
}
export interface QHyperCubeDef extends Omit<EngineAPI.IHyperCubeDef, 'qDimensions' | 'qMeasures'> {
  qDimensions: DimensionProperties[];
  qMeasures: MeasureProperties;
  qColumnOrder: number[];
  columnWidths: number[];
}

// Layout
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
  qDimensionInfo: ExtendedNxDimensionInfo[];
  qMeasureInfo: ExtendedNxMeasureInfo[];
}

export interface PaletteColor {
  index: number;
  color: string | null;
}

export interface HeaderStyling {
  fontColor?: PaletteColor;
  fontSize?: number;
}

export interface ContentStyling extends HeaderStyling {
  hoverColor?: PaletteColor;
  hoverEffect?: boolean;
  hoverFontColor?: PaletteColor;
  padding?: string; // not available as option in the styling panel
}
export interface Component {
  key: string;
  content?: ContentStyling;
  header?: HeaderStyling;
}
export interface TableLayout extends Omit<EngineAPI.IGenericHyperCubeLayout, 'qHyperCube'> {
  qHyperCube: HyperCube;
  totals: {
    show: boolean;
    position: 'top' | 'bottom' | 'noTotals';
    label: string;
  };
  components?: Component[];
}

export interface Cell {
  qText?: string;
  qAttrExps: EngineAPI.INxAttributeExpressionValues;
  qElemNumber: number;
  rowIdx: number;
  colIdx: number;
  pageRowIdx: number;
  pageColIdx: number;
  isSelectable: boolean;
  isLastRow: boolean;
}

export interface Row {
  // for the row key, string is needed
  [key: string]: Cell | string;
}

export interface Column {
  id: string;
  isDim: boolean;
  isLocked: boolean;
  dataColIdx: number;
  width: number;
  label: string;
  align: 'left' | 'center' | 'right';
  stylingIDs: string[];
  sortDirection: string;
  totalInfo?: string;
}

export type TotalsPosition = 'top' | 'bottom' | 'noTotals';

export type TableData = {
  totalColumnCount: number;
  totalRowCount: number;
  totalPages: number;
  paginationNeeded: boolean;
  rows: Row[];
  columns: Column[];
  totalsPosition: TotalsPosition;
};

export interface PageInfo {
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
}

export type SetPageInfo = stardust.SetStateFn<PageInfo>;

export interface BodyColors {
  borderColor: string;
}

export interface PaginationColors {
  borderColor: string;
  color: string;
  iconColor: string;
  disabledIconColor: string;
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

export interface ExtendedSelectionAPI extends stardust.ObjectSelections {
  on(eventType: string, callback: () => void): void;
  removeListener(eventType: string, callback: () => void): void;
}

export interface ExtendedTranslator extends stardust.Translator {
  language(): string;
}

export interface ExtendedTheme extends stardust.Theme {
  name(): string;
  table: TableThemeColors;
}

export interface UseOptions {
  direction?: 'ltr' | 'rtl';
  footerContainer?: HTMLElement;
}

export interface AnnounceArgs {
  keys: Array<string | Array<string>>;
  shouldBeAtomic?: boolean;
  politeness?: 'polite' | 'assertive' | 'off';
}

export type Announce = (arg0: AnnounceArgs) => void;

export type ChangeSortOrder = (layout: TableLayout, column: Column) => Promise<void>;

export interface Galaxy {
  translator: ExtendedTranslator;
  carbon: boolean;
  flags: stardust.Flags;
}

export interface RenderWithCarbonArguments {
  env: Galaxy;
  rootElement: HTMLElement;
  model?: EngineAPI.IGenericObject;
  theme: ExtendedTheme;
  selectionsAPI: ExtendedSelectionAPI;
  app?: EngineAPI.IApp;
  rect: stardust.Rect;
  layout: TableLayout;
  changeSortOrder?: ChangeSortOrder;
}
