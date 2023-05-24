export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'pPCg',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 5,
            qcy: 824,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: 'Product',
              qApprMaxGlyphCount: 37,
              qCardinal: 824,
              qSortIndicator: 'D',
              qGroupFallbackTitles: ['Product'],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 824,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ['$key', '$ascii', '$text'],
              qDimensionType: 'D',
              qGrouping: 'N',
              qNumFormat: {
                qType: 'R',
                qnDec: 14,
                qUseThou: 1,
                qFmt: '##############',
                qDec: '.',
                qThou: ',',
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ['Line Desc 1'],
              qMin: 'NaN',
              qMax: 'NaN',
              qAttrExprInfo: [
                {
                  qMin: 'NaN',
                  qMax: 'NaN',
                  qFallbackTitle: "if(Sum([Sales Quantity]*([Sales Price]- [CostPrice])) > 0, '#ff0000', '#00ff00')",
                  qNumFormat: {
                    qType: 'U',
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: 'cellBackgroundColor',
                },
                {
                  qMin: 'NaN',
                  qMax: 'NaN',
                  qFallbackTitle: "if(Sum([Sales Quantity]*([Sales Price]- [CostPrice])) > 0, 'orange', 'purple')",
                  qNumFormat: {
                    qType: 'U',
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: 'cellForegroundColor',
                },
              ],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 824,
                qHypercubeCardinal: 824,
                qAllValuesCardinal: -1,
              },
              qLibraryId: 'pmresb',
              title: 'Product',
              othersLabel: 'Others',
              autoSort: false,
              textAlign: {
                auto: false,
                align: 'right',
              },
              columnWidth: {
                type: 'fitToContent',
                pixels: 200,
                percentage: 20,
              },
              cId: 'QXquMx',
            },
          ],
          qMeasureInfo: [
            {
              qFallbackTitle: 'Inventory Amount',
              qApprMaxGlyphCount: 11,
              qCardinal: 0,
              qSortIndicator: 'A',
              qNumFormat: {
                qType: 'R',
                qnDec: 0,
                qUseThou: 0,
                qFmt: '##############',
                qDec: '.',
                qThou: ',',
              },
              qMin: 0,
              qMax: 70362.25,
              qReverseSort: true,
              qIsAutoFormat: true,
              qAttrExprInfo: [
                {
                  qMin: 'NaN',
                  qMax: 'NaN',
                  qFallbackTitle: "if(Sum(StockOH*CostPrice) < 300, '#ff0000', '#00ff00')",
                  qNumFormat: {
                    qType: 'U',
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: 'cellBackgroundColor',
                },
              ],
              qAttrDimInfo: [],
              qLibraryId: 'w',
              qTrendLines: [],
              numFormatFromTemplate: true,
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              columnWidth: {
                type: 'auto',
                pixels: 200,
                percentage: 20,
              },
              cId: 'bRWRu',
            },
            {
              qFallbackTitle: 'Sales Quantity',
              qApprMaxGlyphCount: 9,
              qCardinal: 0,
              qSortIndicator: 'A',
              qNumFormat: {
                qType: 'U',
                qnDec: 0,
                qUseThou: 0,
              },
              qMin: -123,
              qMax: 137023,
              qReverseSort: true,
              qIsAutoFormat: true,
              qAttrExprInfo: [
                {
                  qMin: 'NaN',
                  qMax: 'NaN',
                  qFallbackTitle: "if(Sum([Sales Quantity]) < 400, '#ff0000', '#00ff00')",
                  qNumFormat: {
                    qType: 'U',
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: 'cellForegroundColor',
                },
              ],
              qAttrDimInfo: [],
              qLibraryId: 'SLJUwQj',
              qTrendLines: [],
              numFormatFromTemplate: true,
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              columnWidth: {
                type: 'auto',
                pixels: 200,
                percentage: 20,
              },
              cId: 'ELmxjV',
            },
            {
              qFallbackTitle: 'Sum([Sales Price])',
              qApprMaxGlyphCount: 13,
              qCardinal: 0,
              qSortIndicator: 'D',
              qNumFormat: {
                qType: 'M',
                qnDec: 0,
                qUseThou: 0,
                qFmt: '$#,##0.00;($#,##0.00)',
                qDec: '.',
                qThou: ',',
              },
              qMin: -6681.480000000002,
              qMax: 322356.5599999992,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qTrendLines: [],
              numFormatFromTemplate: true,
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              columnWidth: {
                type: 'auto',
                pixels: 200,
                percentage: 20,
              },
              cId: 'RKDGbH',
            },
            {
              qFallbackTitle: 'Sum([CostPrice])',
              qApprMaxGlyphCount: 8,
              qCardinal: 0,
              qSortIndicator: 'D',
              qNumFormat: {
                qType: 'R',
                qnDec: 14,
                qUseThou: 1,
                qFmt: '##############',
                qDec: '.',
                qThou: ',',
              },
              qMin: 0,
              qMax: 422.29,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qTrendLines: [],
              numFormatFromTemplate: true,
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              columnWidth: {
                type: 'auto',
                pixels: 200,
                percentage: 20,
              },
              cId: 'THhQNtm',
            },
          ],
          qEffectiveInterColumnSortOrder: [0, 1, 2, 3, 4],
          qGrandTotalRow: [
            {
              qText: '2236040.965',
              qNum: 2236040.965000001,
              qElemNumber: -1,
              qState: 'X',
              qIsTotalCell: true,
            },
            {
              qText: '1122333.3',
              qNum: 1122333.2999999998,
              qElemNumber: -1,
              qState: 'X',
              qIsTotalCell: true,
            },
            {
              qText: '$6,734,059.91',
              qNum: 6734059.910000294,
              qElemNumber: -1,
              qState: 'X',
              qIsTotalCell: true,
            },
            {
              qText: '28734.15',
              qNum: 28734.15000000001,
              qElemNumber: -1,
              qState: 'X',
              qIsTotalCell: true,
            },
          ],
          qPivotDataPages: [],
          qStackedDataPages: [],
          qMode: 'S',
          qNoOfLeftDims: -1,
          qTreeNodesOnDim: [],
          qColumnOrder: [0, 1, 2, 3, 4],
        },
        showTitles: false,
        title: 'scenario_4',
        subtitle: 'virtualized table',
        footnote: '',
        disableNavMenu: false,
        showDetails: true,
        showDetailsExpression: false,
        components: [
          {
            key: 'general',
          },
          {
            key: 'theme',
            header: {
              fontSize: 22,
              fontColor: {
                index: -1,
                color: '#70ba6e',
              },
            },
            content: {
              fontSize: 10,
              fontColor: {
                index: -1,
                color: '#65d3da',
              },
              hoverEffect: true,
            },
          },
        ],
        totals: {
          show: false,
          position: 'bottom',
          label: 'Totals',
        },
        usePagination: true,
        enableChartExploration: false,
        chartExploration: {
          menuVisibility: 'auto',
        },
        visualization: 'sn-table',
        version: '"2.2.3"',
        extensionMeta: {
          translationKey: '',
          icon: 'table',
          iconChar: 'puzzle',
          isLibraryItem: true,
          visible: true,
          name: 'Straight table',
          description:
            'Display several measure values for each dimension value. Show the totals for each measure. Sort columns and rows alphabetically or numerically. Change sorting during analysis. Chart exploration allows for adding and removing columns in analysis.',
          template: 'sn-table',
          iconPath:
            'M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z',
          isThirdParty: true,
          version: '2.2.3',
          author: 'QlikTech International AB',
          type: 'visualization',
          supernova: true,
          bundle: {
            id: 'qlik-visualization-bundle',
            name: 'Qlik Visualization bundle',
            description:
              "This is a set of supported objects that expands the visualization capabilities of Qlik Sense. These can be used in addition to the objects found under 'Charts'. For support conditions and limitations, see the documentation.",
          },
          installer: 'QlikExtensionBundler',
          folder: '_visualization-bundle',
        },
      },
      getHyperCubeData: [
        {
          qMatrix: [
            [
              {
                qText: 'Washington Strawberry Drink',
                qNum: 'NaN',
                qElemNumber: 203,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4761.79',
                qNum: 4761.79,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '141',
                qNum: 141,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$3,142.71',
                qNum: 3142.7100000000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '65.23',
                qNum: 65.23,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Orange Juice',
                qNum: 'NaN',
                qElemNumber: 338,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '8537.02',
                qNum: 8537.02,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1128',
                qNum: 1128,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$617.53',
                qNum: 617.53,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '14.36',
                qNum: 14.36,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Mango Drink',
                qNum: 'NaN',
                qElemNumber: 270,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '210.21',
                qNum: 210.21,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '138',
                qNum: 138,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$11,835.39',
                qNum: 11835.39,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.73',
                qNum: 2.73,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Diet Soda',
                qNum: 'NaN',
                qElemNumber: 168,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '655.29',
                qNum: 655.29,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '339',
                qNum: 339,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$9,261.87',
                qNum: 9261.869999999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '72.81',
                qNum: 72.81,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Diet Cola',
                qNum: 'NaN',
                qElemNumber: 6,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '10539',
                qNum: 10539,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '10521',
                qNum: 10521,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '($6,681.48)',
                qNum: -6681.480000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2',
                qNum: 2,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Cream Soda',
                qNum: 'NaN',
                qElemNumber: 333,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '920.96',
                qNum: 920.96,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '453',
                qNum: 453,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$12,964.43',
                qNum: 12964.430000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '57.56',
                qNum: 57.56,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Cranberry Juice',
                qNum: 'NaN',
                qElemNumber: 155,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '474.3',
                qNum: 474.3,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '11733',
                qNum: 11733,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$8,758.95',
                qNum: 8758.949999999995,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.85',
                qNum: 0.85,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Cola',
                qNum: 'NaN',
                qElemNumber: 169,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '409.82',
                qNum: 409.82,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '2471',
                qNum: 2471,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$597.94',
                qNum: 597.9400000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.62',
                qNum: 0.62,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Berry Juice',
                qNum: 'NaN',
                qElemNumber: 560,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '3.465',
                qNum: 3.465,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '40',
                qNum: 40,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$20.43',
                qNum: 20.43,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.63',
                qNum: 0.63,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Apple Juice',
                qNum: 'NaN',
                qElemNumber: 451,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '7572',
                qNum: 7572,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1197',
                qNum: 1197,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$8,698.52',
                qNum: 8698.520000000004,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '12.62',
                qNum: 12.620000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Washington Apple Drink',
                qNum: 'NaN',
                qElemNumber: 619,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '16047.02',
                qNum: 16047.02,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '303',
                qNum: 303,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$154,208.52',
                qNum: 154208.51999999926,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '422.29',
                qNum: 422.29,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus White Zinfandel Wine',
                qNum: 'NaN',
                qElemNumber: 98,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4383.405',
                qNum: 4383.405,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '9197',
                qNum: 9197,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$6,542.47',
                qNum: 6542.470000000004,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '11.43',
                qNum: 11.43,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus Merlot Wine',
                qNum: 'NaN',
                qElemNumber: 773,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1.32',
                qNum: 1.32,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '8',
                qNum: 8,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$21.09',
                qNum: 21.090000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.64',
                qNum: 2.64,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus Light Wine',
                qNum: 'NaN',
                qElemNumber: 268,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '102.85',
                qNum: 102.85000000000001,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '310',
                qNum: 310,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$274.47',
                qNum: 274.46999999999986,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '1.87',
                qNum: 1.87,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus Light Beer',
                qNum: 'NaN',
                qElemNumber: 325,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '2358.09',
                qNum: 2358.0899999999997,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '746',
                qNum: 746,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$13,996.29',
                qNum: 13996.290000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '41.37',
                qNum: 41.37,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus Imported Beer',
                qNum: 'NaN',
                qElemNumber: 278,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4521.38',
                qNum: 4521.38,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '174',
                qNum: 174,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$9,741.83',
                qNum: 9741.829999999998,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '49.96',
                qNum: 49.96,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus Chardonnay Wine',
                qNum: 'NaN',
                qElemNumber: 638,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '19.25',
                qNum: 19.25,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '11',
                qNum: 11,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$40.92',
                qNum: 40.919999999999995,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '3.5',
                qNum: 3.5,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus Chardonnay',
                qNum: 'NaN',
                qElemNumber: 125,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4470.69',
                qNum: 4470.69,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '137023',
                qNum: 137023,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,207.60',
                qNum: 2207.6,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.06',
                qNum: 0.06,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Walrus Chablis Wine',
                qNum: 'NaN',
                qElemNumber: 581,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '63.36',
                qNum: 63.36,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '98',
                qNum: 98,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$188.51',
                qNum: 188.51000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.99',
                qNum: 0.99,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Urban Small Eggs',
                qNum: 'NaN',
                qElemNumber: 254,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1766.34',
                qNum: 1766.3400000000001,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '318',
                qNum: 318,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$8,905.62',
                qNum: 8905.62,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '32.71',
                qNum: 32.71,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Urban Small Brown Eggs',
                qNum: 'NaN',
                qElemNumber: 291,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1949.48',
                qNum: 1949.4800000000002,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '158',
                qNum: 158,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$5,476.80',
                qNum: 5476.7999999999965,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '23.92',
                qNum: 23.92,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Urban Large Eggs',
                qNum: 'NaN',
                qElemNumber: 277,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1292.76',
                qNum: 1292.76,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '121',
                qNum: 121,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,924.25',
                qNum: 2924.2499999999986,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '20.52',
                qNum: 20.52,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Urban Large Brown Eggs',
                qNum: 'NaN',
                qElemNumber: 208,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1176.45',
                qNum: 1176.45,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '656',
                qNum: 656,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$11,495.20',
                qNum: 11495.200000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '21.39',
                qNum: 21.39,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Urban Egg Substitute',
                qNum: 'NaN',
                qElemNumber: 465,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '22.6',
                qNum: 22.6,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '57',
                qNum: 57,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,393.15',
                qNum: 2393.1499999999996,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '9.04',
                qNum: 9.040000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Strawberry Drink',
                qNum: 'NaN',
                qElemNumber: 690,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '49.61',
                qNum: 49.61,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '33',
                qNum: 33,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$440.57',
                qNum: 440.5700000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '9.02',
                qNum: 9.02,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Orange Juice',
                qNum: 'NaN',
                qElemNumber: 376,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '8370.55',
                qNum: 8370.550000000001,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '163',
                qNum: 163,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$20,579.04',
                qNum: 20579.040000000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '100.85',
                qNum: 100.85000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Mango Drink',
                qNum: 'NaN',
                qElemNumber: 219,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '111',
                qNum: 111,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '444',
                qNum: 444,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$0.00',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2',
                qNum: 2,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Diet Soda',
                qNum: 'NaN',
                qElemNumber: 146,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '2503.5',
                qNum: 2503.5,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '78',
                qNum: 78,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$12,466.83',
                qNum: 12466.830000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '50.07',
                qNum: 50.07,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Diet Cola',
                qNum: 'NaN',
                qElemNumber: 735,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '129.625',
                qNum: 129.625,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '22',
                qNum: 22,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$288.63',
                qNum: 288.63000000000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '10.37',
                qNum: 10.370000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Cream Soda',
                qNum: 'NaN',
                qElemNumber: 739,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '72.9',
                qNum: 72.9,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '44',
                qNum: 44,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$853.58',
                qNum: 853.5799999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '14.58',
                qNum: 14.58,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Cranberry Juice',
                qNum: 'NaN',
                qElemNumber: 220,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '44.76',
                qNum: 44.76,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1007',
                qNum: 1007,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$113.42',
                qNum: 113.41999999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.08',
                qNum: 0.08,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Cola',
                qNum: 'NaN',
                qElemNumber: 279,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '342.2',
                qNum: 342.2,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '68',
                qNum: 68,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$13,308.14',
                qNum: 13308.140000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '68.44',
                qNum: 68.44,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Berry Juice',
                qNum: 'NaN',
                qElemNumber: 218,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '36.92',
                qNum: 36.92,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '502',
                qNum: 502,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,237.18',
                qNum: 1237.1799999999998,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.71',
                qNum: 0.71,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Apple Juice',
                qNum: 'NaN',
                qElemNumber: 177,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '151.65',
                qNum: 151.65,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '28',
                qNum: 28,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$14,868.61',
                qNum: 14868.610000000004,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '101.1',
                qNum: 101.10000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Token Apple Drink',
                qNum: 'NaN',
                qElemNumber: 371,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '803',
                qNum: 803,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$42,947.09',
                qNum: 42947.089999999946,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '91.61',
                qNum: 91.61,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tip Top Scallops',
                qNum: 'NaN',
                qElemNumber: 442,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '98.475',
                qNum: 98.47500000000001,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '15',
                qNum: 15,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$496.79',
                qNum: 496.78999999999996,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '13.13',
                qNum: 13.13,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tip Top Lox',
                qNum: 'NaN',
                qElemNumber: 230,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '400.5',
                qNum: 400.5,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '45',
                qNum: 45,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$3,747.28',
                qNum: 3747.279999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '66.75',
                qNum: 66.75,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher White Chocolate Bar',
                qNum: 'NaN',
                qElemNumber: 299,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1167.25',
                qNum: 1167.25,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '151',
                qNum: 151,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$3,454.78',
                qNum: 3454.7799999999966,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '14.5',
                qNum: 14.5,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher Tasty Candy Bar',
                qNum: 'NaN',
                qElemNumber: 819,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '41.73',
                qNum: 41.73,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '25',
                qNum: 25,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$32.36',
                qNum: 32.36,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '6.42',
                qNum: 6.42,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher Spicy Mints',
                qNum: 'NaN',
                qElemNumber: 62,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '6166.26',
                qNum: 6166.26,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '550',
                qNum: 550,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$50,480.77',
                qNum: 50480.769999999895,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '108.18',
                qNum: 108.18,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher Semi-Sweet Chocolate Bar',
                qNum: 'NaN',
                qElemNumber: 133,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '-19',
                qNum: -19,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$6,095.78',
                qNum: 6095.780000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '28.35',
                qNum: 28.35,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher Mints',
                qNum: 'NaN',
                qElemNumber: 103,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '343.2',
                qNum: 343.2,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '21',
                qNum: 21,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,090.19',
                qNum: 2090.189999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '42.9',
                qNum: 42.9,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher Mint Chocolate Bar',
                qNum: 'NaN',
                qElemNumber: 392,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '14.775',
                qNum: 14.774999999999999,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '41',
                qNum: 41,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$689.89',
                qNum: 689.8900000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '9.85',
                qNum: 9.85,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher Malted Milk Balls',
                qNum: 'NaN',
                qElemNumber: 87,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '840.95',
                qNum: 840.95,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '-6',
                qNum: -6,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,551.95',
                qNum: 1551.95,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '30.58',
                qNum: 30.580000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Thresher Bubble Gum',
                qNum: 'NaN',
                qElemNumber: 102,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '-3',
                qNum: -3,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$254.41',
                qNum: 254.41,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2',
                qNum: 2,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Walnuts',
                qNum: 'NaN',
                qElemNumber: 170,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '677.31',
                qNum: 677.3100000000001,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '764',
                qNum: 764,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$5,216.53',
                qNum: 5216.530000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '12.66',
                qNum: 12.66,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Tomatos',
                qNum: 'NaN',
                qElemNumber: 48,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '162.085',
                qNum: 162.08499999999998,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '33',
                qNum: 33,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$3,897.49',
                qNum: 3897.4900000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '29.47',
                qNum: 29.47,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Tangerines',
                qNum: 'NaN',
                qElemNumber: 504,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4.11',
                qNum: 4.11,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '7',
                qNum: 7,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$769.47',
                qNum: 769.47,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '8.22',
                qNum: 8.22,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Sweet Peas',
                qNum: 'NaN',
                qElemNumber: 710,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '373.725',
                qNum: 373.725,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '55',
                qNum: 55,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$4,745.96',
                qNum: 4745.96,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '67.95',
                qNum: 67.95,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Sweet Onion',
                qNum: 'NaN',
                qElemNumber: 756,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '483.395',
                qNum: 483.39500000000004,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '17',
                qNum: 17,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,018.91',
                qNum: 1018.91,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '56.87',
                qNum: 56.870000000000005,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Summer Squash',
                qNum: 'NaN',
                qElemNumber: 618,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1',
                qNum: 1,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '7',
                qNum: 7,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$50.77',
                qNum: 50.769999999999996,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2',
                qNum: 2,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Shitake Mushrooms',
                qNum: 'NaN',
                qElemNumber: 719,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '124',
                qNum: 124,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '272',
                qNum: 272,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,441.98',
                qNum: 1441.9800000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2',
                qNum: 2,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Red Pepper',
                qNum: 'NaN',
                qElemNumber: 501,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '8.82',
                qNum: 8.82,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '18',
                qNum: 18,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$109.66',
                qNum: 109.66,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.98',
                qNum: 0.98,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Red Delcious Apples',
                qNum: 'NaN',
                qElemNumber: 702,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '47722.32',
                qNum: 47722.32,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '25603',
                qNum: 25603,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,108.47',
                qNum: 2108.4700000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '67.12',
                qNum: 67.12,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Prepared Salad',
                qNum: 'NaN',
                qElemNumber: 711,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1032.845',
                qNum: 1032.845,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '22',
                qNum: 22,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$8,815.10',
                qNum: 8815.1,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '187.79',
                qNum: 187.79,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Potatos',
                qNum: 'NaN',
                qElemNumber: 670,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '53.56',
                qNum: 53.56,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '25',
                qNum: 25,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$544.05',
                qNum: 544.05,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '8.24',
                qNum: 8.24,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Plums',
                qNum: 'NaN',
                qElemNumber: 583,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '115.885',
                qNum: 115.885,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '41',
                qNum: 41,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$227.00',
                qNum: 227,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '21.07',
                qNum: 21.07,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Peaches',
                qNum: 'NaN',
                qElemNumber: 584,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '191.4',
                qNum: 191.4,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '33',
                qNum: 33,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$512.89',
                qNum: 512.89,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '31.9',
                qNum: 31.900000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Party Nuts',
                qNum: 'NaN',
                qElemNumber: 267,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '-20',
                qNum: -20,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,030.10',
                qNum: 1030.1,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '24.8',
                qNum: 24.8,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Oranges',
                qNum: 'NaN',
                qElemNumber: 411,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '274.54',
                qNum: 274.53999999999996,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '28',
                qNum: 28,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,815.96',
                qNum: 2815.9600000000014,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '19.61',
                qNum: 19.61,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Onions',
                qNum: 'NaN',
                qElemNumber: 312,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '16282.44',
                qNum: 16282.44,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '119',
                qNum: 119,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$55,707.57',
                qNum: 55707.56999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '262.62',
                qNum: 262.62,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale New Potatos',
                qNum: 'NaN',
                qElemNumber: 548,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '17334.46',
                qNum: 17334.46,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '18',
                qNum: 18,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$916.06',
                qNum: 916.06,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '62.92',
                qNum: 62.92,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Mushrooms',
                qNum: 'NaN',
                qElemNumber: 13,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '10192.875',
                qNum: 10192.875,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '241',
                qNum: 241,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$7,246.18',
                qNum: 7246.179999999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '17.65',
                qNum: 17.650000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Mixed Nuts',
                qNum: 'NaN',
                qElemNumber: 266,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '220.92',
                qNum: 220.92000000000002,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '43',
                qNum: 43,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,939.20',
                qNum: 1939.2000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '36.82',
                qNum: 36.82,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Mandarin Oranges',
                qNum: 'NaN',
                qElemNumber: 292,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '2129.8',
                qNum: 2129.7999999999997,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '338',
                qNum: 338,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$21,263.75',
                qNum: 21263.749999999956,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '37.04',
                qNum: 37.04,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Macintosh Apples',
                qNum: 'NaN',
                qElemNumber: 149,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '2730.97',
                qNum: 2730.9700000000003,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '238',
                qNum: 238,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$18,546.24',
                qNum: 18546.239999999994,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '45.14',
                qNum: 45.14,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Limes',
                qNum: 'NaN',
                qElemNumber: 43,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '3090.15',
                qNum: 3090.15,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1993',
                qNum: 1993,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$39,091.02',
                qNum: 39091.01999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '32.7',
                qNum: 32.7,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Lettuce',
                qNum: 'NaN',
                qElemNumber: 427,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1596.44',
                qNum: 1596.44,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '86',
                qNum: 86,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$4,127.12',
                qNum: 4127.120000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '29.84',
                qNum: 29.84,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Lemons',
                qNum: 'NaN',
                qElemNumber: 424,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '704.48',
                qNum: 704.48,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '6215',
                qNum: 6215,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$462.39',
                qNum: 462.38999999999993,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '1.36',
                qNum: 1.36,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Honey Dew',
                qNum: 'NaN',
                qElemNumber: 293,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '234.245',
                qNum: 234.245,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '9',
                qNum: 9,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$980.33',
                qNum: 980.3300000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '42.59',
                qNum: 42.59,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Green Pepper',
                qNum: 'NaN',
                qElemNumber: 92,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '261.415',
                qNum: 261.415,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '51',
                qNum: 51,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$4,744.90',
                qNum: 4744.900000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '47.53',
                qNum: 47.53,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Golden Delcious Apples',
                qNum: 'NaN',
                qElemNumber: 716,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '615.23',
                qNum: 615.23,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '18',
                qNum: 18,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,299.64',
                qNum: 1299.6399999999996,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '111.86',
                qNum: 111.86,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Garlic',
                qNum: 'NaN',
                qElemNumber: 313,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '202.75',
                qNum: 202.75,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '58',
                qNum: 58,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$17,029.83',
                qNum: 17029.829999999987,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '40.55',
                qNum: 40.550000000000004,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Fuji Apples',
                qNum: 'NaN',
                qElemNumber: 294,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '15.235',
                qNum: 15.235,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '39',
                qNum: 39,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,797.46',
                qNum: 1797.4600000000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.77',
                qNum: 2.77,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Fresh Lima Beans',
                qNum: 'NaN',
                qElemNumber: 251,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '396.34',
                qNum: 396.34,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '126',
                qNum: 126,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,681.18',
                qNum: 1681.1799999999998,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '5.96',
                qNum: 5.96,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Firm Tofu',
                qNum: 'NaN',
                qElemNumber: 173,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '7127.575',
                qNum: 7127.575,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '2390',
                qNum: 2390,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$12,611.47',
                qNum: 12611.469999999976,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '11.83',
                qNum: 11.83,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Fancy Plums',
                qNum: 'NaN',
                qElemNumber: 351,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4970.16',
                qNum: 4970.160000000001,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '421',
                qNum: 421,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$11,768.07',
                qNum: 11768.069999999992,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '92.04',
                qNum: 92.04,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Elephant Garlic',
                qNum: 'NaN',
                qElemNumber: 568,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '68.04',
                qNum: 68.03999999999999,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '12',
                qNum: 12,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$256.53',
                qNum: 256.53,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '11.34',
                qNum: 11.34,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Dried Mushrooms',
                qNum: 'NaN',
                qElemNumber: 14,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1452.6',
                qNum: 1452.6,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '265',
                qNum: 265,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$5,401.68',
                qNum: 5401.680000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '21.52',
                qNum: 21.52,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Corn on the Cob',
                qNum: 'NaN',
                qElemNumber: 742,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '309.705',
                qNum: 309.70500000000004,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '11',
                qNum: 11,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$898.02',
                qNum: 898.0200000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '56.31',
                qNum: 56.31,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Cauliflower',
                qNum: 'NaN',
                qElemNumber: 53,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '173.25',
                qNum: 173.25,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '18',
                qNum: 18,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,733.60',
                qNum: 1733.6,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '19.25',
                qNum: 19.25,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Cantelope',
                qNum: 'NaN',
                qElemNumber: 185,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '362.925',
                qNum: 362.925,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '28',
                qNum: 28,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,501.32',
                qNum: 2501.3199999999993,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '48.39',
                qNum: 48.39,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Canned Peanuts',
                qNum: 'NaN',
                qElemNumber: 211,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '6819.75',
                qNum: 6819.75,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '299',
                qNum: 299,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$6,686.30',
                qNum: 6686.3,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '90.93',
                qNum: 90.93,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Broccoli',
                qNum: 'NaN',
                qElemNumber: 255,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '934.725',
                qNum: 934.725,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4007',
                qNum: 4007,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$4,610.20',
                qNum: 4610.19999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '6.05',
                qNum: 6.05,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Beets',
                qNum: 'NaN',
                qElemNumber: 803,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '127.845',
                qNum: 127.845,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '12',
                qNum: 12,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$5,478.46',
                qNum: 5478.46,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '255.69',
                qNum: 255.69,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Baby Onion',
                qNum: 'NaN',
                qElemNumber: 718,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '92.105',
                qNum: 92.105,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '37',
                qNum: 37,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$699.23',
                qNum: 699.2299999999998,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '14.17',
                qNum: 14.17,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Asparagus',
                qNum: 'NaN',
                qElemNumber: 228,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '50.54',
                qNum: 50.54,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '42',
                qNum: 42,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,722.69',
                qNum: 1722.69,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '25.27',
                qNum: 25.27,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tell Tale Almonds',
                qNum: 'NaN',
                qElemNumber: 260,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1056.5',
                qNum: 1056.5,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '675',
                qNum: 675,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$18,102.92',
                qNum: 18102.920000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '21.13',
                qNum: 21.13,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Swell Canned Peaches',
                qNum: 'NaN',
                qElemNumber: 753,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '3690.75',
                qNum: 3690.75,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '5249',
                qNum: 5249,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$370.50',
                qNum: 370.5,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '7.03',
                qNum: 7.03,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Swell Canned Mixed Fruit',
                qNum: 'NaN',
                qElemNumber: 234,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '5682.64',
                qNum: 5682.64,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '7922',
                qNum: 7922,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$1,902.09',
                qNum: 1902.0900000000004,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '10.04',
                qNum: 10.040000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super White Sugar',
                qNum: 'NaN',
                qElemNumber: 130,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1929.375',
                qNum: 1929.375,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '364',
                qNum: 364,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$9,327.61',
                qNum: 9327.609999999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '30.87',
                qNum: 30.87,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Vegetable Oil',
                qNum: 'NaN',
                qElemNumber: 83,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '9040.95',
                qNum: 9040.949999999999,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1093',
                qNum: 1093,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$9,437.76',
                qNum: 9437.759999999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '16.29',
                qNum: 16.29,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Tomato Sauce',
                qNum: 'NaN',
                qElemNumber: 669,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '69.485',
                qNum: 69.485,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '26',
                qNum: 26,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$693.78',
                qNum: 693.7800000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '10.69',
                qNum: 10.69,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Strawberry Preserves',
                qNum: 'NaN',
                qElemNumber: 308,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '284.955',
                qNum: 284.95500000000004,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '52',
                qNum: 52,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$11,433.13',
                qNum: 11433.129999999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '51.81',
                qNum: 51.81,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Strawberry Jelly',
                qNum: 'NaN',
                qElemNumber: 746,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '220.01',
                qNum: 220.01,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '14',
                qNum: 14,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$640.09',
                qNum: 640.09,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '31.43',
                qNum: 31.43,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Strawberry Jam',
                qNum: 'NaN',
                qElemNumber: 812,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'purple',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '5537.5',
                qNum: 5537.5,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1',
                qNum: 1,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$110.75',
                qNum: 110.75,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '110.75',
                qNum: 110.75,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Sesame Oil',
                qNum: 'NaN',
                qElemNumber: 90,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1657.5',
                qNum: 1657.5,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '2209',
                qNum: 2209,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$6,761.02',
                qNum: 6761.0199999999995,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '3',
                qNum: 3,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Salt',
                qNum: 'NaN',
                qElemNumber: 196,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4560.555',
                qNum: 4560.555,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '850',
                qNum: 850,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$5,181.76',
                qNum: 5181.760000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '132.19',
                qNum: 132.19,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Regular Coffee',
                qNum: 'NaN',
                qElemNumber: 153,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '1361.415',
                qNum: 1361.415,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '110',
                qNum: 110,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$2,382.70',
                qNum: 2382.7000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '24.53',
                qNum: 24.53,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Pepper',
                qNum: 'NaN',
                qElemNumber: 577,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'orange',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '176.625',
                qNum: 176.625,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '13',
                qNum: 13,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '$68.70',
                qNum: 68.7,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '4.71',
                qNum: 4.71,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
          ],
          qTails: [
            {
              qUp: 0,
              qDown: 0,
            },
          ],
          qArea: {
            qLeft: 0,
            qTop: 0,
            qWidth: 5,
            qHeight: 100,
          },
        },
      ],
    },
  ],
});
