export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        usePagination: false,
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
              qAttrExprInfo: [
                {
                  qMin: 'NaN',
                  qMax: 'NaN',
                  qFallbackTitle: "=if([AR Average Balance] < 100000, '#ff0000', '#00ff00')",
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
                  qFallbackTitle: "=if([AR Average Balance] < 100000, '#3bbc4a', '#8b3bbc')",
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
          qEffectiveInterColumnSortOrder: [1, 0],
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
        components: [
          {
            key: 'theme',
            content: {
              fontSize: 22,
              fontColor: {
                index: 13,
                color: '#138185',
              },
              hoverEffect: true,
              hoverColor: {
                index: 2,
                color: '#7b7a78',
              },
              hoverFontColor: {
                index: 11,
                color: '#79d69f',
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
        qHasSoftPatches: true,
      },
      getHyperCubeData: [
        {
          qMatrix: [
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#8b3bbc',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'RFI Corporation',
                qNum: 'NaN',
                qElemNumber: 30,
                qState: 'O',
              },
              {
                qText: '166166.8876',
                qNum: 166166.88760000002,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#00ff00',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#8b3bbc',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Pace',
                qNum: 'NaN',
                qElemNumber: 8,
                qState: 'O',
              },
              {
                qText: '53194.6898',
                qNum: 53194.6898,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Patient',
                qNum: 'NaN',
                qElemNumber: 112,
                qState: 'O',
              },
              {
                qText: '52687.1786',
                qNum: 52687.1786,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Kari & Associates',
                qNum: 'NaN',
                qElemNumber: 98,
                qState: 'O',
              },
              {
                qText: '39240.2262',
                qNum: 39240.226200000005,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Sifton Properties Limited',
                qNum: 'NaN',
                qElemNumber: 94,
                qState: 'O',
              },
              {
                qText: '37369.0804',
                qNum: 37369.0804,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                  ],
                },
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
