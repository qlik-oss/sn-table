import { setValue } from "qlik-chart-modules";
import { PropTree } from "../types";
import type { ImportProperties } from "./import-properties";
import importProperties from "./import-properties";

const importViewDataProperties = ({
  exportFormat,
  initialProperties,
  extension,
  hypercubePath,
}: ImportProperties): PropTree => {
  const propertyTree = importProperties({ exportFormat, initialProperties, extension, hypercubePath });
  setValue(propertyTree, "qProperty.totals.show", false);
  setValue(propertyTree, "qProperty.usePagination", true);
  return propertyTree;
};

export default importViewDataProperties;
