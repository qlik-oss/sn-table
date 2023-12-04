import { Direction, TableCellProps } from "@mui/material";
import { stardust } from "@nebula.js/stardust";
import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import {
  Announce,
  ApplyColumnWidths,
  Cell,
  ChangeSortOrder,
  Column,
  ExtendedSelectionAPI,
  PageInfo,
  Row,
  SetPageInfo,
  TableData,
  TableLayout,
  TotalsPosition,
  ViewService,
} from "../types";
import { FocusTypes, SelectionActions } from "./constants";

interface Action<T = any> {
  type: T;
}

export interface SelectPayload {
  cell: Cell;
  announce: Announce;
  evt: React.KeyboardEvent | React.MouseEvent;
}

export interface SelectAction extends Action<SelectionActions.SELECT> {
  payload: SelectPayload;
}
export interface SelectMouseDownAction extends Action<SelectionActions.SELECT_MOUSE_DOWN> {
  payload: { cell: Cell; mouseupOutsideCallback(): void };
}
export interface SelectMouseUpAction extends Action<SelectionActions.SELECT_MOUSE_UP> {
  payload: SelectPayload;
}
export interface SelectMultiAddAction extends Action<SelectionActions.SELECT_MULTI_ADD> {
  payload: SelectPayload;
}
export type SelectMultiEndAction = Action<SelectionActions.SELECT_MULTI_END>;
export type ResetAction = Action<SelectionActions.RESET>;
export type ClearAction = Action<SelectionActions.CLEAR>;
export interface UpdatePageRowsAction extends Action<SelectionActions.UPDATE_PAGE_ROWS> {
  payload: { pageRows: Row[] };
}

export type SelectionActionTypes =
  | SelectAction
  | SelectMouseDownAction
  | SelectMouseUpAction
  | SelectMultiAddAction
  | SelectMultiEndAction
  | ResetAction
  | ClearAction
  | UpdatePageRowsAction;

export type SelectionDispatch = React.Dispatch<SelectionActionTypes>;

export interface SelectionState {
  pageRows: Row[];
  rows: Record<string, number>;
  colIdx: number;
  api: ExtendedSelectionAPI | undefined;
  isSelectMultiValues: boolean;
  firstCell?: Cell;
  mouseupOutsideCallback?(): void;
}
export interface GeneratedStyling {
  borderBottomColor: string;
  borderTopColor: string;
  borderLeftColor: string;
  borderRightColor: string;
  lastRowBottomBorder?: string;
  padding?: string;
  fontFamily?: string;
  color?: string;
  fontSize?: string; // following the theme format so this should always be a string
  background?: string;
  hoverBackground?: string;
  activeBackground?: string;
  hoverColors?: {
    background: string;
    color: string;
  };
}

export interface TableStyling {
  head: GeneratedStyling;
  body: GeneratedStyling;
  totals: GeneratedStyling;
}

export interface ExtendedApp extends EngineAPI.IApp {
  id?: string;
}

export interface ContextValue {
  headRowHeight: number;
  setHeadRowHeight: React.Dispatch<React.SetStateAction<number>>;
  focusedCellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectionState: SelectionState;
  selectionDispatch: SelectionDispatch;
  hoverIndex: number;
  setHoverIndex: React.Dispatch<React.SetStateAction<number>>;
  columnWidths: number[];
  setColumnWidths: React.Dispatch<React.SetStateAction<number[]>>;
  baseProps: {
    app: ExtendedApp | undefined;
    selectionsAPI: ExtendedSelectionAPI | undefined;
    layout: TableLayout;
    model: EngineAPI.IGenericObject | undefined;
    translator: stardust.Translator;
    interactions: stardust.Interactions;
    theme: ExtendedTheme;
    keyboard: stardust.Keyboard;
    rootElement: HTMLElement;
    embed: stardust.Embed;
    changeSortOrder: ChangeSortOrder;
    applyColumnWidths: ApplyColumnWidths;
    styling: TableStyling;
    rect: stardust.Rect;
    viewService: ViewService;
  };
  tableData: TableData;
  setYScrollbarWidth: (width: number) => void;
  pageInfo?: PageInfo;
  setPage?: stardust.SetStateFn<number>;
  initialDataPages?: EngineAPI.INxDataPage[];
  showRightBorder: boolean;
  featureFlags: FeatureFlags;
}

export type FeatureFlags = Record<keyof typeof AvaliableFlags, boolean>;

export enum AvaliableFlags {
  isNewHeadCellMenuEnabled,
}

export interface CellStyle {
  background: string | undefined; // This is always set but could be undefined in the theme
  color: string;
  selectedCellClass?: string;
}

export interface HandleWrapperKeyDownProps {
  evt: React.KeyboardEvent;
  totalRowCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage(pageIdx: number): void;
  setShouldRefocus(): void;
  keyboard: stardust.Keyboard;
  isSelectionMode: boolean | undefined;
}

export interface HandleHeadKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  isInteractionEnabled: boolean;
  handleOpenMenu?: () => void;
  isNewHeadCellMenuEnabled: boolean;
}

export interface HandleHeadMouseDownProps {
  evt: React.MouseEvent;
  rootElement: HTMLElement;
  cellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  keyboard: stardust.Keyboard;
  isInteractionEnabled: boolean;
}

export interface BodyArrowHelperProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cell: Cell;
  selectionDispatch: SelectionDispatch;
  isSelectionsEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  announce: Announce;
  totalsPosition: TotalsPosition;
  isSelectionMode: boolean | undefined;
  isNewHeadCellMenuEnabled: boolean;
}

export interface HandleBodyKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cell: Cell;
  selectionDispatch: SelectionDispatch;
  isSelectionsEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  announce: Announce;
  keyboard: stardust.Keyboard;
  totalsPosition: TotalsPosition;
  paginationNeeded: boolean;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  isNewHeadCellMenuEnabled: boolean;
}

export interface CellFocusProps {
  focusType: FocusTypes;
  cell: HTMLTableCellElement | undefined;
}

export interface MoveFocusWithArrowProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  focusType: FocusTypes;
  isNewHeadCellMenuEnabled: boolean;
  updateFocusInjected?: ({ focusType, cell }: CellFocusProps) => void;
  allowedRows?: {
    top: number;
    bottom: number;
  };
}

export interface HandleResetFocusProps {
  focusedCellCoord: [number, number];
  rootElement: HTMLElement;
  shouldRefocus: React.MutableRefObject<boolean>;
  isSelectionMode: boolean | undefined;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  keyboard: stardust.Keyboard;
  announce: Announce;
  totalsPosition: TotalsPosition;
}

export interface ContextProviderProps {
  children: JSX.Element;
  app: EngineAPI.IApp | undefined;
  tableData: TableData;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  cellCoordMock?: [number, number];
  layout: TableLayout;
  model: EngineAPI.IGenericObject;
  translator: stardust.Translator;
  interactions: stardust.Interactions;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  rootElement: HTMLElement;
  embed: stardust.Embed;
  changeSortOrder: ChangeSortOrder;
  applyColumnWidths: ApplyColumnWidths;
  rect: stardust.Rect;
  pageInfo?: PageInfo;
  setPage?: stardust.SetStateFn<number>;
  initialDataPages?: EngineAPI.INxDataPage[];
  viewService: ViewService;
  isNewHeadCellMenuEnabled: boolean;
}

export interface RenderProps {
  direction: Direction | undefined;
  selectionsAPI: ExtendedSelectionAPI | undefined;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  rect: stardust.Rect;
  tableData: TableData;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  interactions: stardust.Interactions;
  translator: stardust.Translator;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  footerContainer: HTMLElement | undefined;
  announce: Announce;
  model: EngineAPI.IGenericObject;
  app?: EngineAPI.IApp;
  embed: stardust.Embed;
  applyColumnWidths: ApplyColumnWidths;
  viewService: ViewService;
  isNewHeadCellMenuEnabled: boolean;
}

export interface TableWrapperProps {
  direction: Direction | undefined;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  footerContainer: HTMLElement | undefined;
  announce: Announce;
}

export interface HeadCellContentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
  column: Column;
  isInteractionEnabled: boolean;
}

export interface HeadCellMenuProps {
  column: Column;
  tabIndex: number;
}

export type MenuItemGroup = HeadCellMenuItem[];

export interface HeadCellMenuItem {
  autoFocus?: boolean;
  id: number;
  icon: React.ReactElement;
  itemTitle: string;
  enabled: boolean;
  onClick?: (evt: React.MouseEvent<HTMLLIElement>) => void;
  subMenus?: MenuItemGroup[];
}

export interface TableBodyWrapperProps {
  announce: Announce;
  setShouldRefocus(): void;
  tableWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}

export interface PaginationContentProps {
  direction?: "ltr" | "rtl";
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  footerContainer?: HTMLElement;
  announce: Announce;
  isSelectionMode: boolean | undefined;
  handleChangePage(pageIdx: number): void;
}

export interface AdjusterProps {
  column: Column;
  isLastColumn: boolean;
  onColumnResize?: () => void;
}

export interface FooterWrapperProps {
  children: JSX.Element;
  footerContainer?: HTMLElement;
  withoutBorders?: boolean;
  paginationNeeded?: boolean;
}
export interface CellHOCProps extends TableCellProps {
  styling: CellStyle;
  cell: Cell;
  column: Column;
  announce: Announce;
}

export type CellHOC = (props: CellHOCProps) => JSX.Element;

export type EstimateWidth = (column: Column) => number;
