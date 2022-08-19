import { Components, HyperCube } from '../types';

declare module 'initial-properties';

declare const properties: {
  version: string;
  qHyperCubeDef: HyperCube;
  showTitles?: boolean;
  title?: string;
  subtitle?: string;
  footnote?: string;
  totals: {
    show?: boolean;
    position?: 'top' | 'bottom' | 'noTotals';
    label?: string;
  };
  components?: Components;
};

export default properties;
