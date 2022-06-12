import { stardust } from '@nebula.js/stardust';
import { Root } from 'react-dom/client';
import { Theme } from '@mui/material/styles';

export interface Translator {
  get: (str: string, args?: string[]) => string;
  add: (item: { id: string; locale: object }) => void;
  language: () => string;
}

export interface Galaxy {
  translator: Translator;
  carbon: boolean;
}

export interface HyperCube extends EngineAPI.IHyperCube {
  qColumnOrder: number[];
  textAlign: string;
}

export interface TableLayout extends EngineAPI.IGenericHyperCubeLayout {
  qHyperCube: HyperCube;
}

export interface UseOptions {
  direction: 'ltr' | 'rtl';
  footerContainer: HTMLElement | undefined;
}

export interface Table {
  tableBackgroundColorFromTheme: string | 'inherit';
  backgroundColor: string | undefined;
  isBackgroundTransparentColor: boolean;
  isBackgroundDarkColor: boolean;
  borderColor: string;
  body: { borderColor: string };
  pagination: {
    borderColor: string;
    color: string;
    iconColor: string;
    disabledIconColor: string;
  };
}
export interface UseTheme {
  table: Table;
  name: () => string;
  getStyle: (basePath: string, path: string, attribute: string) => string | undefined;
}

export interface RenderWithCarbonArgs {
  env: Galaxy;
  translator: Translator;
  rootElement: HTMLElement;
  model: EngineAPI.IGenericObject | undefined;
  theme: UseTheme;
  selectionsAPI: stardust.ObjectSelections;
  app: EngineAPI.IApp | undefined;
  rect: stardust.Rect;
  layout: TableLayout;
}

export interface AnnouncementArgs {
  keys: string | Array<string | Array<string | number>>;
  shouldBeAtomic: boolean;
  politeness: string;
}

export interface ColumnColors {
  cellBackgroundColor: string;
  cellForegroundColor: string;
}

export interface Column {
  id: string;
  isDim: boolean;
  isLocked: boolean;
  dataColIdx: number;
  width: number;
  label: string;
  align: string;
  stylingInfo: string[];
  sortDirection: string;
}

interface TextAlign {
  auto: boolean;
  align: string;
}

interface ExtendedNxAttrExprInfo extends EngineAPI.INxAttrExprInfo {
  id: string;
}

export interface ExtendedNxDimensionInfo extends Omit<EngineAPI.INxDimensionInfo, 'qAttrExprInfo'> {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
}

export interface ExtendedNxMeasureInfo extends Omit<EngineAPI.INxMeasureInfo, 'qAttrExprInfo'> {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
}

export interface ManageDataArgs {
  model: EngineAPI.IGenericObject;
  layout: TableLayout;
  pageInfo: {
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
  };
  setPageInfo: stardust.SetStateFn<{
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
  }>;
}

export interface TableWrapperProps {
  rootElement: HTMLElement;
  tableData: {
    totalColumnCount: number;
    totalRowCount: number;
    totalPages: number;
    paginationNeeded: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: any[];
    columns: Column[];
  };
  pageInfo: {
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
  };
  setPageInfo: stardust.SetStateFn<{
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
  }>;
  constraints: stardust.Constraints;
  translator: Translator;
  selectionsAPI: stardust.ObjectSelections;
  theme: UseTheme;
  keyboard: stardust.Keyboard;
  direction: 'ltr' | 'rtl';
  footerContainer: HTMLElement | undefined;
}

export interface RootProps extends TableWrapperProps {
  layout: TableLayout;
  muiTheme: Theme;
  changeSortOrder: (layout: TableLayout, column: Column) => Promise<void>;
  rect: stardust.Rect;
}
