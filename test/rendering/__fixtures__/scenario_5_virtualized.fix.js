export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'BkSmDZ',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 4,
            qcy: 825,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: 'Product',
              qApprMaxGlyphCount: 37,
              qCardinal: 824,
              qSortIndicator: 'A',
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
                qHypercubeCardinal: 825,
                qAllValuesCardinal: -1,
              },
              qLibraryId: 'pmresb',
              title: 'Product',
              othersLabel: 'Others',
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              columnWidth: {
                type: 'pixels',
                pixels: 120,
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
                  qFallbackTitle: "if(Sum(StockOH*CostPrice) < 200, '#ff0000', '#00ff00')",
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
                type: 'pixels',
                pixels: 120,
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
                type: 'pixels',
                pixels: 120,
                percentage: 20,
              },
              cId: 'ELmxjV',
              isCustomFormatted: false,
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
                type: 'pixels',
                pixels: 120,
                percentage: 20,
              },
              cId: 'RKDGbH',
            },
            {
              qApprMaxGlyphCount: 0,
              qCardinal: 0,
              qSortIndicator: 'N',
              qNumFormat: {
                qType: 'U',
                qnDec: 10,
                qUseThou: 0,
              },
              qMin: 0,
              qMax: 0,
              qError: {
                qErrorCode: 7005,
              },
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
                type: 'pixels',
                pixels: 120,
                percentage: 20,
              },
              cId: 'THhQNtm',
            },
          ],
          qEffectiveInterColumnSortOrder: [0, 1, 2, 3],
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
          ],
          qPivotDataPages: [],
          qStackedDataPages: [],
          qMode: 'S',
          qNoOfLeftDims: -1,
          qTreeNodesOnDim: [],
          qColumnOrder: [0, 1, 2, 3, 4],
        },
        showTitles: true,
        title: 'scenario_5',
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
                index: 10,
                color: '#578b60',
              },
            },
            content: {
              fontSize: 22,
              fontColor: {
                index: 3,
                color: '#a54343',
              },
              hoverEffect: true,
              hoverColor: {
                index: -1,
                color: '#709113',
              },
              hoverFontColor: {
                index: 14,
                color: '#65d3da',
              },
            },
          },
        ],
        totals: {
          show: false,
          position: 'top',
          label: '',
        },
        usePagination: false,
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
        },
      },
      getHyperCubeData: [
        {
          qMatrix: [
            [
              {
                qText: 'American Beef Bologna',
                qNum: 'NaN',
                qElemNumber: 532,
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
                qText: '356.7',
                qNum: 356.7,
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
                qText: '256',
                qNum: 256,
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
                qText: '$1,732.26',
                qNum: 1732.2599999999995,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Chicken Hot Dogs',
                qNum: 'NaN',
                qElemNumber: 507,
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
                qText: '195.5',
                qNum: 195.5,
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
                qText: '$1,931.97',
                qNum: 1931.9700000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Cole Slaw',
                qNum: 'NaN',
                qElemNumber: 334,
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
                qText: '125',
                qNum: 125,
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
                qText: '351',
                qNum: 351,
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
                qText: '$190.11',
                qNum: 190.11000000000004,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Corned Beef',
                qNum: 'NaN',
                qElemNumber: 396,
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
                qText: '3524.1',
                qNum: 3524.1000000000004,
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
                qText: '614',
                qNum: 614,
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
                qText: '$3,878.35',
                qNum: 3878.3500000000004,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Foot-Long Hot Dogs',
                qNum: 'NaN',
                qElemNumber: 535,
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
                qText: '35',
                qNum: 35,
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
                qText: '$533.80',
                qNum: 533.8000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Low Fat Cole Slaw',
                qNum: 'NaN',
                qElemNumber: 536,
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
                qText: '344.85',
                qNum: 344.85,
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
                qText: '$72.53',
                qNum: 72.53,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Pimento Loaf',
                qNum: 'NaN',
                qElemNumber: 415,
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
                qText: '501.38',
                qNum: 501.38,
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
                qText: '$4,569.08',
                qNum: 4569.08,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Potato Salad',
                qNum: 'NaN',
                qElemNumber: 163,
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
                qText: '1520.4',
                qNum: 1520.4,
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
                qText: '$10,201.60',
                qNum: 10201.6,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Roasted Chicken',
                qNum: 'NaN',
                qElemNumber: 509,
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
                qText: '377.85',
                qNum: 377.85,
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
                qText: '91',
                qNum: 91,
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
                qText: '$2,057.00',
                qNum: 2057,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Sliced Chicken',
                qNum: 'NaN',
                qElemNumber: 788,
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
                qText: '6.285',
                qNum: 6.285,
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
                qText: '4',
                qNum: 4,
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
                qText: '$50.27',
                qNum: 50.27,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Sliced Ham',
                qNum: 'NaN',
                qElemNumber: 741,
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
                qText: '13.775',
                qNum: 13.775,
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
                qText: '$723.51',
                qNum: 723.5100000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'American Turkey Hot Dogs',
                qNum: 'NaN',
                qElemNumber: 641,
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
                qText: '74.34',
                qNum: 74.34,
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
                qText: '24',
                qNum: 24,
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
                qText: '$813.12',
                qNum: 813.1199999999999,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Applause Canned Mixed Fruit',
                qNum: 'NaN',
                qElemNumber: 11,
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
                qText: '1685.25',
                qNum: 1685.25,
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
                qText: '290',
                qNum: 290,
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
                qText: '$8,122.82',
                qNum: 8122.819999999987,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Applause Canned Peaches',
                qNum: 'NaN',
                qElemNumber: 614,
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
                qText: '16.665',
                qNum: 16.665000000000003,
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
                qText: '94',
                qNum: 94,
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
                qText: '$402.62',
                qNum: 402.6199999999998,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic Bubble Gum',
                qNum: 'NaN',
                qElemNumber: 349,
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
                qText: '337.28',
                qNum: 337.28,
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
                qText: '131',
                qNum: 131,
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
                qText: '$14,377.78',
                qNum: 14377.780000000013,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic Malted Milk Balls',
                qNum: 'NaN',
                qElemNumber: 623,
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
                qText: '62.535',
                qNum: 62.535000000000004,
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
                qText: '$199.00',
                qNum: 199,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic Mint Chocolate Bar',
                qNum: 'NaN',
                qElemNumber: 187,
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
                qText: '9325.47',
                qNum: 9325.470000000001,
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
                qText: '640',
                qNum: 640,
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
                qText: '$206,080.24',
                qNum: 206080.2399999999,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic Mints',
                qNum: 'NaN',
                qElemNumber: 17,
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
                qText: '44.88',
                qNum: 44.88,
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
                qText: '$839.38',
                qNum: 839.3799999999995,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic Semi-Sweet Chocolate Bar',
                qNum: 'NaN',
                qElemNumber: 361,
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
                qText: '4882.9',
                qNum: 4882.900000000001,
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
                qText: '189',
                qNum: 189,
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
                qText: '$16,005.41',
                qNum: 16005.41000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic Spicy Mints',
                qNum: 'NaN',
                qElemNumber: 353,
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
                qText: '548.34',
                qNum: 548.34,
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
                qText: '674',
                qNum: 674,
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
                qText: '$30,217.09',
                qNum: 30217.08999999992,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic Tasty Candy Bar',
                qNum: 'NaN',
                qElemNumber: 466,
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
                qText: '336.55',
                qNum: 336.55,
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
                qText: '29',
                qNum: 29,
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
                qText: '$3,925.19',
                qNum: 3925.190000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Atomic White Chocolate Bar',
                qNum: 'NaN',
                qElemNumber: 678,
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
                qText: '351.88',
                qNum: 351.88,
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
                qText: '19',
                qNum: 19,
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
                qText: '$830.26',
                qNum: 830.26,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Apple Butter',
                qNum: 'NaN',
                qElemNumber: 317,
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
                qText: '2227.575',
                qNum: 2227.575,
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
                qText: '302',
                qNum: 302,
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
                qText: '$14,056.23',
                qNum: 14056.229999999994,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Apple Jam',
                qNum: 'NaN',
                qElemNumber: 302,
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
                qText: '174.25',
                qNum: 174.25,
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
                qText: '10',
                qNum: 10,
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
                qText: '$327.73',
                qNum: 327.72999999999996,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Apple Jelly',
                qNum: 'NaN',
                qElemNumber: 374,
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
                qText: '2549.4',
                qNum: 2549.4,
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
                qText: '140',
                qNum: 140,
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
                qText: '$2,157.47',
                qNum: 2157.4700000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Apple Preserves',
                qNum: 'NaN',
                qElemNumber: 381,
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
                qText: '736.89',
                qNum: 736.89,
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
                qText: '1127',
                qNum: 1127,
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
                qText: '$24,558.04',
                qNum: 24558.04000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Brown Sugar',
                qNum: 'NaN',
                qElemNumber: 372,
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
                qText: '6.715',
                qNum: 6.715,
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
                qText: '$920.37',
                qNum: 920.3700000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Canola Oil',
                qNum: 'NaN',
                qElemNumber: 761,
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
                qText: '559.23',
                qNum: 559.23,
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
                qText: '-2',
                qNum: -2,
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
                qText: '$184.16',
                qNum: 184.16,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Chunky Peanut Butter',
                qNum: 'NaN',
                qElemNumber: 139,
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
                qText: '4282.2',
                qNum: 4282.200000000001,
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
                qText: '301',
                qNum: 301,
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
                qText: '$30,058.58',
                qNum: 30058.58000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Columbian Coffee',
                qNum: 'NaN',
                qElemNumber: 555,
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
                qText: '12.36',
                qNum: 12.36,
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
                qText: '$208.13',
                qNum: 208.13000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Corn Oil',
                qNum: 'NaN',
                qElemNumber: 686,
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
                qText: '230.3',
                qNum: 230.3,
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
                qText: '16',
                qNum: 16,
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
                qText: '$962.82',
                qNum: 962.8199999999999,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Creamy Peanut Butter',
                qNum: 'NaN',
                qElemNumber: 46,
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
                qText: '5949.84',
                qNum: 5949.84,
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
                qText: '203',
                qNum: 203,
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
                qText: '$12,194.75',
                qNum: 12194.749999999998,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Decaf Coffee',
                qNum: 'NaN',
                qElemNumber: 341,
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
                qText: '126.225',
                qNum: 126.22500000000001,
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
                qText: '$742.10',
                qNum: 742.1000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Extra Chunky Peanut Butter',
                qNum: 'NaN',
                qElemNumber: 419,
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
                qText: '18551.93',
                qNum: 18551.93,
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
                qText: '120.3',
                qNum: 120.29999999999998,
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
                qText: '$14,409.48',
                qNum: 14409.480000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best French Roast Coffee',
                qNum: 'NaN',
                qElemNumber: 508,
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
                qText: '2.74',
                qNum: 2.74,
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
                qText: '4',
                qNum: 4,
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
                qText: '$22.70',
                qNum: 22.700000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Grape Jam',
                qNum: 'NaN',
                qElemNumber: 147,
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
                qText: '421.03',
                qNum: 421.03,
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
                qText: '116',
                qNum: 116,
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
                qText: '$898.91',
                qNum: 898.9100000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Grape Jelly',
                qNum: 'NaN',
                qElemNumber: 303,
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
                qText: '13572.735',
                qNum: 13572.735,
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
                qText: '$23,127.00',
                qNum: 23127.00000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Grape Preserves',
                qNum: 'NaN',
                qElemNumber: 259,
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
                qText: '733.36',
                qNum: 733.36,
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
                qText: '818',
                qNum: 818,
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
                qText: '$1,222.21',
                qNum: 1222.2100000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Hot Chocolate',
                qNum: 'NaN',
                qElemNumber: 699,
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
                qText: '25.38',
                qNum: 25.380000000000003,
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
                qText: '$214.83',
                qNum: 214.82999999999998,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Low Fat Apple Butter',
                qNum: 'NaN',
                qElemNumber: 373,
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
                qText: '18.315',
                qNum: 18.315,
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
                qText: '$1,312.30',
                qNum: 1312.3,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Oregano',
                qNum: 'NaN',
                qElemNumber: 685,
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
                qText: '207.1',
                qNum: 207.1,
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
                qText: '19',
                qNum: 19,
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
                qText: '$596.25',
                qNum: 596.25,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Pepper',
                qNum: 'NaN',
                qElemNumber: 107,
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
                qText: '-120',
                qNum: -120,
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
                qText: '$12,680.37',
                qNum: 12680.369999999997,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Regular Coffee',
                qNum: 'NaN',
                qElemNumber: 566,
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
                qText: '3854.475',
                qNum: 3854.4750000000004,
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
                qText: '5',
                qNum: 5,
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
                qText: '$122.68',
                qNum: 122.68,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Salt',
                qNum: 'NaN',
                qElemNumber: 289,
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
                qText: '257.82',
                qNum: 257.82,
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
                qText: '66',
                qNum: 66,
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
                qText: '$7,148.90',
                qNum: 7148.9,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Sesame Oil',
                qNum: 'NaN',
                qElemNumber: 519,
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
                qText: '63.855',
                qNum: 63.855,
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
                qText: '$114.58',
                qNum: 114.58000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Strawberry Jam',
                qNum: 'NaN',
                qElemNumber: 108,
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
                qText: '74.67',
                qNum: 74.67,
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
                qText: '67',
                qNum: 67,
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
                qText: '$3,163.77',
                qNum: 3163.7699999999995,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Strawberry Jelly',
                qNum: 'NaN',
                qElemNumber: 106,
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
                qText: '1454.89',
                qNum: 1454.8899999999999,
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
                qText: '287',
                qNum: 287,
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
                qText: '$13,362.64',
                qNum: 13362.639999999985,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Strawberry Preserves',
                qNum: 'NaN',
                qElemNumber: 56,
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
                qText: '4244.175',
                qNum: 4244.175,
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
                qText: '114',
                qNum: 114,
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
                qText: '$7,580.21',
                qNum: 7580.210000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Tomato Sauce',
                qNum: 'NaN',
                qElemNumber: 178,
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
                qText: '1038.785',
                qNum: 1038.785,
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
                qText: '$7,858.61',
                qNum: 7858.610000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best Vegetable Oil',
                qNum: 'NaN',
                qElemNumber: 95,
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
                qText: '1447.6',
                qNum: 1447.6000000000001,
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
                qText: '182',
                qNum: 182,
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
                qText: '$1,472.24',
                qNum: 1472.2400000000005,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'BBB Best White Sugar',
                qNum: 'NaN',
                qElemNumber: 455,
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
                qText: '1108.98',
                qNum: 1108.98,
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
                qText: '183',
                qNum: 183,
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
                qText: '$455.25',
                qNum: 455.25,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Apple Fruit Roll',
                qNum: 'NaN',
                qElemNumber: 252,
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
                qText: '675.88',
                qNum: 675.88,
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
                qText: '236',
                qNum: 236,
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
                qText: '$3,084.91',
                qNum: 3084.9100000000008,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Avocado Dip',
                qNum: 'NaN',
                qElemNumber: 704,
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
                qText: '150.15',
                qNum: 150.15,
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
                qText: '35',
                qNum: 35,
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
                qText: '$84.33',
                qNum: 84.33,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice BBQ Potato Chips',
                qNum: 'NaN',
                qElemNumber: 85,
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
                qText: '14.75',
                qNum: 14.75,
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
                qText: '$540.10',
                qNum: 540.0999999999997,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Beef Jerky',
                qNum: 'NaN',
                qElemNumber: 533,
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
                qText: '30.375',
                qNum: 30.375,
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
                qText: '325',
                qNum: 325,
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
                qText: '$622.22',
                qNum: 622.22,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Buttered Popcorn',
                qNum: 'NaN',
                qElemNumber: 462,
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
                qText: '36.06',
                qNum: 36.06,
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
                qText: '34',
                qNum: 34,
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
                qText: '$2,009.63',
                qNum: 2009.6300000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Cheese Crackers',
                qNum: 'NaN',
                qElemNumber: 768,
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
                qText: '250.38',
                qNum: 250.38000000000002,
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
                qText: '24',
                qNum: 24,
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
                qText: '$1,054.73',
                qNum: 1054.7300000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Cheese Dip',
                qNum: 'NaN',
                qElemNumber: 345,
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
                qText: '2226.75',
                qNum: 2226.75,
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
                qText: '-8',
                qNum: -8,
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
                qText: '$1,201.04',
                qNum: 1201.04,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Chocolate Chip Cookies',
                qNum: 'NaN',
                qElemNumber: 387,
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
                qText: '5920.88',
                qNum: 5920.88,
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
                qText: '217',
                qNum: 217,
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
                qText: '$23,613.61',
                qNum: 23613.610000000008,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Chocolate Donuts',
                qNum: 'NaN',
                qElemNumber: 482,
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
                qText: '122.5',
                qNum: 122.5,
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
                qText: '66',
                qNum: 66,
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
                qText: '$1,838.67',
                qNum: 1838.67,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Corn Chips',
                qNum: 'NaN',
                qElemNumber: 55,
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
                qText: '376.15',
                qNum: 376.15000000000003,
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
                qText: '47',
                qNum: 47,
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
                qText: '$5,834.80',
                qNum: 5834.800000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Dried Apples',
                qNum: 'NaN',
                qElemNumber: 780,
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
                qText: '129.965',
                qNum: 129.965,
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
                qText: '$420.28',
                qNum: 420.28000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Dried Apricots',
                qNum: 'NaN',
                qElemNumber: 172,
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
                qText: '4162.08',
                qNum: 4162.08,
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
                qText: '180',
                qNum: 180,
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
                qText: '$3,194.54',
                qNum: 3194.5399999999995,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Dried Dates',
                qNum: 'NaN',
                qElemNumber: 676,
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
                qText: '27.5',
                qNum: 27.5,
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
                qText: '69',
                qNum: 69,
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
                qText: '$144.99',
                qNum: 144.99,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Fondue Mix',
                qNum: 'NaN',
                qElemNumber: 521,
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
                qText: '162',
                qNum: 162,
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
                qText: '1946',
                qNum: 1946,
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
                qText: '$1,484.10',
                qNum: 1484.1000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Frosted Cookies',
                qNum: 'NaN',
                qElemNumber: 525,
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
                qText: '176.605',
                qNum: 176.605,
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
                qText: '$519.01',
                qNum: 519.01,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Frosted Donuts',
                qNum: 'NaN',
                qElemNumber: 7,
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
                qText: '661.47',
                qNum: 661.47,
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
                qText: '796',
                qNum: 796,
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
                qText: '$8,477.86',
                qNum: 8477.859999999988,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Fudge Brownies',
                qNum: 'NaN',
                qElemNumber: 767,
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
                qText: '372',
                qNum: 372,
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
                qText: '16',
                qNum: 16,
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
                qText: '$1,011.00',
                qNum: 1011,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Fudge Cookies',
                qNum: 'NaN',
                qElemNumber: 481,
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
                qText: '337.37',
                qNum: 337.37,
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
                qText: '83',
                qNum: 83,
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
                qText: '$5,741.61',
                qNum: 5741.610000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Golden Raisins',
                qNum: 'NaN',
                qElemNumber: 15,
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
                qText: '433.455',
                qNum: 433.455,
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
                qText: '520',
                qNum: 520,
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
                qText: '$9,657.49',
                qNum: 9657.490000000007,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Graham Crackers',
                qNum: 'NaN',
                qElemNumber: 404,
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
                qText: '997.04',
                qNum: 997.04,
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
                qText: '454',
                qNum: 454,
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
                qText: '$5,992.44',
                qNum: 5992.439999999999,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Grape Fruit Roll',
                qNum: 'NaN',
                qElemNumber: 483,
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
                qText: '36.3',
                qNum: 36.3,
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
                qText: '35',
                qNum: 35,
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
                qText: '$533.42',
                qNum: 533.4199999999998,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Lemon Cookies',
                qNum: 'NaN',
                qElemNumber: 596,
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
                qText: '15.3',
                qNum: 15.3,
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
                qText: '48',
                qNum: 48,
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
                qText: '$154.60',
                qNum: 154.6,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Low Fat BBQ Chips',
                qNum: 'NaN',
                qElemNumber: 695,
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
                qText: '446.6',
                qNum: 446.6,
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
                qText: '79',
                qNum: 79,
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
                qText: '$2,484.34',
                qNum: 2484.3399999999997,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Low Fat Chips',
                qNum: 'NaN',
                qElemNumber: 470,
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
                qText: '94.5',
                qNum: 94.5,
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
                qText: '122',
                qNum: 122,
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
                qText: '$3,369.52',
                qNum: 3369.520000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Low Fat Cookies',
                qNum: 'NaN',
                qElemNumber: 757,
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
                qText: '12.09',
                qNum: 12.09,
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
                qText: '$364.66',
                qNum: 364.66,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Low Fat Popcorn',
                qNum: 'NaN',
                qElemNumber: 113,
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
                qText: '81.84',
                qNum: 81.84,
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
                qText: '93',
                qNum: 93,
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
                qText: '$2,965.91',
                qNum: 2965.9100000000008,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Mini Donuts',
                qNum: 'NaN',
                qElemNumber: 522,
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
                qText: '113.685',
                qNum: 113.68500000000002,
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
                qText: '$703.46',
                qNum: 703.46,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice No Salt Popcorn',
                qNum: 'NaN',
                qElemNumber: 227,
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
                qText: '1013.005',
                qNum: 1013.0050000000001,
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
                qText: '302',
                qNum: 302,
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
                qText: '$3,428.00',
                qNum: 3428.0000000000023,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Potato Chips',
                qNum: 'NaN',
                qElemNumber: 692,
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
                qText: '201.465',
                qNum: 201.465,
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
                qText: '242',
                qNum: 242,
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
                qText: '$1,477.61',
                qNum: 1477.6099999999974,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Raisins',
                qNum: 'NaN',
                qElemNumber: 766,
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
                qText: '118.91',
                qNum: 118.91000000000001,
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
                qText: '66',
                qNum: 66,
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
                qText: '$1,530.80',
                qNum: 1530.8,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Salsa Dip',
                qNum: 'NaN',
                qElemNumber: 732,
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
                qText: '41.8',
                qNum: 41.800000000000004,
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
                qText: '244',
                qNum: 244,
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
                qText: '$430.74',
                qNum: 430.74,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Salted Pretzels',
                qNum: 'NaN',
                qElemNumber: 657,
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
                qText: '555.45',
                qNum: 555.45,
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
                qText: '$363.24',
                qNum: 363.2400000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Sesame Crackers',
                qNum: 'NaN',
                qElemNumber: 285,
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
                qText: '639',
                qNum: 639,
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
                qText: '$794.85',
                qNum: 794.850000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Strawberry Fruit Roll',
                qNum: 'NaN',
                qElemNumber: 752,
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
                qText: '493.5',
                qNum: 493.5,
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
                qText: '$462.76',
                qNum: 462.7599999999999,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Choice Sugar Cookies',
                qNum: 'NaN',
                qElemNumber: 433,
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
                qText: '7067.43',
                qNum: 7067.43,
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
                qText: '296',
                qNum: 296,
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
                qText: '$38,556.19',
                qNum: 38556.18999999995,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Corn Puffs',
                qNum: 'NaN',
                qElemNumber: 697,
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
                qText: '20.93',
                qNum: 20.93,
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
                qText: '5',
                qNum: 5,
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
                qText: '$306.97',
                qNum: 306.97,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Grits',
                qNum: 'NaN',
                qElemNumber: 176,
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
                qText: '1200.98',
                qNum: 1200.98,
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
                qText: '212',
                qNum: 212,
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
                qText: '$1,433.77',
                qNum: 1433.7699999999995,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Oatmeal',
                qNum: 'NaN',
                qElemNumber: 310,
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
                qText: '5331.515',
                qNum: 5331.515,
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
                qText: '155',
                qNum: 155,
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
                qText: '$10,887.68',
                qNum: 10887.679999999995,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Best Wheat Puffs',
                qNum: 'NaN',
                qElemNumber: 348,
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
                qText: '1285.38',
                qNum: 1285.38,
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
                qText: '324',
                qNum: 324,
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
                qText: '$5,477.75',
                qNum: 5477.750000000004,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Beef Soup',
                qNum: 'NaN',
                qElemNumber: 777,
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
                qText: '16497.91',
                qNum: 16497.91,
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
                qText: '1703',
                qNum: 1703,
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
                qText: '$4,649.04',
                qNum: 4649.040000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Canned Beets',
                qNum: 'NaN',
                qElemNumber: 488,
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
                qText: '965.52',
                qNum: 965.52,
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
                qText: '$808.29',
                qNum: 808.2900000000005,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Canned Peas',
                qNum: 'NaN',
                qElemNumber: 441,
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
                qText: '42.965',
                qNum: 42.965,
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
                qText: '5',
                qNum: 5,
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
                qText: '$2,228.40',
                qNum: 2228.4,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Canned String Beans',
                qNum: 'NaN',
                qElemNumber: 86,
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
                qText: '421.27',
                qNum: 421.27,
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
                qText: '696',
                qNum: 696,
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
                qText: '$3,062.42',
                qNum: 3062.4200000000046,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Canned Tomatos',
                qNum: 'NaN',
                qElemNumber: 789,
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
                qText: '9.31',
                qNum: 9.31,
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
                qText: '3',
                qNum: 3,
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
                qText: '$86.60',
                qNum: 86.60000000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Canned Tuna in Oil',
                qNum: 'NaN',
                qElemNumber: 728,
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
                qText: '477.02',
                qNum: 477.02000000000004,
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
                qText: '367',
                qNum: 367,
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
                qText: '$676.39',
                qNum: 676.3900000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Canned Tuna in Water',
                qNum: 'NaN',
                qElemNumber: 77,
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
                qText: '267.4',
                qNum: 267.40000000000003,
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
                qText: '$6,402.35',
                qNum: 6402.350000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Canned Yams',
                qNum: 'NaN',
                qElemNumber: 764,
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
                qText: '432.905',
                qNum: 432.905,
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
                qText: '$515.02',
                qNum: 515.02,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Chicken Noodle Soup',
                qNum: 'NaN',
                qElemNumber: 503,
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
                qText: '357',
                qNum: 357,
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
                qText: '$1,771.74',
                qNum: 1771.7399999999996,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Chicken Ramen Soup',
                qNum: 'NaN',
                qElemNumber: 523,
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
                qText: '1314.5',
                qNum: 1314.5,
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
                qText: '10',
                qNum: 10,
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
                qText: '$387.76',
                qNum: 387.76,
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
            qWidth: 4,
            qHeight: 100,
          },
        },
      ],
    },
  ],
});
