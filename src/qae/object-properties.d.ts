import { HyperCube, Component } from '../types';

declare module 'object-properties' {
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
    components?: Component[];
  };
}
