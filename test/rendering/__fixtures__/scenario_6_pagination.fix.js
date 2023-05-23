export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'pJkBWu',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 3,
            qcy: 7,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: 'Region',
              qApprMaxGlyphCount: 11,
              qCardinal: 6,
              qSortIndicator: 'A',
              qGroupFallbackTitles: ['Region'],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 6,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ['$ascii', '$text'],
              qDimensionType: 'D',
              qGrouping: 'N',
              qNumFormat: {
                qType: 'U',
                qnDec: 0,
                qUseThou: 0,
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ['Region'],
              qMin: 'NaN',
              qMax: 'NaN',
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 6,
                qHypercubeCardinal: 7,
                qAllValuesCardinal: -1,
              },
              qLibraryId: 'jgxpDbw',
              title: 'Region',
              othersLabel: 'Others',
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
              cId: 'GPjFh',
            },
          ],
          qMeasureInfo: [
            {
              qFallbackTitle: 'Budget',
              qApprMaxGlyphCount: 11,
              qCardinal: 0,
              qSortIndicator: 'D',
              qNumFormat: {
                qType: 'R',
                qnDec: 0,
                qUseThou: 0,
                qFmt: '##############',
                qDec: '.',
                qThou: ',',
              },
              qMin: 0,
              qMax: 22618.240500000098,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qLibraryId: 'VjxMHP',
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
              cId: 'CjPkP',
            },
            {
              qFallbackTitle: '# of Customers',
              qApprMaxGlyphCount: 3,
              qCardinal: 0,
              qSortIndicator: 'D',
              qNumFormat: {
                qType: 'I',
                qnDec: 0,
                qUseThou: 1,
                qFmt: '###0',
                qDec: '.',
              },
              qMin: 0,
              qMax: 79,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qLibraryId: 'DSrjAGm',
              qTrendLines: [],
              coloring: {
                gradient: {
                  colors: [
                    {
                      color: '#ecc43d',
                      index: 6,
                    },
                    {
                      color: '#578b60',
                      index: 10,
                    },
                  ],
                  breakTypes: [false],
                  limits: [0.219],
                  limitType: 'percent',
                },
              },
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
              cId: 'dRTmSEj',
            },
          ],
          qEffectiveInterColumnSortOrder: [0, 1, 2],
          qGrandTotalRow: [
            {
              qText: '49609.47729',
              qNum: 49609.47729000036,
              qElemNumber: -1,
              qState: 'X',
              qIsTotalCell: true,
            },
            {
              qText: '130',
              qNum: 130,
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
          qColumnOrder: [0, 1, 2],
        },
        showTitles: true,
        title: 'scenario_6',
        subtitle: 'pagination table',
        footnote: 'less than 100 rows hides the pagination footer',
        disableNavMenu: false,
        showDetails: true,
        showDetailsExpression: false,
        components: [
          {
            key: 'general',
            title: {
              main: {
                fontStyle: ['bold', 'italic', 'underline'],
                fontSize: '20pxpx',
                color: {
                  index: -1,
                  color: '#8b8b8b',
                },
                fontFamily: 'Bradley Hand, cursive',
              },
              subTitle: {
                fontStyle: ['', 'bold', 'italic', 'underline'],
                fontSize: '15pxpx',
                color: {
                  index: 9,
                  color: '#70ba6e',
                },
                fontFamily: 'Arial Black, sans-serif',
              },
              footer: {
                fontStyle: ['italic', 'bold', 'underline'],
                fontSize: '15pxpx',
                color: {
                  index: 9,
                  color: '#70ba6e',
                },
                fontFamily: 'Arial, sans-serif',
              },
            },
          },
          {
            key: 'theme',
            header: {
              fontSize: 12,
            },
            content: {
              fontSize: 12,
            },
          },
        ],
        totals: {
          show: true,
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
                qText: 'Africa',
                qNum: 'NaN',
                qElemNumber: 1,
                qState: 'O',
              },
              {
                qText: '545.78443',
                qNum: 545.7844299999997,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '8',
                qNum: 8,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Americas',
                qNum: 'NaN',
                qElemNumber: 0,
                qState: 'O',
              },
              {
                qText: '22618.2405',
                qNum: 22618.240500000098,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '79',
                qNum: 79,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Asia',
                qNum: 'NaN',
                qElemNumber: 3,
                qState: 'O',
              },
              {
                qText: '8654.56037',
                qNum: 8654.560370000016,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '6',
                qNum: 6,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Europe',
                qNum: 'NaN',
                qElemNumber: 4,
                qState: 'O',
              },
              {
                qText: '13606.05505',
                qNum: 13606.055050000015,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '29',
                qNum: 29,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Middle East',
                qNum: 'NaN',
                qElemNumber: 5,
                qState: 'O',
              },
              {
                qText: '36.74028',
                qNum: 36.740280000000034,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '1',
                qNum: 1,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Pacific',
                qNum: 'NaN',
                qElemNumber: 2,
                qState: 'O',
              },
              {
                qText: '4148.09666',
                qNum: 4148.096660000006,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '7',
                qNum: 7,
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
                qIsNull: true,
              },
              {
                qText: '0',
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
            qWidth: 3,
            qHeight: 7,
          },
        },
      ],
    },
  ],
});
