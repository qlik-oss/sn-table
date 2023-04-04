import conversion from 'qlik-object-conversion';

import { ExportFormat, PropTree } from '../../types';

const exportProperties = (propertyTree: PropTree, hyperCubePath: string): ExportFormat => {
  const expFormat = conversion.hypercube.exportProperties({
    propertyTree,
    hyperCubePath,
  });

  return expFormat;
};

export default exportProperties;
