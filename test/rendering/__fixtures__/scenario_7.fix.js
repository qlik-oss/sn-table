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
              qSortIndicator: 'D',
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
              qReverseSort: true,
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
                align: 'center',
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
                align: 'right',
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
        title: '',
        subtitle: '',
        footnote: '',
        disableNavMenu: false,
        showDetails: false,
        showDetailsExpression: false,
        components: [],
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
        qHasSoftPatches: false,
      },
      getHyperCubeData: [
        {
          qMatrix: [
            [
              {
                qText: 'Gate',
                qNum: 'NaN',
                qElemNumber: 49,
                qState: 'O',
              },
              {
                qText: '393.1012',
                qNum: 393.1012,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Fins',
                qNum: 'NaN',
                qElemNumber: 3,
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
                qText: 'Filmotype',
                qNum: 'NaN',
                qElemNumber: 76,
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
                qText: 'Fill It',
                qNum: 'NaN',
                qElemNumber: 2,
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
                qText: 'Federal Focus',
                qNum: 'NaN',
                qElemNumber: 119,
                qState: 'O',
              },
              {
                qText: '2775.1718',
                qNum: 2775.1718,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Ethyl Corporation',
                qNum: 'NaN',
                qElemNumber: 14,
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
                qText: 'EDP',
                qNum: 'NaN',
                qElemNumber: 37,
                qState: 'O',
              },
              {
                qText: '16931.5206',
                qNum: 16931.5206,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'eDistrict',
                qNum: 'NaN',
                qElemNumber: 127,
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
                qText: 'Earth',
                qNum: 'NaN',
                qElemNumber: 106,
                qState: 'O',
              },
              {
                qText: '19939.4836',
                qNum: 19939.4836,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Deak-Perera Group.',
                qNum: 'NaN',
                qElemNumber: 1,
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
                qText: 'DCS Laboratory',
                qNum: 'NaN',
                qElemNumber: 29,
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
                qText: 'DCS International',
                qNum: 'NaN',
                qElemNumber: 122,
                qState: 'O',
              },
              {
                qText: '24.599',
                qNum: 24.599,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'DCP Research',
                qNum: 'NaN',
                qElemNumber: 102,
                qState: 'O',
              },
              {
                qText: '4905.3908',
                qNum: 4905.3908,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Dayton Malleable Inc.',
                qNum: 'NaN',
                qElemNumber: 61,
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
                qText: 'David Spencer Ltd.',
                qNum: 'NaN',
                qElemNumber: 13,
                qState: 'O',
              },
              {
                qText: '48476.0202',
                qNum: 48476.0202,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Clearout',
                qNum: 'NaN',
                qElemNumber: 21,
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
                qText: 'City Fresh Foods',
                qNum: 'NaN',
                qElemNumber: 39,
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
                qText: 'Caribian Specialties',
                qNum: 'NaN',
                qElemNumber: 108,
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
                qText: 'CAM Group',
                qNum: 'NaN',
                qElemNumber: 51,
                qState: 'O',
              },
              {
                qText: '27161.4712',
                qNum: 27161.4712,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'CAF Systemhaus',
                qNum: 'NaN',
                qElemNumber: 69,
                qState: 'O',
              },
              {
                qText: '3662.8404',
                qNum: 3662.8404,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'C & J Engineering',
                qNum: 'NaN',
                qElemNumber: 113,
                qState: 'O',
              },
              {
                qText: '545.751',
                qNum: 545.751,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'C & C  Design',
                qNum: 'NaN',
                qElemNumber: 97,
                qState: 'O',
              },
              {
                qText: '32213.436',
                qNum: 32213.436,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Bizmarts',
                qNum: 'NaN',
                qElemNumber: 79,
                qState: 'O',
              },
              {
                qText: '27149.7582',
                qNum: 27149.7582,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Benedict',
                qNum: 'NaN',
                qElemNumber: 28,
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
                qText: 'Ben and Jerry’s',
                qNum: 'NaN',
                qElemNumber: 0,
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
                qText: 'Active Data',
                qNum: 'NaN',
                qElemNumber: 116,
                qState: 'O',
              },
              {
                qText: '132.0696',
                qNum: 132.0696,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Aaron Products',
                qNum: 'NaN',
                qElemNumber: 117,
                qState: 'O',
              },
              {
                qText: '1292.9384',
                qNum: 1292.9384,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'Aaron D. Meyer & Associates',
                qNum: 'NaN',
                qElemNumber: 101,
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
                qText: 'A2Z Solutions',
                qNum: 'NaN',
                qElemNumber: 12,
                qState: 'O',
              },
              {
                qText: '943.755',
                qNum: 943.755,
                qElemNumber: 0,
                qState: 'L',
              },
            ],
            [
              {
                qText: 'A&R Partners',
                qNum: 'NaN',
                qElemNumber: 50,
                qState: 'O',
              },
              {
                qText: '5064.1946',
                qNum: 5064.1946,
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
