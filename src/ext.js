const definition = {
  type: 'items',
  component: 'accordion',
  items: {
    data: {
      type: 'items',
      component: 'columns',
      translation: 'Common.Data',
      sortIndexRef: 'qHyperCubeDef.qColumnOrder',
      allowMove: true,
      allowAdd: true,
      addTranslation: 'Common.Columns',
      items: {
        dimensions: {
          type: 'array',
          component: 'expandable-items',
          ref: 'qHyperCubeDef.qDimensions',
          grouped: true,
          items: {
            libraryId: {
              type: 'string',
              component: 'library-item',
              libraryItemType: 'dimension',
              ref: 'qLibraryId',
              translation: 'Common.Dimension',
              show(itemData) {
                return itemData.qLibraryId;
              },
            },
            inlineDimension: {
              component: 'inline-dimension',
              show(itemData) {
                return !itemData.qLibraryId;
              },
            },
            autoSort: {
              ref: 'qDef.autoSort',
              type: 'boolean',
              defaultValue: true,
              show: false,
            },
            cId: {
              ref: 'qDef.cId',
              type: 'string',
              show: false,
            },
            nullSuppression: {
              type: 'boolean',
              ref: 'qNullSuppression',
              defaultValue: false,
              translation: 'properties.dimensions.showNull',
              inverted: true,
            },
          },
        },
        measures: {
          type: 'array',
          component: 'expandable-items',
          ref: 'qHyperCubeDef.qMeasures',
          grouped: true,
          items: {
            libraryId: {
              type: 'string',
              component: 'library-item',
              libraryItemType: 'measure',
              ref: 'qLibraryId',
              translation: 'Common.Measure',
              show(itemData) {
                return itemData.qLibraryId;
              },
            },
            inlineMeasure: {
              component: 'inline-measure',
              show(itemData) {
                return !itemData.qLibraryId;
              },
            },
            autoSort: {
              ref: 'qDef.autoSort',
              type: 'boolean',
              defaultValue: true,
              show: false,
            },
            cId: {
              ref: 'qDef.cId',
              type: 'string',
              show: false,
            },
          },
        },
      },
    },
    sorting: {
      uses: 'sorting',
    },
    addOns: {
      type: 'items',
      component: 'expandable-items',
      translation: 'properties.addons',
      items: {
        dataHandling: {
          uses: 'dataHandling',
          items: {
            calcCond: {
              uses: 'calcCond',
            },
          },
        },
      },
    },
    settings: {
      uses: 'settings',
      items: {
        totals: {
          ref: 'totals.show',
          type: 'boolean',
          translation: 'properties.totals',
          component: 'switch',
          options: [
            {
              value: true,
              translation: 'Common.Auto',
            },
            {
              value: false,
              translation: 'Common.Custom',
            },
          ],
          defaultValue: true,
        },
      },
    },
  },
};

export function indexAdded(array, index) {
  let i;
  for (i = 0; i < array.length; ++i) {
    if (array[i] >= 0 && array[i] >= index) {
      ++array[i];
    }
  }
  array.push(index);
}

export function indexRemoved(array, index) {
  let removeIndex = 0;
  let i;
  for (i = 0; i < array.length; ++i) {
    if (array[i] > index) {
      --array[i];
    } else if (array[i] === index) {
      removeIndex = i;
    }
  }
  array.splice(removeIndex, 1);
  return removeIndex;
}

export function min(nDimsOrMeas) {
  return nDimsOrMeas > 0 ? 0 : 1;
}

export function getDescription(env) {
  return env.translator.get('Visualizations.Descriptions.Column');
}

export default function ext(env) {
  return {
    definition,
    data: {
      measures: {
        min,
        max: 1000,
        description: () => getDescription(env),
        add(measure, data, hcHandler) {
          const { qColumnOrder, columnWidths } = hcHandler.hcProperties;
          const ix = hcHandler.getDimensions().length + hcHandler.getMeasures().length - 1;

          indexAdded(qColumnOrder, ix);

          columnWidths.splice(qColumnOrder[ix], 0, -1); // -1 is auto
        },
        remove(measure, data, hcHandler, idx) {
          const { qColumnOrder, columnWidths } = hcHandler.hcProperties;
          const columnIx = (hcHandler.hcProperties.qDimensions ? hcHandler.hcProperties.qDimensions.length : 0) + idx;
          indexRemoved(qColumnOrder, columnIx);
          columnWidths.splice(columnIx, 1);
        },
      },
      dimensions: {
        min,
        max: 1000,
        description: () => getDescription(env),
        add(dimension, data, hcHandler) {
          const { qColumnOrder, columnWidths } = hcHandler.hcProperties;
          const ix = hcHandler.getDimensions().length - 1;
          indexAdded(qColumnOrder, ix);
          columnWidths.splice(ix, 0, -1); // -1 is auto

          return dimension;
        },
        remove(dimension, data, hcHandler, idx) {
          const { qColumnOrder, columnWidths } = hcHandler.hcProperties;
          indexRemoved(qColumnOrder, idx);
          columnWidths.splice(qColumnOrder[idx], 1);
        },
      },
    },
    support: {
      export: true,
      exportData: true,
      snapshot: true,
      viewData: false,
    },
  };
}
