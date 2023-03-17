export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        usePagination: false,
        qInfo: {
          qId: 'gBtsmvq',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 1,
            qcy: 6,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: 'Country',
              qApprMaxGlyphCount: 7,
              qCardinal: 6,
              qSortIndicator: 'A',
              qGroupFallbackTitles: ['Country'],
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
              qTags: ['$ascii', '$text', '$geoname', '$relates_CarsDataSet.Country_GeoInfo'],
              qDimensionType: 'D',
              qGrouping: 'N',
              qNumFormat: {
                qType: 'R',
                qnDec: 14,
                qUseThou: 1,
                qFmt: '##############',
                qDec: ',',
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ['Country'],
              qMin: 'NaN',
              qMax: 'NaN',
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 6,
                qHypercubeCardinal: 0,
                qAllValuesCardinal: -1,
              },
              qLibraryId: 'ZPkzL',
              title: 'Country',
              coloring: {
                changeHash: '0.7120835032460346',
                baseColor: {
                  color: '#f93f17',
                  index: 10,
                },
                colorMapRef: 'ZPkzL',
              },
              autoSort: true,
              textAlign: {
                auto: true,
                align: 'left',
              },
              cId: 'CnjyRD',
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
        showDetails: false,
        showDetailsExpression: false,
        components: [],
        totals: {
          show: true,
          position: 'top',
          label: 'Totals',
        },
        visualization: 'sn-table',
        version: '1.7.0',
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
                qText: 'France',
                qNum: 'NaN',
                qElemNumber: 4,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Germany',
                qNum: 'NaN',
                qElemNumber: 0,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Italy',
                qNum: 'NaN',
                qElemNumber: 5,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Japan',
                qNum: 'NaN',
                qElemNumber: 1,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'Sweden',
                qNum: 'NaN',
                qElemNumber: 3,
                qState: 'O',
              },
            ],
            [
              {
                qText: 'USA',
                qNum: 'NaN',
                qElemNumber: 2,
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
            qHeight: 6,
          },
        },
      ],
    },
  ],
});
