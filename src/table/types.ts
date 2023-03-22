import { Direction, TableCellProps } from '@mui/material';
import { stardust } from '@nebula.js/stardust';
import {
  Announce,
  Cell,
  ChangeSortOrder,
  Column,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  PageInfo,
  SetPageInfo,
  TableData,
  TableLayout,
  TotalsPosition,
  Row,
  ApplyColumnWidths,
} from '../types';
import { FocusTypes, SelectionActions } from './constants';

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
export interface SelectMultiEndAction extends Action<SelectionActions.SELECT_MULTI_END> {}
export interface ResetAction extends Action<SelectionActions.RESET> {}
export interface ClearAction extends Action<SelectionActions.CLEAR> {}
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
  api: ExtendedSelectionAPI;
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
    app: EngineAPI.IApp | undefined;
    selectionsAPI: ExtendedSelectionAPI;
    layout: TableLayout;
    model?: EngineAPI.IGenericObject;
    translator: ExtendedTranslator;
    constraints: stardust.Constraints;
    theme: ExtendedTheme;
    keyboard: stardust.Keyboard;
    rootElement: HTMLElement;
    embed: stardust.Embed;
    changeSortOrder: ChangeSortOrder;
    applyColumnWidths?: ApplyColumnWidths;
    styling: TableStyling;
    rect: stardust.Rect;
  };
  tableData: TableData;
  setYScrollbarWidth: (width: number) => void;
  pageInfo?: PageInfo;
  setPage?: stardust.SetStateFn<number>;
  initialDataPages?: EngineAPI.INxDataPage[];
  showRightBorder: boolean;
}

export interface FooterStyle {
  borderColor: string;
  color: string;
  disabledColor: string;
  iconColor?: string;
  background?: string;
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
  isSelectionMode: boolean;
}

export interface HandleHeadKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  isInteractionEnabled: boolean;
  areBasicFeaturesEnabled: boolean;
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
  isSelectionMode: boolean;
  areBasicFeaturesEnabled: boolean;
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
  selectionsAPI: ExtendedSelectionAPI;
  areBasicFeaturesEnabled: boolean;
}

export interface CellFocusProps {
  focusType: FocusTypes;
  cell: HTMLTableCellElement | undefined;
}

export interface HandleResetFocusProps {
  focusedCellCoord: [number, number];
  rootElement: HTMLElement;
  shouldRefocus: React.MutableRefObject<boolean>;
  isSelectionMode: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  keyboard: stardust.Keyboard;
  announce: Announce;
  totalsPosition: TotalsPosition;
}

export interface ContextProviderProps {
  children: JSX.Element;
  app?: EngineAPI.IApp;
  tableData?: TableData;
  selectionsAPI: ExtendedSelectionAPI;
  cellCoordMock?: [number, number];
  selectionDispatchMock?: jest.Mock<any, any>;
  layout: TableLayout;
  model?: EngineAPI.IGenericObject;
  translator: ExtendedTranslator;
  constraints: stardust.Constraints;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  rootElement: HTMLElement;
  embed: stardust.Embed;
  changeSortOrder: ChangeSortOrder;
  applyColumnWidths?: ApplyColumnWidths;
  rect: stardust.Rect;
  pageInfo?: PageInfo;
  setPage?: stardust.SetStateFn<number>;
  initialDataPages?: EngineAPI.INxDataPage[];
}

export interface RenderProps {
  direction?: Direction;
  selectionsAPI: ExtendedSelectionAPI;
  rootElement?: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  rect: stardust.Rect;
  tableData?: TableData;
  pageInfo?: PageInfo;
  setPageInfo?: SetPageInfo;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
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
  areBasicFeaturesEnabled?: boolean;
  embed?: stardust.Embed;
  applyColumnWidths?: ApplyColumnWidths;
}

export interface TableWrapperProps {
  direction?: Direction;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  footerContainer?: HTMLElement;
  announce: Announce;
  areBasicFeaturesEnabled: boolean;
}

export interface TableHeadWrapperProps {
  areBasicFeaturesEnabled: boolean;
}

export interface HeadCellContentProps {
  children: JSX.Element;
  column: Column;
  isActive: boolean;
  areBasicFeaturesEnabled: boolean;
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
  areBasicFeaturesEnabled: boolean;
}

export interface PaginationContentProps {
  direction?: 'ltr' | 'rtl';
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  footerContainer?: HTMLElement;
  announce: Announce;
  isSelectionMode: boolean;
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
  areBasicFeaturesEnabled: boolean;
}

export type CellHOC = (props: CellHOCProps) => JSX.Element;

export type EstimateWidth = (column: Column) => number;
