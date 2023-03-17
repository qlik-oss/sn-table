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
              qAttrExprInfo: [
                {
                  qMin: 'NaN',
                  qMax: 'NaN',
                  qFallbackTitle: "='ff0000'",
                  qNumFormat: {
                    qType: 'U',
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: 'cellForegroundColor',
                },
                {
                  qMin: 'NaN',
                  qMax: 'NaN',
                  qFallbackTitle: "='ff0000'",
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
                  qFallbackTitle: "=if([AR Average Balance] < 100000, '#3bbc4a', '#8b3bbc')",
                  qNumFormat: {
                    qType: 'U',
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: 'cellForegroundColor',
                },
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '175598.4774',
                qNum: 175598.4774,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#8b3bbc',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#00ff00',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '166166.8876',
                qNum: 166166.88760000002,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#8b3bbc',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#00ff00',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '53194.6898',
                qNum: 53194.6898,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '52687.1786',
                qNum: 52687.1786,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '48476.0202',
                qNum: 48476.0202,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '39240.2262',
                qNum: 39240.226200000005,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '37369.0804',
                qNum: 37369.0804,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '32213.436',
                qNum: 32213.436,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '27161.4712',
                qNum: 27161.4712,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '27149.7582',
                qNum: 27149.7582,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Venred',
                qNum: 'NaN',
                qElemNumber: 110,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '24971.7658',
                qNum: 24971.7658,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'MATRIX',
                qNum: 'NaN',
                qElemNumber: 22,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '20804.1206',
                qNum: 20804.120600000002,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Teca-Print',
                qNum: 'NaN',
                qElemNumber: 84,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '20728.3448',
                qNum: 20728.344800000003,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Earth',
                qNum: 'NaN',
                qElemNumber: 106,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '19939.4836',
                qNum: 19939.4836,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'EDP',
                qNum: 'NaN',
                qElemNumber: 37,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '16931.5206',
                qNum: 16931.5206,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Trend Line Corporation',
                qNum: 'NaN',
                qElemNumber: 114,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '14926.9112',
                qNum: 14926.9112,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Pinnacle Micro',
                qNum: 'NaN',
                qElemNumber: 17,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '14209.6914',
                qNum: 14209.691400000002,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Screen Saver.com',
                qNum: 'NaN',
                qElemNumber: 25,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '13147.1064',
                qNum: 13147.1064,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Team ASA',
                qNum: 'NaN',
                qElemNumber: 47,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '11119.9244',
                qNum: 11119.9244,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'PacificServ',
                qNum: 'NaN',
                qElemNumber: 86,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '10071.5038',
                qNum: 10071.5038,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Harvard Trust Company',
                qNum: 'NaN',
                qElemNumber: 57,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '7701.595',
                qNum: 7701.595,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'A&R Partners',
                qNum: 'NaN',
                qElemNumber: 50,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '5064.1946',
                qNum: 5064.1946,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'K International',
                qNum: 'NaN',
                qElemNumber: 109,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '5000.8764',
                qNum: 5000.8764,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'DCP Research',
                qNum: 'NaN',
                qElemNumber: 102,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4905.3908',
                qNum: 4905.3908,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: 'Karsing',
                qNum: 'NaN',
                qElemNumber: 71,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                    {
                      qText: 'ff0000',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
              {
                qText: '4745.9444',
                qNum: 4745.9444,
                qElemNumber: 0,
                qState: 'L',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '#3bbc4a',
                      qNum: 'NaN',
                    },
                    {
                      qText: '#ff0000',
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
            qHeight: 25,
          },
        },
      ],
    },
  ],
});
