import conversion from 'qlik-object-conversion';

import data from '../../qae/data';
import { ExportFormat, PropTree } from '../../types';

const importProperties = (
  exportFormat: ExportFormat,
  initialProperties: EngineAPI.IGenericHyperCubeProperties,
  extension: any,
  hypercubePath: string
): PropTree => {
  const propertyTree = conversion.hypercube.importProperties({
    exportFormat,
    initialProperties,
    dataDefinition: data().targets[0],
    defaultPropertyValues: {
      defaultDimension: extension.getDefaultDimensionProperties(),
      defaultMeasure: extension.getDefaultMeasureProperties(),
    },
    hypercubePath,
  });

  conversion.conditionalShow.unquarantine(propertyTree.qProperty);

  return propertyTree;
};

export default importProperties;
