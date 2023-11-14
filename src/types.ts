import { Direction } from "@mui/material";
import { stardust } from "@nebula.js/stardust";
import { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";

export type Align = "left" | "center" | "right";

export interface ViewService {
  rowPartialHeight?: number;
  scrollLeft?: number;
  scrollTopRatio?: number;
  qTop: number;
  qHeight: number;
  visibleLeft?: number;
  visibleWidth?: number;
  visibleTop?: number;
  visibleHeight?: number;
  rowsPerPage?: number;
  page?: number;
  viewState?: ViewState;
  estimatedRowHeight: number;
}

export interface Size {
  width: number;
  height: number;
}
export interface SnapshotData {
  content?: {
    rowPartialHeight?: number;
    scrollLeft?: number;
    scrollTopRatio?: number;
    visibleLeft?: number;
    visibleWidth?: number;
    visibleTop?: number;
    visibleHeight?: number;
    rowsPerPage?: number;
    page?: number;
    size: Size;
    estimatedRowHeight: number;
  };
}

export interface TextAlign {
  auto: boolean;
  align: Align;
}

// properties
interface InlineDimensionDef extends EngineAPI.INxInlineDimensionDef {
  textAlign: TextAlign;
  columnWidth: ColumnWidth;
}
interface InlineMeasureDef extends EngineAPI.INxInlineMeasureDef {
  textAlign: TextAlign;
  columnWidth: ColumnWidth;
}
interface AttributeExpressionProperties extends EngineAPI.INxAttrExprDef {
  id: "cellForegroundColor" | "cellBackgroundColor";
}
export interface DimensionProperties extends Omit<EngineAPI.INxDimension, "qDef" | "qAttributeExpressions"> {
  qDef: InlineDimensionDef;
  qAttributeExpressions: AttributeExpressionProperties[];
}
export interface MeasureProperties extends Omit<EngineAPI.INxMeasure, "qDef" | "qAttributeExpressions"> {
  qDef: InlineMeasureDef;
  qAttributeExpressions: AttributeExpressionProperties[];
}
export interface QHyperCubeDef extends Omit<EngineAPI.IHyperCubeDef, "qDimensions" | "qMeasures"> {
  qDimensions: DimensionProperties[];
  qMeasures: MeasureProperties[];
  qColumnOrder: number[];
}

// Layout
export interface ExtendedNxAttrExprInfo extends EngineAPI.INxAttrExprInfo {
  id: string;
}

export interface ExtendedNxDimensionInfo extends Omit<EngineAPI.INxDimensionInfo, "qAttrExprInfo"> {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
  qLibraryId: string;
  columnWidth: ColumnWidth;
}

export interface ExtendedNxMeasureInfo extends EngineAPI.INxMeasureInfo {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
  qLibraryId: string;
  columnWidth: ColumnWidth;
}

export interface HyperCube extends Omit<EngineAPI.IHyperCube, "qDimensionInfo" | "qMeasureInfo"> {
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

export interface TableLayout extends Omit<EngineAPI.IGenericHyperCubeLayout, "qHyperCube"> {
  qHyperCube: HyperCube;
  totals: {
    show: boolean;
    position: "top" | "bottom" | "noTotals";
    label: string;
  };
  usePagination?: boolean;
  components?: Component[];
  snapshotData?: SnapshotData;
}
export interface Point {
  x: number;
  y: number;
}
export interface SnapshotLayout extends EngineAPI.IGenericObjectLayout {
  qHyperCube?: HyperCube;
  snapshotData?: SnapshotData;
}

export interface Cell {
  qText?: string;
  qNum?: number | string;
  align: Align;
  qAttrExps?: EngineAPI.INxAttributeExpressionValues;
  qElemNumber: number;
  rowIdx: number;
  colIdx: number;
  pageRowIdx: number;
  pageColIdx: number;
  selectionColIdx: number;
  isSelectable: boolean;
  isLastRow: boolean;
  isLastColumn?: boolean;
  isNumeric?: boolean;
}

export interface Row {
  // for the row key, string is needed
  [key: string]: Cell | string;
}

export type SortDirection = "A" | "D";

export interface Column {
  id: string;
  isDim: boolean;
  qLibraryId?: string;
  fieldId: string;
  isLocked: boolean;
  colIdx: number;
  pageColIdx: number;
  selectionColIdx: number;
  isActivelySorted: boolean;
  label: string;
  headTextAlign: Align;
  totalsTextAlign: Align;
  bodyTextAlign: "auto" | Align;
  stylingIDs: string[];
  sortDirection: SortDirection;
  qReverseSort: boolean;
  totalInfo: string;
  qApprMaxGlyphCount: number;
  columnWidth: ColumnWidth;
}

export type TotalsPosition = { atTop: boolean; atBottom: boolean };

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

export interface ExtendedSelectionAPI extends stardust.ObjectSelections {
  on(eventType: string, callback: () => void): void;
  removeListener(eventType: string, callback: () => void): void;
}

export interface ViewState {
  rowPartialHeight: number;
  scrollLeft: number;
  scrollTopRatio?: number;
  visibleTop: number;
  visibleHeight: number;
  visibleLeft?: number;
  visibleWidth?: number;
  rowsPerPage?: number;
  page?: number;
  isMultiPage?: boolean;
  maxLineCount?: number;
  usePagination?: boolean;
  skipTotals?: boolean;
  skipHeader?: boolean;
}

export interface UseOptions {
  viewState: ViewState;
  direction: Direction | undefined;
  footerContainer: HTMLElement | undefined;
  freeResize?: boolean;
}

export interface AnnounceArgs {
  keys: Array<string | Array<string>>;
  shouldBeAtomic?: boolean;
  politeness?: "polite" | "assertive" | "off";
}

export type Announce = (arg0: AnnounceArgs) => void;

export type ChangeSortOrder = (column: Column, sortOrder?: SortDirection) => Promise<void>;

export type ApplyColumnWidths = (newColumnSize: ColumnWidth, column: Column) => void;

export interface Galaxy {
  translator: stardust.Translator;
  carbon: boolean;
  flags: stardust.Flags;
}

type ExtendedGenericHyperCubeProperties = EngineAPI.IGenericHyperCubeProperties & {
  qHyperCubeDef: {
    columnWidths?: number[];
  };
};

export interface ExportFormat {
  data: unknown[];
  properties: ExtendedGenericHyperCubeProperties;
}

export interface PropTree {
  qChildren: unknown[];
  qProperty: { qHyperCubeDef: QHyperCubeDef };
}
