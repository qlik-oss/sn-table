import { Component, QHyperCubeDef } from "../types";

declare module "object-properties" {
  declare const properties: {
    version: string;
    qHyperCubeDef: QHyperCubeDef;
    showTitles?: boolean;
    enableChartExploration?: boolean;
    title?: string;
    subtitle?: string;
    footnote?: string;
    totals: {
      show?: boolean;
      position?: "top" | "bottom" | "noTotals";
      label?: string;
    };
    components?: Component[];
  };
}
