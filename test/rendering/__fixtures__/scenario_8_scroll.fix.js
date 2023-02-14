export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        presentation: {
          usePagination: false
        },
        qInfo: {
          qId: 'gcCcnj',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {
          qInSelections: false,
          qMadeSelections: false,
        },
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
            qWidth: 2,
            qHeight: 10,
          },
        },
      ],
    },
  ],
});
