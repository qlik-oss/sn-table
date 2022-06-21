export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'gcCcnj',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 2,
            qcy: 130,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: 'Customer',
              qApprMaxGlyphCount: 34,
              qCardinal: 130,
              qSortIndicator: 'A',
              qGroupFallbackTitles: ['Customer'],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 130,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ['$text'],
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
              qGroupFieldDefs: ['Customer'],
              qMin: 'NaN',
              qMax: 'NaN',
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 130,
                qHypercubeCardinal: 130,
                qAllValuesCardinal: -1,
              },
              qLibraryId: 'pcZcGjn',
              title: 'Customer',
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              cId: 'vEERSTE',
            },
          ],
          qMeasureInfo: [
            {
              qFallbackTitle: 'AR Average Balance',
              qApprMaxGlyphCount: 10,
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
              qMin: -36.903600000000004,
              qMax: 175598.4774,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qLibraryId: 'pVTm',
              qTrendLines: [],
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              cId: 'HjDwTGN',
            },
          ],
          qEffectiveInterColumnSortOrder: [0, 1],
          qGrandTotalRow: [
            {
              qText: '914213.522',
              qNum: 914213.522,
              qElemNumber: -1,
              qState: 'X',
              qIsTotalCell: true,
            },
          ],
          qDataPages: [],
          qPivotDataPages: [],
          qStackedDataPages: [],
          qMode: 'S',
          qNoOfLeftDims: -1,
          qTreeNodesOnDim: [],
          qColumnOrder: [0, 1],
          columnWidths: [-1, -1],
        },
        showTitles: true,
        title: 'Test',
        subtitle: 'Test',
        footnote: 'Test',
        disableNavMenu: false,
        showDetails: false,
        showDetailsExpression: false,
        components: [
          {
            key: 'theme',
            content: {
              fontSize: 28,
              fontColor: {
                index: -1,
                color: '#65d3da',
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
              fontSize: 40,
              fontColor: {
                index: 9,
                color: '#70ba6e',
              },
            },
          },
        ],
        totals: {
          show: true,
          position: 'noTotals',
          label: 'Totals',
        },
        visualization: 'sn-table',
        version: '1.10.0',
        extensionMeta: {
          translationKey: '',
          icon: 'puzzle',
          iconChar: 'puzzle',
          isLibraryItem: true,
          visible: true,
          name: 'sn-table',
          description: 'sn-table',
          template: 'sn-table',
          iconPath:
            'M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z',
          isThirdParty: true,
          version: '0.1.0',
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
                qText: 'Tampere',
                qNum: 'NaN',
                qElemNumber: 88,
                qState: 'O',
              },
              {
                qText: '4308.7146',
                qNum: 4308.7146,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tandy Corporation',
                qNum: 'NaN',
                qElemNumber: 120,
                qState: 'O',
              },
              {
                qText: '2546.8006',
                qNum: 2546.8006,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Tangent',
                qNum: 'NaN',
                qElemNumber: 55,
                qState: 'O',
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
                qText: 'Tao Group',
                qNum: 'NaN',
                qElemNumber: 72,
                qState: 'O',
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
                qText: 'Target Marketing',
                qNum: 'NaN',
                qElemNumber: 44,
                qState: 'O',
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
                qText: 'Team ASA',
                qNum: 'NaN',
                qElemNumber: 47,
                qState: 'O',
              },
              {
                qText: '11119.9244',
                qNum: 11119.9244,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Team Financial Management Systems',
                qNum: 'NaN',
                qElemNumber: 115,
                qState: 'O',
              },
              {
                qText: '181.0364',
                qNum: 181.03640000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Teca-Print',
                qNum: 'NaN',
                qElemNumber: 84,
                qState: 'O',
              },
              {
                qText: '20728.3448',
                qNum: 20728.344800000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Time Warner',
                qNum: 'NaN',
                qElemNumber: 27,
                qState: 'O',
              },
              {
                qText: '2536.6822',
                qNum: 2536.6822,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Towmotor Corporation',
                qNum: 'NaN',
                qElemNumber: 100,
                qState: 'O',
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
                qText: 'Tredegar Company',
                qNum: 'NaN',
                qElemNumber: 53,
                qState: 'O',
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
                qText: 'Trend Line Corporation',
                qNum: 'NaN',
                qElemNumber: 114,
                qState: 'O',
              },
              {
                qText: '14926.9112',
                qNum: 14926.9112,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'U. S. Exchange',
                qNum: 'NaN',
                qElemNumber: 19,
                qState: 'O',
              },
              {
                qText: '2252.9182',
                qNum: 2252.9182,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Unison Management Concepts',
                qNum: 'NaN',
                qElemNumber: 56,
                qState: 'O',
              },
              {
                qText: '112.8732',
                qNum: 112.87320000000001,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'United States  (USIT)',
                qNum: 'NaN',
                qElemNumber: 103,
                qState: 'O',
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
                qText: 'UUmail',
                qNum: 'NaN',
                qElemNumber: 64,
                qState: 'O',
              },
              {
                qText: '366.1562',
                qNum: 366.1562,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'ValiCert',
                qNum: 'NaN',
                qElemNumber: 20,
                qState: 'O',
              },
              {
                qText: '4203.8246',
                qNum: 4203.8246,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Valley  Solutions',
                qNum: 'NaN',
                qElemNumber: 96,
                qState: 'O',
              },
              {
                qText: '175598.4774',
                qNum: 175598.4774,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Valpatken',
                qNum: 'NaN',
                qElemNumber: 36,
                qState: 'O',
              },
              {
                qText: '3764.5548',
                qNum: 3764.5548000000003,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Vanstar',
                qNum: 'NaN',
                qElemNumber: 92,
                qState: 'O',
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
                qText: 'Venable',
                qNum: 'NaN',
                qElemNumber: 38,
                qState: 'O',
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
                qText: 'Venred',
                qNum: 'NaN',
                qElemNumber: 110,
                qState: 'O',
              },
              {
                qText: '24971.7658',
                qNum: 24971.7658,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Watcom International',
                qNum: 'NaN',
                qElemNumber: 82,
                qState: 'O',
              },
              {
                qText: '435.6454',
                qNum: 435.6454,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Xentec',
                qNum: 'NaN',
                qElemNumber: 85,
                qState: 'O',
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
                qText: 'Xilinx',
                qNum: 'NaN',
                qElemNumber: 31,
                qState: 'O',
              },
              {
                qText: '9.8566',
                qNum: 9.8566,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'XVT',
                qNum: 'NaN',
                qElemNumber: 32,
                qState: 'O',
              },
              {
                qText: '116.9362',
                qNum: 116.9362,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Zero Assumption Recovery',
                qNum: 'NaN',
                qElemNumber: 125,
                qState: 'O',
              },
              {
                qText: '-36.9036',
                qNum: -36.903600000000004,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Zilog',
                qNum: 'NaN',
                qElemNumber: 75,
                qState: 'O',
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
                qText: 'Zitel',
                qNum: 'NaN',
                qElemNumber: 124,
                qState: 'O',
              },
              {
                qText: '2411.1508',
                qNum: 2411.1508,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Zocalo',
                qNum: 'NaN',
                qElemNumber: 68,
                qState: 'O',
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
            qTop: 100,
            qWidth: 2,
            qHeight: 30,
          },
        },
      ],
    },
  ],
});
