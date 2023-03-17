export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        usePagination: false,
        qInfo: {
          qId: 'TCRrNS',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 1,
            qcy: 1_000_000,
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
                qHypercubeCardinal: 0,
                qAllValuesCardinal: -1,
              },
              qLibraryId: 'pcZcGjn',
              title: 'Customer',
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              cId: 'UEhgBw',
            },
          ],
          qMeasureInfo: [],
          qEffectiveInterColumnSortOrder: [0],
          qGrandTotalRow: [],
          qDataPages: [],
          qPivotDataPages: [],
          qStackedDataPages: [],
          qMode: 'S',
          qNoOfLeftDims: -1,
          qTreeNodesOnDim: [],
          qColumnOrder: [0],
          columnWidths: [-1],
        },
        showTitles: true,
        title: '',
        subtitle: '',
        footnote: '',
        disableNavMenu: false,
        showDetails: true,
        showDetailsExpression: false,
        components: [],
        totals: {
          show: true,
          position: 'noTotals',
          label: 'Totals',
        },
        visualization: 'sn-table',
        version: '"1.22.0"',
        enableChartExploration: false,
        extensionMeta: {
          translationKey: '',
          icon: 'puzzle',
          iconChar: 'puzzle',
          isLibraryItem: true,
          visible: true,
          name: 'sn-table',
          description: 'table supernova',
          template: 'sn-table',
          iconPath:
            'M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z',
          isThirdParty: true,
          version: '1.22.0',
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
                qText: 'A&R Partners',
                qNum: 'NaN',
                qElemNumber: 50,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'A2Z Solutions',
                qNum: 'NaN',
                qElemNumber: 12,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Aaron D. Meyer & Associates',
                qNum: 'NaN',
                qElemNumber: 101,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Aaron Products',
                qNum: 'NaN',
                qElemNumber: 117,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Active Data',
                qNum: 'NaN',
                qElemNumber: 116,
                qState: 'O',
              },
            ],
            [
              {
                qText: "Ben and Jerry's",
                qNum: 'NaN',
                qElemNumber: 0,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Benedict',
                qNum: 'NaN',
                qElemNumber: 28,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Bizmarts',
                qNum: 'NaN',
                qElemNumber: 79,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'C & C  Design',
                qNum: 'NaN',
                qElemNumber: 97,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'C & J Engineering',
                qNum: 'NaN',
                qElemNumber: 113,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'CAF Systemhaus',
                qNum: 'NaN',
                qElemNumber: 69,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'CAM Group',
                qNum: 'NaN',
                qElemNumber: 51,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Caribian Specialties',
                qNum: 'NaN',
                qElemNumber: 108,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'City Fresh Foods',
                qNum: 'NaN',
                qElemNumber: 39,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Clearout',
                qNum: 'NaN',
                qElemNumber: 21,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'David Spencer Ltd.',
                qNum: 'NaN',
                qElemNumber: 13,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Dayton Malleable Inc.',
                qNum: 'NaN',
                qElemNumber: 61,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'DCP Research',
                qNum: 'NaN',
                qElemNumber: 102,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'DCS International',
                qNum: 'NaN',
                qElemNumber: 122,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'DCS Laboratory',
                qNum: 'NaN',
                qElemNumber: 29,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Deak-Perera Group.',
                qNum: 'NaN',
                qElemNumber: 1,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Earth',
                qNum: 'NaN',
                qElemNumber: 106,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'eDistrict',
                qNum: 'NaN',
                qElemNumber: 127,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'EDP',
                qNum: 'NaN',
                qElemNumber: 37,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Ethyl Corporation',
                qNum: 'NaN',
                qElemNumber: 14,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Federal Focus',
                qNum: 'NaN',
                qElemNumber: 119,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Fill It',
                qNum: 'NaN',
                qElemNumber: 2,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Filmotype',
                qNum: 'NaN',
                qElemNumber: 76,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Fins',
                qNum: 'NaN',
                qElemNumber: 3,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Gate',
                qNum: 'NaN',
                qElemNumber: 49,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Gulf and Western Industries',
                qNum: 'NaN',
                qElemNumber: 63,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Harte-Hanks (formerly Locator)',
                qNum: 'NaN',
                qElemNumber: 40,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Harvard Trust Company',
                qNum: 'NaN',
                qElemNumber: 57,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'HCHS',
                qNum: 'NaN',
                qElemNumber: 41,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Healtheon',
                qNum: 'NaN',
                qElemNumber: 73,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Hetrick Systems',
                qNum: 'NaN',
                qElemNumber: 4,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Home Team',
                qNum: 'NaN',
                qElemNumber: 107,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Homebound',
                qNum: 'NaN',
                qElemNumber: 5,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'IBVA',
                qNum: 'NaN',
                qElemNumber: 42,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Icon',
                qNum: 'NaN',
                qElemNumber: 15,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Icon Site Builders',
                qNum: 'NaN',
                qElemNumber: 43,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Idyllwild',
                qNum: 'NaN',
                qElemNumber: 6,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'J. S. Lee Associates',
                qNum: 'NaN',
                qElemNumber: 7,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'K International',
                qNum: 'NaN',
                qElemNumber: 109,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'K.C. Irving',
                qNum: 'NaN',
                qElemNumber: 90,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Kari & Associates',
                qNum: 'NaN',
                qElemNumber: 98,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Karsing',
                qNum: 'NaN',
                qElemNumber: 71,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Kazinformcom',
                qNum: 'NaN',
                qElemNumber: 83,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'KentISP',
                qNum: 'NaN',
                qElemNumber: 48,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Kool-Seal',
                qNum: 'NaN',
                qElemNumber: 33,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Laker Airways',
                qNum: 'NaN',
                qElemNumber: 104,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Livermore  Laboratories (LSLI)',
                qNum: 'NaN',
                qElemNumber: 77,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'LiveWire BBS and   Favourite Links',
                qNum: 'NaN',
                qElemNumber: 16,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'MATRIX',
                qNum: 'NaN',
                qElemNumber: 22,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Miles Laboratories, Inc.',
                qNum: 'NaN',
                qElemNumber: 126,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'NACSCORP',
                qNum: 'NaN',
                qElemNumber: 58,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Onestar',
                qNum: 'NaN',
                qElemNumber: 123,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Pace',
                qNum: 'NaN',
                qElemNumber: 8,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Pacific Group',
                qNum: 'NaN',
                qElemNumber: 105,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Pacific Matics',
                qNum: 'NaN',
                qElemNumber: 111,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Pacific Sierra Research',
                qNum: 'NaN',
                qElemNumber: 54,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Pacific Voice',
                qNum: 'NaN',
                qElemNumber: 118,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Pacific West Enterprises',
                qNum: 'NaN',
                qElemNumber: 46,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'PacificServ',
                qNum: 'NaN',
                qElemNumber: 86,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Panngea',
                qNum: 'NaN',
                qElemNumber: 93,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'PAP (Maintenance)',
                qNum: 'NaN',
                qElemNumber: 78,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Paracel',
                qNum: 'NaN',
                qElemNumber: 9,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Patient',
                qNum: 'NaN',
                qElemNumber: 112,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Pinnacle Micro',
                qNum: 'NaN',
                qElemNumber: 17,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'QualServe',
                qNum: 'NaN',
                qElemNumber: 91,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Quantum 4Xyte  Architects',
                qNum: 'NaN',
                qElemNumber: 34,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Qwest',
                qNum: 'NaN',
                qElemNumber: 65,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'R&R Group',
                qNum: 'NaN',
                qElemNumber: 35,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'R.J. Matter & Associates',
                qNum: 'NaN',
                qElemNumber: 10,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Ra Co Amo',
                qNum: 'NaN',
                qElemNumber: 11,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'RC',
                qNum: 'NaN',
                qElemNumber: 66,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Ready-to-Run',
                qNum: 'NaN',
                qElemNumber: 74,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Remedy',
                qNum: 'NaN',
                qElemNumber: 60,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Renegade info Crew',
                qNum: 'NaN',
                qElemNumber: 23,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Reuters Usability Group',
                qNum: 'NaN',
                qElemNumber: 24,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'ReviewBooth',
                qNum: 'NaN',
                qElemNumber: 80,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'RFI Corporation',
                qNum: 'NaN',
                qElemNumber: 30,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Road Warrior International',
                qNum: 'NaN',
                qElemNumber: 59,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Robust Code',
                qNum: 'NaN',
                qElemNumber: 67,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Sage',
                qNum: 'NaN',
                qElemNumber: 128,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Sagent',
                qNum: 'NaN',
                qElemNumber: 99,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Salamander Junction',
                qNum: 'NaN',
                qElemNumber: 89,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Satronix',
                qNum: 'NaN',
                qElemNumber: 87,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Satyam',
                qNum: 'NaN',
                qElemNumber: 62,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Scientific Atlanta',
                qNum: 'NaN',
                qElemNumber: 52,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'ScotGold Products',
                qNum: 'NaN',
                qElemNumber: 81,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Screen Saver.com',
                qNum: 'NaN',
                qElemNumber: 25,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Sifton Properties Limited',
                qNum: 'NaN',
                qElemNumber: 94,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Sigma',
                qNum: 'NaN',
                qElemNumber: 129,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Signature',
                qNum: 'NaN',
                qElemNumber: 18,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'SignatureFactory',
                qNum: 'NaN',
                qElemNumber: 95,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Soloman Brothers',
                qNum: 'NaN',
                qElemNumber: 121,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Southern Company',
                qNum: 'NaN',
                qElemNumber: 45,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Stone Consolidated Corporation',
                qNum: 'NaN',
                qElemNumber: 70,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Talou',
                qNum: 'NaN',
                qElemNumber: 26,
                qState: 'O',
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
            qWidth: 1,
            qHeight: 100,
          },
        },
      ],
    },
  ],
});
