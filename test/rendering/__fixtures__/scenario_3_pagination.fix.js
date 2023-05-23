export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'rJNJae',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 5,
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
                auto: false,
                align: 'center',
              },
              columnWidth: {
                type: 'pixels',
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
          qEffectiveInterColumnSortOrder: [1, 0, 2, 3, 4],
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
        showTitles: true,
        title: 'scenario_3',
        subtitle: 'pagination table',
        footnote: '',
        disableNavMenu: false,
        showDetails: true,
        showDetailsExpression: false,
        components: [
          {
            key: 'general',
            title: {
              main: {
                fontFamily: 'QlikView Sans, sans-serif',
                fontStyle: ['bold'],
                fontSize: '15pxpx',
                color: {
                  index: -1,
                  color: '#444444',
                },
              },
              subTitle: {
                fontFamily: 'QlikView Sans, sans-serif',
                fontSize: '12pxpx',
                color: {
                  index: -1,
                  color: '#8b8b8b',
                },
                fontStyle: [''],
              },
              footer: {
                fontStyle: ['italic'],
                fontFamily: 'QlikView Sans, sans-serif',
                fontSize: '12pxpx',
                color: {
                  index: -1,
                  color: '#8b8b8b',
                },
              },
            },
          },
          {
            key: 'theme',
            header: {
              fontSize: 10,
              fontColor: {
                index: 10,
                color: '#578b60',
              },
            },
            content: {
              fontSize: 8,
              fontColor: {
                index: 3,
                color: '#a54343',
              },
              hoverEffect: true,
              hoverColor: {
                index: 3,
                color: '#a54343',
              },
            },
          },
        ],
        totals: {
          show: false,
          position: 'noTotals',
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
                qText: 'Big Time Turkey TV Dinner',
                qNum: 'NaN',
                qElemNumber: 207,
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
                qText: '-123',
                qNum: -123,
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
                qText: '$413.89',
                qNum: 413.8899999999998,
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
                qText: 'Blue Label Canned Peas',
                qNum: 'NaN',
                qElemNumber: 622,
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
                qText: '58097',
                qNum: 58097,
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
                qText: '$57.00',
                qNum: 57,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Bravo Fancy Canned Clams',
                qNum: 'NaN',
                qElemNumber: 476,
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
                qText: '-11',
                qNum: -11,
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
                qText: '$838.23',
                qNum: 838.2300000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '31.4',
                qNum: 31.400000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Discover Manicotti',
                qNum: 'NaN',
                qElemNumber: 104,
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
                qText: '1714',
                qNum: 1714,
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
                qText: '$171,364.97',
                qNum: 171364.9700000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '289.91',
                qNum: 289.91,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Even Better Cheese Spread',
                qNum: 'NaN',
                qElemNumber: 683,
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
                qText: '6565',
                qNum: 6565,
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
                qText: '$920.64',
                qNum: 920.6399999999995,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '9.22',
                qNum: 9.22,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'High Top Shitake Mushrooms',
                qNum: 'NaN',
                qElemNumber: 112,
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
                qText: '-21',
                qNum: -21,
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
                qText: '$446.77',
                qNum: 446.77,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '10.25',
                qNum: 10.25,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'High Top Walnuts',
                qNum: 'NaN',
                qElemNumber: 134,
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
                qText: '1435',
                qNum: 1435,
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
                qText: '$93,533.67',
                qNum: 93533.66999999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '49.81',
                qNum: 49.81,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Medalist Manicotti',
                qNum: 'NaN',
                qElemNumber: 703,
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
                qText: '2',
                qNum: 2,
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
                qText: '$0.00',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Nationeel Avocado Dip',
                qNum: 'NaN',
                qElemNumber: 10,
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
                qText: '740',
                qNum: 740,
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
                qText: '$55,905.49',
                qNum: 55905.48999999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '72.2',
                qNum: 72.2,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Apple Jam',
                qNum: 'NaN',
                qElemNumber: 612,
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
                qText: '2',
                qNum: 2,
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
                qText: '$0.00',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Super Extra Chunky Peanut Butter',
                qNum: 'NaN',
                qElemNumber: 309,
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
                qText: '-1',
                qNum: -1,
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
                qText: '$2,425.71',
                qNum: 2425.71,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '41.77',
                qNum: 41.77,
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
                qText: '-',
                qNum: 'NaN',
                qElemNumber: -2,
                qState: 'L',
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
                qIsNull: true,
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
                qText: '$0.00',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0',
                qNum: 0,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Gorilla Large Curd Cottage Cheese',
                qNum: 'NaN',
                qElemNumber: 598,
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
                qText: '0.31',
                qNum: 0.31,
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
                qText: '6',
                qNum: 6,
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
                qText: '$11.74',
                qNum: 11.740000000000002,
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
                qText: 'Colony Rye Bread',
                qNum: 'NaN',
                qElemNumber: 627,
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
                qText: '0.445',
                qNum: 0.445,
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
                qText: '$391.90',
                qNum: 391.9,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.89',
                qNum: 0.89,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Fast Mini Donuts',
                qNum: 'NaN',
                qElemNumber: 822,
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
                qText: '0.71',
                qNum: 0.71,
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
                qText: '$4.25',
                qNum: 4.25,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '1.42',
                qNum: 1.42,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'High Top Prepared Salad',
                qNum: 'NaN',
                qElemNumber: 821,
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
                qText: '0.915',
                qNum: 0.915,
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
                qText: '$16.38',
                qNum: 16.38,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '1.83',
                qNum: 1.83,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Nationeel Apple Fruit Roll',
                qNum: 'NaN',
                qElemNumber: 637,
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
                qText: '0.95',
                qNum: 0.95,
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
                qText: '$17.29',
                qNum: 17.29,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.19',
                qNum: 0.19,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Carlson Sharp Cheddar Cheese',
                qNum: 'NaN',
                qElemNumber: 493,
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
                qText: '$892.80',
                qNum: 892.8000000000001,
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
                qText: 'Fabulous Berry Juice',
                qNum: 'NaN',
                qElemNumber: 714,
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
                qText: '2',
                qNum: 2,
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
                qText: '$43.02',
                qNum: 43.02,
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
                qText: 'Fast Cheese Crackers',
                qNum: 'NaN',
                qElemNumber: 528,
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
                qText: '$972.66',
                qNum: 972.6600000000002,
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
                qText: 'High Top Almonds',
                qNum: 'NaN',
                qElemNumber: 740,
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
                qText: '6',
                qNum: 6,
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
                qText: '$1,998.90',
                qNum: 1998.9,
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
                qText: 'Imagine Frozen Chicken Breast',
                qNum: 'NaN',
                qElemNumber: 210,
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
                qText: '$598.21',
                qNum: 598.2099999999999,
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
                qText: 'Moms Foot-Long Hot Dogs',
                qNum: 'NaN',
                qElemNumber: 516,
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
                qText: '$1,093.54',
                qNum: 1093.54,
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
                qText: 'Gorilla Low Fat Sour Cream',
                qNum: 'NaN',
                qElemNumber: 607,
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
                qText: '1.3',
                qNum: 1.3,
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
                qText: '$13.86',
                qNum: 13.86,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.6',
                qNum: 2.6,
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
                qText: 'Ebony Limes',
                qNum: 'NaN',
                qElemNumber: 656,
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
                qText: '2.2',
                qNum: 2.2,
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
                qText: '$228.06',
                qNum: 228.06,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.4',
                qNum: 0.4,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Chicken Soup',
                qNum: 'NaN',
                qElemNumber: 806,
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
                qText: '2.27',
                qNum: 2.27,
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
                qText: '$18.16',
                qNum: 18.16,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '4.54',
                qNum: 4.54,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Club 2% Milk',
                qNum: 'NaN',
                qElemNumber: 694,
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
                qText: '2.38',
                qNum: 2.3800000000000003,
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
                qText: '$61.01',
                qNum: 61.010000000000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.34',
                qNum: 0.34,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Club Strawberry Yogurt',
                qNum: 'NaN',
                qElemNumber: 648,
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
                qText: '2.525',
                qNum: 2.5250000000000004,
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
                qText: '99',
                qNum: 99,
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
                qText: '$163.86',
                qNum: 163.86,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.05',
                qNum: 0.05,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Big City Canned Peaches',
                qNum: 'NaN',
                qElemNumber: 635,
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
                qText: '2.55',
                qNum: 2.5500000000000003,
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
                qText: '$10.32',
                qNum: 10.32,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.05',
                qNum: 0.05,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Nationeel Strawberry Fruit Roll',
                qNum: 'NaN',
                qElemNumber: 400,
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
                qText: '2.585',
                qNum: 2.585,
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
                qText: '$9.21',
                qNum: 9.209999999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.47',
                qNum: 0.47000000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Imagine Frozen Chicken Thighs',
                qNum: 'NaN',
                qElemNumber: 755,
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
                qText: '2.7',
                qNum: 2.7,
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
                qText: '30',
                qNum: 30,
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
                qText: '$52.62',
                qNum: 52.620000000000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.45',
                qNum: 0.45,
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
              {
                qText: '5.48',
                qNum: 5.48,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Ebony Mandarin Oranges',
                qNum: 'NaN',
                qElemNumber: 729,
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
                qText: '3.115',
                qNum: 3.115,
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
                qText: '$31.15',
                qNum: 31.150000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '6.23',
                qNum: 6.23,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Fast Dried Dates',
                qNum: 'NaN',
                qElemNumber: 571,
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
                qText: '3.2',
                qNum: 3.2,
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
                qText: '$9.30',
                qNum: 9.3,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.64',
                qNum: 0.64,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Carlson Large Curd Cottage Cheese',
                qNum: 'NaN',
                qElemNumber: 370,
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
                qText: '3.395',
                qNum: 3.395,
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
                qText: '-5',
                qNum: -5,
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
                qText: '$4,536.55',
                qNum: 4536.549999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '6.79',
                qNum: 6.79,
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
                qText: 'Nationeel Dried Apples',
                qNum: 'NaN',
                qElemNumber: 793,
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
                qText: '4.755',
                qNum: 4.755,
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
                qText: '$92.43',
                qNum: 92.43,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '9.51',
                qNum: 9.51,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Bravo Chicken Noodle Soup',
                qNum: 'NaN',
                qElemNumber: 810,
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
                qText: '5.02',
                qNum: 5.0200000000000005,
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
                qText: '$70.25',
                qNum: 70.25,
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
                qText: 'Better Turkey Noodle Soup',
                qNum: 'NaN',
                qElemNumber: 253,
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
                qText: '5.04',
                qNum: 5.04,
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
                qText: '137',
                qNum: 137,
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
                qText: '$316.36',
                qNum: 316.36,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.72',
                qNum: 0.72,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Creamed Corn',
                qNum: 'NaN',
                qElemNumber: 805,
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
                qText: '5.355',
                qNum: 5.355,
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
                qText: '$302.28',
                qNum: 302.28,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '10.71',
                qNum: 10.71,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Golden Frozen Carrots',
                qNum: 'NaN',
                qElemNumber: 610,
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
                qText: '5.425',
                qNum: 5.425000000000001,
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
                qText: '1068',
                qNum: 1068,
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
                qText: '$271.28',
                qNum: 271.28000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.07',
                qNum: 0.07,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Gorilla Buttermilk',
                qNum: 'NaN',
                qElemNumber: 238,
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
                qText: '5.665',
                qNum: 5.665,
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
                qText: '2',
                qNum: 2,
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
                qText: '$209.41',
                qNum: 209.41000000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '11.33',
                qNum: 11.33,
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
              {
                qText: '12.57',
                qNum: 12.57,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Excellent Strawberry Drink',
                qNum: 'NaN',
                qElemNumber: 816,
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
                qText: '6.68',
                qNum: 6.68,
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
                qText: '2',
                qNum: 2,
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
                qText: '$26.72',
                qNum: 26.720000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '13.36',
                qNum: 13.36,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Jumbo Large Brown Eggs',
                qNum: 'NaN',
                qElemNumber: 801,
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
                qText: '6.68',
                qNum: 6.68,
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
                qText: '6',
                qNum: 6,
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
                qText: '$80.15',
                qNum: 80.14999999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '13.36',
                qNum: 13.36,
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
              {
                qText: '0.79',
                qNum: 0.79,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Just Right Chicken Noodle Soup',
                qNum: 'NaN',
                qElemNumber: 820,
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
                qText: '6.745',
                qNum: 6.745,
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
                qText: '$40.46',
                qNum: 40.46,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '13.49',
                qNum: 13.49,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Nationeel Buttered Popcorn',
                qNum: 'NaN',
                qElemNumber: 784,
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
                qText: '6.96',
                qNum: 6.96,
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
                qText: '32',
                qNum: 32,
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
                qText: '$61.89',
                qNum: 61.89,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '6.96',
                qNum: 6.96,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'High Top Red Pepper',
                qNum: 'NaN',
                qElemNumber: 431,
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
                qText: '7.79',
                qNum: 7.79,
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
                qText: '$51.69',
                qNum: 51.69,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '15.58',
                qNum: 15.58,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Big Time Frozen Chicken Breast',
                qNum: 'NaN',
                qElemNumber: 59,
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
                qText: '7.97',
                qNum: 7.97,
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
                qText: '$1,121.74',
                qNum: 1121.7399999999998,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '15.94',
                qNum: 15.94,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Ship Shape Extra Lean Hamburger',
                qNum: 'NaN',
                qElemNumber: 306,
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
                qText: '8.095',
                qNum: 8.095,
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
                qText: '$2,300.02',
                qNum: 2300.02,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '16.19',
                qNum: 16.19,
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
                qText: 'Shady Lake Ravioli',
                qNum: 'NaN',
                qElemNumber: 762,
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
                qText: '9.17',
                qNum: 9.17,
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
                qText: '$36.78',
                qNum: 36.779999999999994,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '1.31',
                qNum: 1.31,
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
              {
                qText: '18.62',
                qNum: 18.62,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Cutting Edge Sliced Chicken',
                qNum: 'NaN',
                qElemNumber: 759,
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
                qText: '9.86',
                qNum: 9.86,
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
                qText: '$78.88',
                qNum: 78.88,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '19.72',
                qNum: 19.72,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Carlson Muenster Cheese',
                qNum: 'NaN',
                qElemNumber: 620,
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
                qText: '$2,547.58',
                qNum: 2547.58,
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
                qText: 'Club Mild Cheddar Cheese',
                qNum: 'NaN',
                qElemNumber: 726,
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
                qText: '$119.86',
                qNum: 119.86,
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
                qText: 'Club Whole Milk',
                qNum: 'NaN',
                qElemNumber: 589,
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
                qText: '$39.24',
                qNum: 39.24,
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
                qText: 'Ebony Broccoli',
                qNum: 'NaN',
                qElemNumber: 651,
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
                qText: '$2,060.54',
                qNum: 2060.54,
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
                qText: 'Fast Sugar Cookies',
                qNum: 'NaN',
                qElemNumber: 428,
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
                qText: '$4,526.30',
                qNum: 4526.299999999999,
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
                qText: 'Landslide Tomato Sauce',
                qNum: 'NaN',
                qElemNumber: 817,
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
                qText: '10.845',
                qNum: 10.845,
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
                qText: '$95.73',
                qNum: 95.73,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '21.69',
                qNum: 21.69,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Big Time Frozen Cauliflower',
                qNum: 'NaN',
                qElemNumber: 473,
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
                qText: '$446.99',
                qNum: 446.99000000000007,
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
                qText: 'Carlson Chocolate Milk',
                qNum: 'NaN',
                qElemNumber: 496,
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
                qText: '$2,065.63',
                qNum: 2065.63,
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
                qText: 'Even Better Muenster Cheese',
                qNum: 'NaN',
                qElemNumber: 561,
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
                qText: '$431.30',
                qNum: 431.29999999999995,
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
                qText: 'Imagine Frozen Cauliflower',
                qNum: 'NaN',
                qElemNumber: 754,
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
                qText: '$139.05',
                qNum: 139.04999999999998,
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
                qText: 'Fast Salted Pretzels',
                qNum: 'NaN',
                qElemNumber: 696,
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
                qText: '11.525',
                qNum: 11.525,
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
                qText: '$623.76',
                qNum: 623.76,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '23.05',
                qNum: 23.05,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Big Time Popsicles',
                qNum: 'NaN',
                qElemNumber: 586,
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
                qText: '11.895',
                qNum: 11.895,
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
                qText: '$416.06',
                qNum: 416.06000000000006,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '23.79',
                qNum: 23.79,
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
              {
                qText: '2',
                qNum: 2,
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
              {
                qText: '24.18',
                qNum: 24.18,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Golden Frozen Chicken Breast',
                qNum: 'NaN',
                qElemNumber: 545,
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
                qText: '12.175',
                qNum: 12.175,
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
                qText: '1947',
                qNum: 1947,
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
                qText: '$1,493.66',
                qNum: 1493.6600000000003,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '0.01',
                qNum: 0.01,
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
              {
                qText: '8.24',
                qNum: 8.24,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Carlson Strawberry Yogurt',
                qNum: 'NaN',
                qElemNumber: 498,
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
                qText: '12.425',
                qNum: 12.425,
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
                qText: '$3,077.80',
                qNum: 3077.8,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '24.85',
                qNum: 24.85,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Bravo Canned Tuna in Water',
                qNum: 'NaN',
                qElemNumber: 475,
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
                qText: '12.655',
                qNum: 12.655000000000001,
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
                qText: '$459.76',
                qNum: 459.76000000000005,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '25.31',
                qNum: 25.310000000000002,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Big Time Frozen Chicken Wings',
                qNum: 'NaN',
                qElemNumber: 712,
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
                qText: '12.66',
                qNum: 12.66,
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
                qText: '$90.59',
                qNum: 90.59,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '4.22',
                qNum: 4.22,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Green Ribbon Canned Peaches',
                qNum: 'NaN',
                qElemNumber: 578,
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
                qText: '$427.81',
                qNum: 427.81,
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
                qText: 'Imagine Lime Popsicles',
                qNum: 'NaN',
                qElemNumber: 679,
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
                qText: '13.15',
                qNum: 13.149999999999999,
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
                qText: '$269.09',
                qNum: 269.0900000000001,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.63',
                qNum: 2.63,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Ebony Party Nuts',
                qNum: 'NaN',
                qElemNumber: 463,
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
                qText: '13.585',
                qNum: 13.585,
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
                qText: '84',
                qNum: 84,
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
                qText: '$599.95',
                qNum: 599.9499999999999,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.47',
                qNum: 2.47,
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
              {
                qText: '27.55',
                qNum: 27.55,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Better Regular Ramen Soup',
                qNum: 'NaN',
                qElemNumber: 717,
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
                qText: '27',
                qNum: 27,
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
                qText: '$88.12',
                qNum: 88.12,
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
                qText: 'Blue Label Fancy Canned Clams',
                qNum: 'NaN',
                qElemNumber: 537,
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
                qText: '$2,586.55',
                qNum: 2586.55,
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
                qText: 'Fantastic Blueberry Muffins',
                qNum: 'NaN',
                qElemNumber: 454,
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
                qText: '$2,859.43',
                qNum: 2859.430000000001,
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
                qText: 'Red Spade Chicken Hot Dogs',
                qNum: 'NaN',
                qElemNumber: 559,
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
                qText: '$42.02',
                qNum: 42.02000000000001,
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
                qText: 'Blue Label Beef Soup',
                qNum: 'NaN',
                qElemNumber: 636,
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
                qText: '14.7',
                qNum: 14.700000000000001,
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
                qText: '46',
                qNum: 46,
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
                qText: '$149.83',
                qNum: 149.82999999999998,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.45',
                qNum: 2.45,
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
              {
                qText: '2.95',
                qNum: 2.95,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Excellent Apple Juice',
                qNum: 'NaN',
                qElemNumber: 797,
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
                qText: '14.77',
                qNum: 14.77,
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
                qText: '$12.84',
                qNum: 12.84,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.11',
                qNum: 2.11,
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
                qText: 'Big Time Blueberry Waffles',
                qNum: 'NaN',
                qElemNumber: 606,
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
                qText: '14.85',
                qNum: 14.850000000000001,
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
                qText: '76',
                qNum: 76,
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
                qText: '$124.36',
                qNum: 124.36,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.97',
                qNum: 2.97,
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
              {
                qText: '2',
                qNum: 2,
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
              {
                qText: '0.3',
                qNum: 0.3,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Just Right Canned String Beans',
                qNum: 'NaN',
                qElemNumber: 534,
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
                qText: '15.19',
                qNum: 15.19,
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
                qText: '$44.38',
                qNum: 44.379999999999995,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '2.17',
                qNum: 2.17,
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
              {
                qText: '3.06',
                qNum: 3.06,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'High Top Elephant Garlic',
                qNum: 'NaN',
                qElemNumber: 815,
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
                qText: '15.49',
                qNum: 15.49,
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
                qText: '$212.56',
                qNum: 212.56,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '30.98',
                qNum: 30.98,
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
