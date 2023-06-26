export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'dpyZaJd',
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
                type: 'pixels',
                pixels: 60,
                percentage: 20,
              },
              cId: 'SHPZa',
            },
          ],
          qMeasureInfo: [
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
                type: 'pixels',
                pixels: 60,
                percentage: 20,
              },
              cId: 'tXPMsy',
            },
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
                type: 'pixels',
                pixels: 60,
                percentage: 20,
              },
              cId: 'ZHnJTh',
            },
          ],
          qEffectiveInterColumnSortOrder: [0, 1, 2],
          qGrandTotalRow: [
            {
              qText: '130',
              qNum: 130,
              qElemNumber: -1,
              qState: 'X',
              qIsTotalCell: true,
            },
            {
              qText: '49609.47729',
              qNum: 49609.47729000036,
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
                color: '#cf3c6b',
              },
            },
            content: {
              fontSize: 22,
              fontColor: {
                index: -1,
                color: '#82d165',
              },
              hoverEffect: true,
              hoverColor: {
                index: 13,
                color: '#138185',
              },
            },
          },
        ],
        totals: {
          show: false,
          position: 'noTotals',
          label: 'Totals',
        },
        usePagination: false,
        enableChartExploration: false,
        chartExploration: {
          menuVisibility: 'auto',
        },
        visualization: 'sn-table',
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
                qText: '8',
                qNum: 8,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '545.78443',
                qNum: 545.7844299999997,
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
                qText: '79',
                qNum: 79,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '22618.2405',
                qNum: 22618.240500000098,
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
                qText: '6',
                qNum: 6,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '8654.56037',
                qNum: 8654.560370000016,
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
                qText: '29',
                qNum: 29,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '13606.05505',
                qNum: 13606.055050000015,
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
                qText: '1',
                qNum: 1,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '36.74028',
                qNum: 36.740280000000034,
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
                qText: '7',
                qNum: 7,
                qElemNumber: 0,
                qState: 'L',
              },
              {
                qText: '4148.09666',
                qNum: 4148.096660000006,
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
