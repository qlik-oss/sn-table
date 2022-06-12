import { stardust } from '@nebula.js/stardust';

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
  footerContainer: HTMLElement;
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

export interface RenderWithCarbonArgument {
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
  keys: string | string[] | string[][];
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
