import exploration from "../exploration/exploration";
import data from "./data";
import properties from "./object-properties";

export default {
  exploration,
  properties: { initial: properties },
  data: data(),
};
