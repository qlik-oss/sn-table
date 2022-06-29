// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Modifiers from 'qlik-modifiers';

import { Translator } from './types';

const columnCommonHidden = {
  autoSort: {
    ref: 'qDef.autoSort',
    type: 'boolean',
    defaultValue: true,
    show: false,
  },
};

const columnExpressionItems = {
  visibilityCondition: {
    type: 'string',
    component: 'expression',
    ref: 'qCalcCondition.qCond',
    expression: 'optional',
    expressionType: 'ValueExpr',
    translation: 'Object.Table.Columns.VisibilityCondition',
    defaultValue: { qv: '' },
    tid: 'visibilityCondition',
    isExpression: (val: string) => typeof val === 'string' && val.trim().length > 0,
  },
  tableCellColoring: {
    component: 'attribute-expression-reference',
    defaultValue: [],
    ref: 'qAttributeExpressions',
    items: [
      {
        component: 'expression',
        ref: 'qExpression',
        expressionType: 'measure',
        translation: 'Object.Table.Measure.BackgroundExpression',
        defaultValue: '',
        id: 'cellBackgroundColor',
        tid: 'tableColorBgByExpression',
      },
      {
        component: 'expression',
        ref: 'qExpression',
        expressionType: 'measure',
        translation: 'Object.Table.Measure.ForegroundExpression',
        defaultValue: '',
        id: 'cellForegroundColor',
        tid: 'tableColorByExpression',
      },
    ],
  },
};

const textAlignItems = {
  textAlignAuto: {
    ref: 'qDef.textAlign.auto',
    type: 'boolean',
    component: 'switch',
    translation: 'Common.Text.TextAlignment',
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
  textAlign: {
    ref: 'qDef.textAlign.align',
    type: 'string',
    component: 'item-selection-list',
    horizontal: true,
    items: [
      {
        component: 'icon-item',
        icon: 'align_left',
        labelPlacement: 'bottom',
        value: 'left',
        translation: 'properties.dock.left',
      },
      {
        component: 'icon-item',
        icon: 'align_center',
        labelPlacement: 'bottom',
        value: 'center',
        translation: 'Common.Center',
      },
      {
        component: 'icon-item',
        icon: 'align_right',
        labelPlacement: 'bottom',
        value: 'right',
        translation: 'properties.dock.right',
      },
    ],
    defaultValue: 'left',
    show: (data: {
      qDef: {
        textAlign: {
          auto: boolean;
        };
      };
    }) => data.qDef.textAlign !== undefined && !data.qDef.textAlign.auto,
  },
};

const getStyleSettings = (env: {
  translator: Translator;
  anything: {
    sense: {
      isUnsupportedFeature: (feature: string) => boolean;
    };
  };
}) => {
  return [
    {
      type: 'items',
      items: [
        {
          component: 'style-editor',
          translation: 'LayerStyleEditor.component.styling',
          subtitle: 'LayerStyleEditor.component.styling',
          resetBtnTranslation: 'LayerStyleEditor.component.resetAll',
          key: 'theme',
          ref: 'components',
          defaultValue: [], // used by chart conversion
          defaultValues: {
            // used by style editor
            key: 'theme',
            content: {
              fontSize: null,
              fontColor: {
                index: -1,
                color: null,
              },
              hoverEffect: false,
              hoverColor: {
                index: -1,
                color: null,
              },
              hoverFontColor: {
                index: -1,
                color: null,
              },
            },
            header: {
              fontSize: null,
              fontColor: {
                index: -1,
                color: null,
              },
            },
          },
          items: {
            chart: {
              type: 'items',
              items: {
                headerFontSize: {
                  show: true,
                  ref: 'header.fontSize',
                  translation: 'ThemeStyleEditor.style.headerFontSize',
                  component: 'integer',
                  // placeholder: () => parseInt(styleService.getStyle('header', 'fontSize'), 10),
                  maxlength: 3,
                  change(data: { header: { fontSize: number } }) {
                    data.header.fontSize = Math.max(5, Math.min(300, Math.floor(data.header.fontSize)));
                  },
                },
                headerFontColor: {
                  show: true,
                  ref: 'header.fontColor',
                  translation: 'ThemeStyleEditor.style.headerFontColor',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
                fontSize: {
                  show: true,
                  translation: 'ThemeStyleEditor.style.cellFontSize',
                  ref: 'content.fontSize',
                  component: 'integer',
                  // placeholder: () => parseInt(styleService.getStyle('content', 'fontSize'), 10),
                  maxlength: 3,
                  change(data: { content: { fontSize: number } }) {
                    data.content.fontSize = Math.max(5, Math.min(300, Math.floor(data.content.fontSize)));
                  },
                },
                fontColor: {
                  show: true,
                  ref: 'content.fontColor',
                  translation: 'ThemeStyleEditor.style.cellFontColor',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
                hoverEffect: {
                  show: true,
                  ref: 'content.hoverEffect',
                  translation: 'ThemeStyleEditor.style.hoverEffect',
                  type: 'boolean',
                  component: 'switch',
                  options: [
                    {
                      value: true,
                      translation: 'properties.on',
                    },
                    {
                      value: false,
                      translation: 'properties.off',
                    },
                  ],
                },
                hoverColor: {
                  show: (data: {
                    content: {
                      hoverEffect: boolean;
                    };
                  }) => !!data.content.hoverEffect,
                  ref: 'content.hoverColor',
                  translation: 'ThemeStyleEditor.style.hoverStyle',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
                hoverFontColor: {
                  show: (data: {
                    content: {
                      hoverEffect: boolean;
                    };
                  }) => !!data.content.hoverEffect,
                  ref: 'content.hoverFontColor',
                  translation: 'ThemeStyleEditor.style.hoverFontStyle',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
              },
            },
          },
        },
      ],
    },
    {
      type: 'items',
      items: [
        {
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
        {
          ref: 'totals.position',
          translation: 'Common.Position',
          type: 'string',
          component: 'dropdown',
          options: [
            {
              value: 'noTotals',
              translation: 'Common.None',
            },
            {
              value: 'top',
              translation: 'Common.Top',
            },
            {
              value: 'bottom',
              translation: 'Common.Bottom',
            },
          ],
          defaultValue: 'noTotals',
          show(data: {
            totals: {
              show: boolean;
            };
          }) {
            return !data.totals.show;
          },
        },
        {
          ref: 'totals.label',
          translation: 'properties.totals.label',
          type: 'string',
          expression: 'optional',
          defaultValue() {
            return env.translator.get('Object.Table.Totals');
          },
        },
      ],
      show: !env?.anything?.sense?.isUnsupportedFeature?.('totals'),
    },
  ];
};

const getDefinition = (env: {
  translator: Translator;
  anything: {
    sense: {
      isUnsupportedFeature: (feature: string) => boolean;
    };
  };
}) => {
  return {
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
                show(itemData: { qLibraryId: string }) {
                  return itemData.qLibraryId;
                },
              },
              inlineDimension: {
                component: 'inline-dimension',
                show(itemData: { qLibraryId: string }) {
                  return !itemData.qLibraryId;
                },
              },
              nullSuppression: {
                type: 'boolean',
                ref: 'qNullSuppression',
                defaultValue: false,
                translation: 'properties.dimensions.showNull',
                inverted: true,
              },
              ...columnCommonHidden,
              ...columnExpressionItems,
              ...textAlignItems,
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
                show: (itemData: { qLibraryId: string }) => itemData.qLibraryId,
              },
              inlineMeasure: {
                component: 'inline-measure',
                show: (itemData: { qLibraryId: string }) => !itemData.qLibraryId,
              },
              ...columnCommonHidden,
              ...columnExpressionItems,
              ...textAlignItems,
              totalsAggr: {
                type: 'items',
                grouped: true,
                items: {
                  totalsAggrGroup: {
                    type: 'items',
                    items: {
                      totalsAggrFunc: {
                        type: 'string',
                        component: 'dropdown',
                        ref: 'qDef.qAggrFunc',
                        translation: 'Object.Table.AggrFunc',
                        options(
                          data: object[],
                          handler: {
                            properties: object;
                          }
                        ) {
                          const hasActiveModifiers = Modifiers.hasActiveModifiers({
                            measures: [data],
                            properties: handler.properties,
                          });
                          const enableTotal = !hasActiveModifiers || Modifiers.ifEnableTotalsFunction(data);
                          const autoOption = enableTotal
                            ? [
                                {
                                  value: 'Expr',
                                  translation: 'Common.Auto',
                                },
                              ]
                            : [];
                          return autoOption.concat([
                            {
                              value: 'Avg',
                              translation: 'Object.Table.AggrFunc.Avg',
                            },
                            {
                              value: 'Count',
                              translation: 'Object.Table.AggrFunc.Count',
                            },
                            {
                              value: 'Max',
                              translation: 'Object.Table.AggrFunc.Max',
                            },
                            {
                              value: 'Min',
                              translation: 'Object.Table.AggrFunc.Min',
                            },
                            {
                              value: 'Sum',
                              translation: 'Object.Table.AggrFunc.Sum',
                            },
                            {
                              value: 'None',
                              translation: 'Object.Table.AggrFunc.None',
                            },
                          ]);
                        },
                        defaultValue: env?.anything?.sense?.isUnsupportedFeature?.('totals') ? 'None' : 'Expr',
                      },
                    },
                  },
                },
                show: !env?.anything?.sense?.isUnsupportedFeature?.('totals'),
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
          presentation: {
            grouped: true,
            type: 'items',
            translation: 'properties.presentation',
            items: getStyleSettings(env),
          },
        },
      },
    },
  };
};

export function indexAdded(array: number[], index: number) {
  let i;
  for (i = 0; i < array.length; ++i) {
    if (array[i] >= 0 && array[i] >= index) {
      ++array[i];
    }
  }
  array.push(index);
}

export function indexRemoved(array: number[], index: number) {
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

export function min(nDimsOrMeas: number) {
  return nDimsOrMeas > 0 ? 0 : 1;
}

export function getDescription(env: { translator: Translator }) {
  return env.translator.get('Visualizations.Descriptions.Column');
}

export default function ext(env: {
  translator: Translator;
  anything: {
    sense: {
      isUnsupportedFeature: (feature: string) => boolean;
    };
  };
}) {
  return {
    definition: getDefinition(env),
    data: {
      measures: {
        min,
        max: 1000,
        description: () => getDescription(env),
        add(
          measure: undefined,
          data: undefined,
          hcHandler: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hcProperties: {
              qColumnOrder: number[];
              columnWidths: number[];
            };
            getDimensions: () => string[];
            getMeasures: () => string[];
          }
        ) {
          const { qColumnOrder, columnWidths } = hcHandler.hcProperties;
          const ix = hcHandler.getDimensions().length + hcHandler.getMeasures().length - 1;

          indexAdded(qColumnOrder, ix);

          columnWidths.splice(qColumnOrder[ix], 0, -1); // -1 is auto
        },
        remove(
          measure: undefined,
          data: undefined,
          hcHandler: {
            hcProperties: {
              qDimensions: string[];
              qColumnOrder: number[];
              columnWidths: number[];
            };
          },
          idx: number
        ) {
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
        add(
          dimension: number,
          data: undefined,
          hcHandler: {
            hcProperties: {
              columnWidths: number[];
              qColumnOrder: number[];
            };
            getDimensions: () => string[];
          }
        ) {
          const { qColumnOrder, columnWidths } = hcHandler.hcProperties;
          const ix = hcHandler.getDimensions().length - 1;
          indexAdded(qColumnOrder, ix);
          columnWidths.splice(ix, 0, -1); // -1 is auto

          return dimension;
        },
        remove(
          dimension: undefined,
          data: undefined,
          hcHandler: {
            hcProperties: {
              qColumnOrder: number[];
              columnWidths: number[];
            };
          },
          idx: number
        ) {
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
