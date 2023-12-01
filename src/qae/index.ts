import { exportProperties, importProperties } from "../conversion";
import exploration from "../exploration/exploration";
import data from "./data";
import properties from "./object-properties";

export default {
  properties: { initial: properties },
  data: data(),
  importProperties,
  exportProperties,
  exploration,
};
