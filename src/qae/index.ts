import { exportProperties, importProperties } from "../conversion";
import data from "../data/data";
import exploration from "../exploration/exploration";
import { Galaxy } from "../types";
import properties from "./object-properties";

export default (env: Galaxy) => ({
  properties: { initial: properties },
  data: {
    targets: [
      {
        path: "/qHyperCubeDef",
        ...data(env),
      },
    ],
  },
  importProperties,
  exportProperties,
  exploration,
});
