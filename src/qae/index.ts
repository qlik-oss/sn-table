import { exportProperties, importProperties, importViewDataProperties } from "../conversion";
import data from "./data";
import properties from "./object-properties";

export default () => ({
  properties: { initial: properties },
  data: data(),
  importProperties,
  importViewDataProperties,
  exportProperties,
});
