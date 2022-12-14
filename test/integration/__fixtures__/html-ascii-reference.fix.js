export default () => ({
  type: 'sn-table',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'uJCJ',
          qType: 'sn-table',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 3,
            qcy: 144,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: "Character",
              qApprMaxGlyphCount: 1,
              qCardinal: 144,
              qSortIndicator: "A",
              qGroupFallbackTitles: [
                "Character"
              ],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 144,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0
              },
              qTags: [
                "$text"
              ],
              qDimensionType: "D",
              qGrouping: "N",
              qNumFormat: {
                qType: "R",
                qnDec: 14,
                qUseThou: 1,
                qFmt: "##############",
                qDec: ","
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: [
                "Character"
              ],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 144,
                qHypercubeCardinal: 0,
                qAllValuesCardinal: -1
              },
              autoSort: true,
              cId: "PcJajkN",
              othersLabel: "Others",
              textAlign: {
                auto: true,
                align: "left"
              }
            },
            {
              qFallbackTitle: "Entity Name",
              qApprMaxGlyphCount: 19,
              qCardinal: 144,
              qSortIndicator: "A",
              qGroupFallbackTitles: [
                "Entity Name"
              ],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 144,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0
              },
              qTags: [
                "$ascii",
                "$text"
              ],
              qDimensionType: "D",
              qGrouping: "N",
              qNumFormat: {
                qType: "R",
                qnDec: 14,
                qUseThou: 1,
                qFmt: "##############",
                qDec: ","
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: [
                "Entity Name"
              ],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 144,
                qHypercubeCardinal: 0,
                qAllValuesCardinal: -1
              },
              autoSort: true,
              cId: "Spmr",
              othersLabel: "Others",
              textAlign: {
                auto: true,
                align: "left"
              }
            },
            {
              qFallbackTitle: "Description",
              qApprMaxGlyphCount: 43,
              qCardinal: 144,
              qSortIndicator: "A",
              qGroupFallbackTitles: [
                "Description"
              ],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 144,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0
              },
              qTags: [
                "$ascii",
                "$text"
              ],
              qDimensionType: "D",
              qGrouping: "N",
              qNumFormat: {
                qType: "R",
                qnDec: 14,
                qUseThou: 1,
                qFmt: "##############",
                qDec: ","
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: [
                "Description"
              ],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 144,
                qHypercubeCardinal: 0,
                qAllValuesCardinal: -1
              },
              autoSort: true,
              cId: "pqcp",
              othersLabel: "Others",
              textAlign: {
                auto: true,
                align: "left"
              }
            }
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
        components: [],
        totals: {
          show: true,
          position: 'noTotals',
          label: 'Totals',
        },
        visualization: 'sn-table',
        version: '1.0.3',
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
                qText: "­",
                qNum: "NaN",
                qElemNumber: 132,
                qState: "O"
              },
              {
                qText: "&shy;",
                qNum: "NaN",
                qElemNumber: 132,
                qState: "O"
              },
              {
                qText: "Soft Hyphen",
                qNum: "NaN",
                qElemNumber: 132,
                qState: "O"
              }
            ],
            [
              {
                qText: "‌",
                qNum: "NaN",
                qElemNumber: 143,
                qState: "O"
              },
              {
                qText: "&zwnj;",
                qNum: "NaN",
                qElemNumber: 143,
                qState: "O"
              },
              {
                qText: "Zero Width Non-Joiner",
                qNum: "NaN",
                qElemNumber: 143,
                qState: "O"
              }
            ],
            [
              {
                qText: "‍",
                qNum: "NaN",
                qElemNumber: 142,
                qState: "O"
              },
              {
                qText: "&zwj;",
                qNum: "NaN",
                qElemNumber: 142,
                qState: "O"
              },
              {
                qText: "Zero Width Joiner",
                qNum: "NaN",
                qElemNumber: 142,
                qState: "O"
              }
            ],
            [
              {
                qText: "‎",
                qNum: "NaN",
                qElemNumber: 105,
                qState: "O"
              },
              {
                qText: "&lrm;",
                qNum: "NaN",
                qElemNumber: 105,
                qState: "O"
              },
              {
                qText: "Left-To-Right Mark",
                qNum: "NaN",
                qElemNumber: 105,
                qState: "O"
              }
            ],
            [
              {
                qText: "‏",
                qNum: "NaN",
                qElemNumber: 129,
                qState: "O"
              },
              {
                qText: "&rlm;",
                qNum: "NaN",
                qElemNumber: 129,
                qState: "O"
              },
              {
                qText: "Right-To-Left Mark",
                qNum: "NaN",
                qElemNumber: 129,
                qState: "O"
              }
            ],
            [
              {
                qText: " ",
                qNum: "NaN",
                qElemNumber: 112,
                qState: "O"
              },
              {
                qText: "&nbsp;",
                qNum: "NaN",
                qElemNumber: 112,
                qState: "O"
              },
              {
                qText: "No-Break Space",
                qNum: "NaN",
                qElemNumber: 112,
                qState: "O"
              }
            ],
            [
              {
                qText: " ",
                qNum: "NaN",
                qElemNumber: 90,
                qState: "O"
              },
              {
                qText: "&ensp;",
                qNum: "NaN",
                qElemNumber: 90,
                qState: "O"
              },
              {
                qText: "En Space",
                qNum: "NaN",
                qElemNumber: 90,
                qState: "O"
              }
            ],
            [
              {
                qText: " ",
                qNum: "NaN",
                qElemNumber: 88,
                qState: "O"
              },
              {
                qText: "&emsp;",
                qNum: "NaN",
                qElemNumber: 88,
                qState: "O"
              },
              {
                qText: "Em Space",
                qNum: "NaN",
                qElemNumber: 88,
                qState: "O"
              }
            ],
            [
              {
                qText: " ",
                qNum: "NaN",
                qElemNumber: 137,
                qState: "O"
              },
              {
                qText: "&thinsp;",
                qNum: "NaN",
                qElemNumber: 137,
                qState: "O"
              },
              {
                qText: "Thin Space",
                qNum: "NaN",
                qElemNumber: 137,
                qState: "O"
              }
            ],
            [
              {
                qText: "‾",
                qNum: "NaN",
                qElemNumber: 115,
                qState: "O"
              },
              {
                qText: "&oline;",
                qNum: "NaN",
                qElemNumber: 115,
                qState: "O"
              },
              {
                qText: "Overline",
                qNum: "NaN",
                qElemNumber: 115,
                qState: "O"
              }
            ],
            [
              {
                qText: "_",
                qNum: "NaN",
                qElemNumber: 106,
                qState: "O"
              },
              {
                qText: "&lowbar;",
                qNum: "NaN",
                qElemNumber: 106,
                qState: "O"
              },
              {
                qText: "Low Line",
                qNum: "NaN",
                qElemNumber: 106,
                qState: "O"
              }
            ],
            [
              {
                qText: "‐",
                qNum: "NaN",
                qElemNumber: 98,
                qState: "O"
              },
              {
                qText: "&hyphen;",
                qNum: "NaN",
                qElemNumber: 98,
                qState: "O"
              },
              {
                qText: "Hyphen",
                qNum: "NaN",
                qElemNumber: 98,
                qState: "O"
              }
            ],
            [
              {
                qText: "–",
                qNum: "NaN",
                qElemNumber: 89,
                qState: "O"
              },
              {
                qText: "&ndash;",
                qNum: "NaN",
                qElemNumber: 89,
                qState: "O"
              },
              {
                qText: "En Dash",
                qNum: "NaN",
                qElemNumber: 89,
                qState: "O"
              }
            ],
            [
              {
                qText: "—",
                qNum: "NaN",
                qElemNumber: 87,
                qState: "O"
              },
              {
                qText: "&mdash;",
                qNum: "NaN",
                qElemNumber: 87,
                qState: "O"
              },
              {
                qText: "Em Dash",
                qNum: "NaN",
                qElemNumber: 87,
                qState: "O"
              }
            ],
            [
              {
                qText: "―",
                qNum: "NaN",
                qElemNumber: 96,
                qState: "O"
              },
              {
                qText: "&horbar;",
                qNum: "NaN",
                qElemNumber: 96,
                qState: "O"
              },
              {
                qText: "Horizontal Bar",
                qNum: "NaN",
                qElemNumber: 96,
                qState: "O"
              }
            ],
            [
              {
                qText: ",",
                qNum: "NaN",
                qElemNumber: 81,
                qState: "O"
              },
              {
                qText: "&comma;",
                qNum: "NaN",
                qElemNumber: 81,
                qState: "O"
              },
              {
                qText: "Comma",
                qNum: "NaN",
                qElemNumber: 81,
                qState: "O"
              }
            ],
            [
              {
                qText: ";",
                qNum: "NaN",
                qElemNumber: 131,
                qState: "O"
              },
              {
                qText: "&semi;",
                qNum: "NaN",
                qElemNumber: 131,
                qState: "O"
              },
              {
                qText: "Semicolon",
                qNum: "NaN",
                qElemNumber: 131,
                qState: "O"
              }
            ],
            [
              {
                qText: "⁏",
                qNum: "NaN",
                qElemNumber: 125,
                qState: "O"
              },
              {
                qText: "&bsemi;",
                qNum: "NaN",
                qElemNumber: 125,
                qState: "O"
              },
              {
                qText: "Reversed Semicolon",
                qNum: "NaN",
                qElemNumber: 125,
                qState: "O"
              }
            ],
            [
              {
                qText: ":",
                qNum: "NaN",
                qElemNumber: 80,
                qState: "O"
              },
              {
                qText: "&colon;",
                qNum: "NaN",
                qElemNumber: 80,
                qState: "O"
              },
              {
                qText: "Colon",
                qNum: "NaN",
                qElemNumber: 80,
                qState: "O"
              }
            ],
            [
              {
                qText: "!",
                qNum: "NaN",
                qElemNumber: 91,
                qState: "O"
              },
              {
                qText: "&excl;",
                qNum: "NaN",
                qElemNumber: 91,
                qState: "O"
              },
              {
                qText: "Exclamation Mark",
                qNum: "NaN",
                qElemNumber: 91,
                qState: "O"
              }
            ],
            [
              {
                qText: "¡",
                qNum: "NaN",
                qElemNumber: 100,
                qState: "O"
              },
              {
                qText: "&iexcl;",
                qNum: "NaN",
                qElemNumber: 100,
                qState: "O"
              },
              {
                qText: "Inverted Exclamation Mark",
                qNum: "NaN",
                qElemNumber: 100,
                qState: "O"
              }
            ],
            [
              {
                qText: "?",
                qNum: "NaN",
                qElemNumber: 122,
                qState: "O"
              },
              {
                qText: "&quest;",
                qNum: "NaN",
                qElemNumber: 122,
                qState: "O"
              },
              {
                qText: "Question Mark",
                qNum: "NaN",
                qElemNumber: 122,
                qState: "O"
              }
            ],
            [
              {
                qText: "¿",
                qNum: "NaN",
                qElemNumber: 101,
                qState: "O"
              },
              {
                qText: "&iquest;",
                qNum: "NaN",
                qElemNumber: 101,
                qState: "O"
              },
              {
                qText: "Inverted Question Mark",
                qNum: "NaN",
                qElemNumber: 101,
                qState: "O"
              }
            ],
            [
              {
                qText: ".",
                qNum: "NaN",
                qElemNumber: 94,
                qState: "O"
              },
              {
                qText: "&period;",
                qNum: "NaN",
                qElemNumber: 94,
                qState: "O"
              },
              {
                qText: "Full Stop",
                qNum: "NaN",
                qElemNumber: 94,
                qState: "O"
              }
            ],
            [
              {
                qText: "‥",
                qNum: "NaN",
                qElemNumber: 140,
                qState: "O"
              },
              {
                qText: "&nldr;",
                qNum: "NaN",
                qElemNumber: 140,
                qState: "O"
              },
              {
                qText: "Two Dot Leader",
                qNum: "NaN",
                qElemNumber: 140,
                qState: "O"
              }
            ],
            [
              {
                qText: "…",
                qNum: "NaN",
                qElemNumber: 97,
                qState: "O"
              },
              {
                qText: "&hellip;",
                qNum: "NaN",
                qElemNumber: 97,
                qState: "O"
              },
              {
                qText: "Horizontal Ellipsis",
                qNum: "NaN",
                qElemNumber: 97,
                qState: "O"
              }
            ],
            [
              {
                qText: "·",
                qNum: "NaN",
                qElemNumber: 110,
                qState: "O"
              },
              {
                qText: "&middot;",
                qNum: "NaN",
                qElemNumber: 110,
                qState: "O"
              },
              {
                qText: "Middle Dot",
                qNum: "NaN",
                qElemNumber: 110,
                qState: "O"
              }
            ],
            [
              {
                qText: "(",
                qNum: "NaN",
                qElemNumber: 103,
                qState: "O"
              },
              {
                qText: "&lpar;",
                qNum: "NaN",
                qElemNumber: 103,
                qState: "O"
              },
              {
                qText: "Left Parenthesis",
                qNum: "NaN",
                qElemNumber: 103,
                qState: "O"
              }
            ],
            [
              {
                qText: ")",
                qNum: "NaN",
                qElemNumber: 127,
                qState: "O"
              },
              {
                qText: "&rpar;",
                qNum: "NaN",
                qElemNumber: 127,
                qState: "O"
              },
              {
                qText: "Right Parenthesis",
                qNum: "NaN",
                qElemNumber: 127,
                qState: "O"
              }
            ],
            [
              {
                qText: "[",
                qNum: "NaN",
                qElemNumber: 104,
                qState: "O"
              },
              {
                qText: "&lbrack;",
                qNum: "NaN",
                qElemNumber: 104,
                qState: "O"
              },
              {
                qText: "Left Square Bracket",
                qNum: "NaN",
                qElemNumber: 104,
                qState: "O"
              }
            ],
            [
              {
                qText: "]",
                qNum: "NaN",
                qElemNumber: 128,
                qState: "O"
              },
              {
                qText: "&rbrack;",
                qNum: "NaN",
                qElemNumber: 128,
                qState: "O"
              },
              {
                qText: "Right Square Bracket",
                qNum: "NaN",
                qElemNumber: 128,
                qState: "O"
              }
            ],
            [
              {
                qText: "{",
                qNum: "NaN",
                qElemNumber: 102,
                qState: "O"
              },
              {
                qText: "&lbrace;",
                qNum: "NaN",
                qElemNumber: 102,
                qState: "O"
              },
              {
                qText: "Left Curly Bracket",
                qNum: "NaN",
                qElemNumber: 102,
                qState: "O"
              }
            ],
            [
              {
                qText: "}",
                qNum: "NaN",
                qElemNumber: 126,
                qState: "O"
              },
              {
                qText: "&rbrace;",
                qNum: "NaN",
                qElemNumber: 126,
                qState: "O"
              },
              {
                qText: "Right Curly Bracket",
                qNum: "NaN",
                qElemNumber: 126,
                qState: "O"
              }
            ],
            [
              {
                qText: "❲",
                qNum: "NaN",
                qElemNumber: 34,
                qState: "O"
              },
              {
                qText: "&lbbrk;",
                qNum: "NaN",
                qElemNumber: 34,
                qState: "O"
              },
              {
                qText: "Light Left Tortoise Shell Bracket Ornament",
                qNum: "NaN",
                qElemNumber: 34,
                qState: "O"
              }
            ],
            [
              {
                qText: "❳",
                qNum: "NaN",
                qElemNumber: 35,
                qState: "O"
              },
              {
                qText: "&rbbrk;",
                qNum: "NaN",
                qElemNumber: 35,
                qState: "O"
              },
              {
                qText: "Light Right Tortoise Shell Bracket Ornament",
                qNum: "NaN",
                qElemNumber: 35,
                qState: "O"
              }
            ],
            [
              {
                qText: "‖",
                qNum: "NaN",
                qElemNumber: 86,
                qState: "O"
              },
              {
                qText: "&Vert;",
                qNum: "NaN",
                qElemNumber: 86,
                qState: "O"
              },
              {
                qText: "Double Vertical Line",
                qNum: "NaN",
                qElemNumber: 86,
                qState: "O"
              }
            ],
            [
              {
                qText: "§",
                qNum: "NaN",
                qElemNumber: 130,
                qState: "O"
              },
              {
                qText: "&sect;",
                qNum: "NaN",
                qElemNumber: 130,
                qState: "O"
              },
              {
                qText: "Section Sign",
                qNum: "NaN",
                qElemNumber: 130,
                qState: "O"
              }
            ],
            [
              {
                qText: "¶",
                qNum: "NaN",
                qElemNumber: 119,
                qState: "O"
              },
              {
                qText: "&para;",
                qNum: "NaN",
                qElemNumber: 119,
                qState: "O"
              },
              {
                qText: "Pilcrow Sign",
                qNum: "NaN",
                qElemNumber: 119,
                qState: "O"
              }
            ],
            [
              {
                qText: "@",
                qNum: "NaN",
                qElemNumber: 16,
                qState: "O"
              },
              {
                qText: "&commat;",
                qNum: "NaN",
                qElemNumber: 16,
                qState: "O"
              },
              {
                qText: "Commercial At",
                qNum: "NaN",
                qElemNumber: 16,
                qState: "O"
              }
            ],
            [
              {
                qText: "*",
                qNum: "NaN",
                qElemNumber: 74,
                qState: "O"
              },
              {
                qText: "&ast;",
                qNum: "NaN",
                qElemNumber: 74,
                qState: "O"
              },
              {
                qText: "Asterisk",
                qNum: "NaN",
                qElemNumber: 74,
                qState: "O"
              }
            ],
            [
              {
                qText: "/",
                qNum: "NaN",
                qElemNumber: 133,
                qState: "O"
              },
              {
                qText: "&sol;",
                qNum: "NaN",
                qElemNumber: 133,
                qState: "O"
              },
              {
                qText: "Solidus",
                qNum: "NaN",
                qElemNumber: 133,
                qState: "O"
              }
            ],
            [
              {
                qText: "\\",
                qNum: "NaN",
                qElemNumber: 123,
                qState: "O"
              },
              {
                qText: "&bsol;",
                qNum: "NaN",
                qElemNumber: 123,
                qState: "O"
              },
              {
                qText: "Reverse Solidus",
                qNum: "NaN",
                qElemNumber: 123,
                qState: "O"
              }
            ],
            [
              {
                qText: "&",
                qNum: "NaN",
                qElemNumber: 73,
                qState: "O"
              },
              {
                qText: "&amp;",
                qNum: "NaN",
                qElemNumber: 73,
                qState: "O"
              },
              {
                qText: "Ampersand",
                qNum: "NaN",
                qElemNumber: 73,
                qState: "O"
              }
            ],
            [
              {
                qText: "&;",
                qNum: "NaN",
                qElemNumber: 116,
                qState: "O"
              },
              {
                qText: "&;",
                qNum: "NaN",
                qElemNumber: 116,
                qState: "O"
              },
              {
                qText: "Per Mille Sign",
                qNum: "NaN",
                qElemNumber: 116,
                qState: "O"
              }
            ],
            [
              {
                qText: "#",
                qNum: "NaN",
                qElemNumber: 114,
                qState: "O"
              },
              {
                qText: "&num;",
                qNum: "NaN",
                qElemNumber: 114,
                qState: "O"
              },
              {
                qText: "Number Sign",
                qNum: "NaN",
                qElemNumber: 114,
                qState: "O"
              }
            ],
            [
              {
                qText: "%",
                qNum: "NaN",
                qElemNumber: 118,
                qState: "O"
              },
              {
                qText: "&percnt;",
                qNum: "NaN",
                qElemNumber: 118,
                qState: "O"
              },
              {
                qText: "Percent Sign",
                qNum: "NaN",
                qElemNumber: 118,
                qState: "O"
              }
            ],
            [
              {
                qText: "‱",
                qNum: "NaN",
                qElemNumber: 117,
                qState: "O"
              },
              {
                qText: "&pertenk;",
                qNum: "NaN",
                qElemNumber: 117,
                qState: "O"
              },
              {
                qText: "Per Ten Thousand Sign",
                qNum: "NaN",
                qElemNumber: 117,
                qState: "O"
              }
            ],
            [
              {
                qText: "†",
                qNum: "NaN",
                qElemNumber: 82,
                qState: "O"
              },
              {
                qText: "&dagger;",
                qNum: "NaN",
                qElemNumber: 82,
                qState: "O"
              },
              {
                qText: "Dagger",
                qNum: "NaN",
                qElemNumber: 82,
                qState: "O"
              }
            ],
            [
              {
                qText: "‡",
                qNum: "NaN",
                qElemNumber: 84,
                qState: "O"
              },
              {
                qText: "&Dagger;",
                qNum: "NaN",
                qElemNumber: 84,
                qState: "O"
              },
              {
                qText: "Double Dagger",
                qNum: "NaN",
                qElemNumber: 84,
                qState: "O"
              }
            ],
            [
              {
                qText: "•",
                qNum: "NaN",
                qElemNumber: 76,
                qState: "O"
              },
              {
                qText: "&bull;",
                qNum: "NaN",
                qElemNumber: 76,
                qState: "O"
              },
              {
                qText: "Bullet",
                qNum: "NaN",
                qElemNumber: 76,
                qState: "O"
              }
            ],
            [
              {
                qText: "⁃",
                qNum: "NaN",
                qElemNumber: 99,
                qState: "O"
              },
              {
                qText: "&hybull;",
                qNum: "NaN",
                qElemNumber: 99,
                qState: "O"
              },
              {
                qText: "Hyphen Bullet",
                qNum: "NaN",
                qElemNumber: 99,
                qState: "O"
              }
            ],
            [
              {
                qText: "′",
                qNum: "NaN",
                qElemNumber: 120,
                qState: "O"
              },
              {
                qText: "&prime;",
                qNum: "NaN",
                qElemNumber: 120,
                qState: "O"
              },
              {
                qText: "Prime",
                qNum: "NaN",
                qElemNumber: 120,
                qState: "O"
              }
            ],
            [
              {
                qText: "″",
                qNum: "NaN",
                qElemNumber: 85,
                qState: "O"
              },
              {
                qText: "&Prime;",
                qNum: "NaN",
                qElemNumber: 85,
                qState: "O"
              },
              {
                qText: "Double Prime",
                qNum: "NaN",
                qElemNumber: 85,
                qState: "O"
              }
            ],
            [
              {
                qText: "‴",
                qNum: "NaN",
                qElemNumber: 139,
                qState: "O"
              },
              {
                qText: "&tprime;",
                qNum: "NaN",
                qElemNumber: 139,
                qState: "O"
              },
              {
                qText: "Triple Prime",
                qNum: "NaN",
                qElemNumber: 139,
                qState: "O"
              }
            ],
            [
              {
                qText: "⁗",
                qNum: "NaN",
                qElemNumber: 121,
                qState: "O"
              },
              {
                qText: "&qprime;",
                qNum: "NaN",
                qElemNumber: 121,
                qState: "O"
              },
              {
                qText: "Quadruple Prime",
                qNum: "NaN",
                qElemNumber: 121,
                qState: "O"
              }
            ],
            [
              {
                qText: "‵",
                qNum: "NaN",
                qElemNumber: 124,
                qState: "O"
              },
              {
                qText: "&bprime;",
                qNum: "NaN",
                qElemNumber: 124,
                qState: "O"
              },
              {
                qText: "Reversed Prime",
                qNum: "NaN",
                qElemNumber: 124,
                qState: "O"
              }
            ],
            [
              {
                qText: "⁁",
                qNum: "NaN",
                qElemNumber: 77,
                qState: "O"
              },
              {
                qText: "&caret;",
                qNum: "NaN",
                qElemNumber: 77,
                qState: "O"
              },
              {
                qText: "Caret Insertion Point",
                qNum: "NaN",
                qElemNumber: 77,
                qState: "O"
              }
            ],
            [
              {
                qText: "`",
                qNum: "NaN",
                qElemNumber: 95,
                qState: "O"
              },
              {
                qText: "&grave;",
                qNum: "NaN",
                qElemNumber: 95,
                qState: "O"
              },
              {
                qText: "Grave Accent",
                qNum: "NaN",
                qElemNumber: 95,
                qState: "O"
              }
            ],
            [
              {
                qText: "´",
                qNum: "NaN",
                qElemNumber: 72,
                qState: "O"
              },
              {
                qText: "&acute;",
                qNum: "NaN",
                qElemNumber: 72,
                qState: "O"
              },
              {
                qText: "Acute Accent",
                qNum: "NaN",
                qElemNumber: 72,
                qState: "O"
              }
            ],
            [
              {
                qText: "˜",
                qNum: "NaN",
                qElemNumber: 138,
                qState: "O"
              },
              {
                qText: "&tilde;",
                qNum: "NaN",
                qElemNumber: 138,
                qState: "O"
              },
              {
                qText: "Tilde",
                qNum: "NaN",
                qElemNumber: 138,
                qState: "O"
              }
            ],
            [
              {
                qText: "^",
                qNum: "NaN",
                qElemNumber: 79,
                qState: "O"
              },
              {
                qText: "&Hat;",
                qNum: "NaN",
                qElemNumber: 79,
                qState: "O"
              },
              {
                qText: "Circumflex Accent",
                qNum: "NaN",
                qElemNumber: 79,
                qState: "O"
              }
            ],
            [
              {
                qText: "¯",
                qNum: "NaN",
                qElemNumber: 107,
                qState: "O"
              },
              {
                qText: "&macr;",
                qNum: "NaN",
                qElemNumber: 107,
                qState: "O"
              },
              {
                qText: "Macron",
                qNum: "NaN",
                qElemNumber: 107,
                qState: "O"
              }
            ],
            [
              {
                qText: "¨",
                qNum: "NaN",
                qElemNumber: 83,
                qState: "O"
              },
              {
                qText: "&uml;",
                qNum: "NaN",
                qElemNumber: 83,
                qState: "O"
              },
              {
                qText: "Diaeresis",
                qNum: "NaN",
                qElemNumber: 83,
                qState: "O"
              }
            ],
            [
              {
                qText: "¸",
                qNum: "NaN",
                qElemNumber: 78,
                qState: "O"
              },
              {
                qText: "&cedil;",
                qNum: "NaN",
                qElemNumber: 78,
                qState: "O"
              },
              {
                qText: "Cedilla",
                qNum: "NaN",
                qElemNumber: 78,
                qState: "O"
              }
            ],
            [
              {
                qText: "ˆ",
                qNum: "NaN",
                qElemNumber: 111,
                qState: "O"
              },
              {
                qText: "&circ;",
                qNum: "NaN",
                qElemNumber: 111,
                qState: "O"
              },
              {
                qText: "Modifier Letter Circumflex Accent",
                qNum: "NaN",
                qElemNumber: 111,
                qState: "O"
              }
            ],
            [
              {
                qText: "©",
                qNum: "NaN",
                qElemNumber: 17,
                qState: "O"
              },
              {
                qText: "&copy;",
                qNum: "NaN",
                qElemNumber: 17,
                qState: "O"
              },
              {
                qText: "Copyright Sign",
                qNum: "NaN",
                qElemNumber: 17,
                qState: "O"
              }
            ],
            [
              {
                qText: "®",
                qNum: "NaN",
                qElemNumber: 47,
                qState: "O"
              },
              {
                qText: "&reg;",
                qNum: "NaN",
                qElemNumber: 47,
                qState: "O"
              },
              {
                qText: "Registered Sign",
                qNum: "NaN",
                qElemNumber: 47,
                qState: "O"
              }
            ],
            [
              {
                qText: "℗",
                qNum: "NaN",
                qElemNumber: 62,
                qState: "O"
              },
              {
                qText: "&copysr;",
                qNum: "NaN",
                qElemNumber: 62,
                qState: "O"
              },
              {
                qText: "Sound Recording Copyright",
                qNum: "NaN",
                qElemNumber: 62,
                qState: "O"
              }
            ],
            [
              {
                qText: "℘",
                qNum: "NaN",
                qElemNumber: 55,
                qState: "O"
              },
              {
                qText: "&weierp;",
                qNum: "NaN",
                qElemNumber: 55,
                qState: "O"
              },
              {
                qText: "Script Capital P",
                qNum: "NaN",
                qElemNumber: 55,
                qState: "O"
              }
            ],
            [
              {
                qText: "℞",
                qNum: "NaN",
                qElemNumber: 46,
                qState: "O"
              },
              {
                qText: "&rx;",
                qNum: "NaN",
                qElemNumber: 46,
                qState: "O"
              },
              {
                qText: "Prescription Take",
                qNum: "NaN",
                qElemNumber: 46,
                qState: "O"
              }
            ],
            [
              {
                qText: "℧",
                qNum: "NaN",
                qElemNumber: 33,
                qState: "O"
              },
              {
                qText: "&mho;",
                qNum: "NaN",
                qElemNumber: 33,
                qState: "O"
              },
              {
                qText: "Inverted Ohm Sign",
                qNum: "NaN",
                qElemNumber: 33,
                qState: "O"
              }
            ],
            [
              {
                qText: "℩",
                qNum: "NaN",
                qElemNumber: 64,
                qState: "O"
              },
              {
                qText: "&iiota;",
                qNum: "NaN",
                qElemNumber: 64,
                qState: "O"
              },
              {
                qText: "Turned Greek Small Letter Iota",
                qNum: "NaN",
                qElemNumber: 64,
                qState: "O"
              }
            ],
            [
              {
                qText: "¬",
                qNum: "NaN",
                qElemNumber: 113,
                qState: "O"
              },
              {
                qText: "&not;",
                qNum: "NaN",
                qElemNumber: 113,
                qState: "O"
              },
              {
                qText: "Not Sign",
                qNum: "NaN",
                qElemNumber: 113,
                qState: "O"
              }
            ],
            [
              {
                qText: "|",
                qNum: "NaN",
                qElemNumber: 141,
                qState: "O"
              },
              {
                qText: "&vert;",
                qNum: "NaN",
                qElemNumber: 141,
                qState: "O"
              },
              {
                qText: "Vertical Line",
                qNum: "NaN",
                qElemNumber: 141,
                qState: "O"
              }
            ],
            [
              {
                qText: "¦",
                qNum: "NaN",
                qElemNumber: 75,
                qState: "O"
              },
              {
                qText: "&brvbar;",
                qNum: "NaN",
                qElemNumber: 75,
                qState: "O"
              },
              {
                qText: "Broken Bar",
                qNum: "NaN",
                qElemNumber: 75,
                qState: "O"
              }
            ],
            [
              {
                qText: "⁄",
                qNum: "NaN",
                qElemNumber: 93,
                qState: "O"
              },
              {
                qText: "&frasl;",
                qNum: "NaN",
                qElemNumber: 93,
                qState: "O"
              },
              {
                qText: "Fraction Slash",
                qNum: "NaN",
                qElemNumber: 93,
                qState: "O"
              }
            ],
            [
              {
                qText: "◊",
                qNum: "NaN",
                qElemNumber: 37,
                qState: "O"
              },
              {
                qText: "&loz;",
                qNum: "NaN",
                qElemNumber: 37,
                qState: "O"
              },
              {
                qText: "Lozenge",
                qNum: "NaN",
                qElemNumber: 37,
                qState: "O"
              }
            ],
            [
              {
                qText: "★",
                qNum: "NaN",
                qElemNumber: 7,
                qState: "O"
              },
              {
                qText: "&starf;",
                qNum: "NaN",
                qElemNumber: 7,
                qState: "O"
              },
              {
                qText: "Black Star",
                qNum: "NaN",
                qElemNumber: 7,
                qState: "O"
              }
            ],
            [
              {
                qText: "☆",
                qNum: "NaN",
                qElemNumber: 65,
                qState: "O"
              },
              {
                qText: "&star;",
                qNum: "NaN",
                qElemNumber: 65,
                qState: "O"
              },
              {
                qText: "White Star",
                qNum: "NaN",
                qElemNumber: 65,
                qState: "O"
              }
            ],
            [
              {
                qText: "☎",
                qNum: "NaN",
                qElemNumber: 8,
                qState: "O"
              },
              {
                qText: "&phone;",
                qNum: "NaN",
                qElemNumber: 8,
                qState: "O"
              },
              {
                qText: "Black Telephone",
                qNum: "NaN",
                qElemNumber: 8,
                qState: "O"
              }
            ],
            [
              {
                qText: "♀",
                qNum: "NaN",
                qElemNumber: 31,
                qState: "O"
              },
              {
                qText: "&female;",
                qNum: "NaN",
                qElemNumber: 31,
                qState: "O"
              },
              {
                qText: "Female Sign",
                qNum: "NaN",
                qElemNumber: 31,
                qState: "O"
              }
            ],
            [
              {
                qText: "♂",
                qNum: "NaN",
                qElemNumber: 38,
                qState: "O"
              },
              {
                qText: "&male;",
                qNum: "NaN",
                qElemNumber: 38,
                qState: "O"
              },
              {
                qText: "Male Sign",
                qNum: "NaN",
                qElemNumber: 38,
                qState: "O"
              }
            ],
            [
              {
                qText: "♠",
                qNum: "NaN",
                qElemNumber: 6,
                qState: "O"
              },
              {
                qText: "&spades;",
                qNum: "NaN",
                qElemNumber: 6,
                qState: "O"
              },
              {
                qText: "Black Spade Suit",
                qNum: "NaN",
                qElemNumber: 6,
                qState: "O"
              }
            ],
            [
              {
                qText: "♣",
                qNum: "NaN",
                qElemNumber: 3,
                qState: "O"
              },
              {
                qText: "&clubs;",
                qNum: "NaN",
                qElemNumber: 3,
                qState: "O"
              },
              {
                qText: "Black Club Suit",
                qNum: "NaN",
                qElemNumber: 3,
                qState: "O"
              }
            ],
            [
              {
                qText: "♥",
                qNum: "NaN",
                qElemNumber: 5,
                qState: "O"
              },
              {
                qText: "&hearts;",
                qNum: "NaN",
                qElemNumber: 5,
                qState: "O"
              },
              {
                qText: "Black Heart Suit",
                qNum: "NaN",
                qElemNumber: 5,
                qState: "O"
              }
            ],
            [
              {
                qText: "♦",
                qNum: "NaN",
                qElemNumber: 4,
                qState: "O"
              },
              {
                qText: "&diams;",
                qNum: "NaN",
                qElemNumber: 4,
                qState: "O"
              },
              {
                qText: "Black Diamond Suit",
                qNum: "NaN",
                qElemNumber: 4,
                qState: "O"
              }
            ],
            [
              {
                qText: "♪",
                qNum: "NaN",
                qElemNumber: 30,
                qState: "O"
              },
              {
                qText: "&sung;",
                qNum: "NaN",
                qElemNumber: 30,
                qState: "O"
              },
              {
                qText: "Eighth Note",
                qNum: "NaN",
                qElemNumber: 30,
                qState: "O"
              }
            ],
            [
              {
                qText: "✓",
                qNum: "NaN",
                qElemNumber: 15,
                qState: "O"
              },
              {
                qText: "&check;",
                qNum: "NaN",
                qElemNumber: 15,
                qState: "O"
              },
              {
                qText: "Check Mark",
                qNum: "NaN",
                qElemNumber: 15,
                qState: "O"
              }
            ],
            [
              {
                qText: "✗",
                qNum: "NaN",
                qElemNumber: 1,
                qState: "O"
              },
              {
                qText: "&cross;",
                qNum: "NaN",
                qElemNumber: 1,
                qState: "O"
              },
              {
                qText: "Ballot X",
                qNum: "NaN",
                qElemNumber: 1,
                qState: "O"
              }
            ],
            [
              {
                qText: "✠",
                qNum: "NaN",
                qElemNumber: 39,
                qState: "O"
              },
              {
                qText: "&malt;",
                qNum: "NaN",
                qElemNumber: 39,
                qState: "O"
              },
              {
                qText: "Maltese Cross",
                qNum: "NaN",
                qElemNumber: 39,
                qState: "O"
              }
            ],
            [
              {
                qText: "✶",
                qNum: "NaN",
                qElemNumber: 61,
                qState: "O"
              },
              {
                qText: "&sext;",
                qNum: "NaN",
                qElemNumber: 61,
                qState: "O"
              },
              {
                qText: "Six Pointed Black Star",
                qNum: "NaN",
                qElemNumber: 61,
                qState: "O"
              }
            ],
            [
              {
                qText: "❘",
                qNum: "NaN",
                qElemNumber: 36,
                qState: "O"
              },
              {
                qText: "&VerticalSeparator;",
                qNum: "NaN",
                qElemNumber: 36,
                qState: "O"
              },
              {
                qText: "Light Vertical Bar",
                qNum: "NaN",
                qElemNumber: 36,
                qState: "O"
              }
            ],
            [
              {
                qText: "♭",
                qNum: "NaN",
                qElemNumber: 40,
                qState: "O"
              },
              {
                qText: "&flat;",
                qNum: "NaN",
                qElemNumber: 40,
                qState: "O"
              },
              {
                qText: "Music Flat Sign",
                qNum: "NaN",
                qElemNumber: 40,
                qState: "O"
              }
            ],
            [
              {
                qText: "♮",
                qNum: "NaN",
                qElemNumber: 41,
                qState: "O"
              },
              {
                qText: "&natural;",
                qNum: "NaN",
                qElemNumber: 41,
                qState: "O"
              },
              {
                qText: "Music Natural Sign",
                qNum: "NaN",
                qElemNumber: 41,
                qState: "O"
              }
            ],
            [
              {
                qText: "♯",
                qNum: "NaN",
                qElemNumber: 42,
                qState: "O"
              },
              {
                qText: "&sharp;",
                qNum: "NaN",
                qElemNumber: 42,
                qState: "O"
              },
              {
                qText: "Music Sharp Sign",
                qNum: "NaN",
                qElemNumber: 42,
                qState: "O"
              }
            ],
            [
              {
                qText: "¤",
                qNum: "NaN",
                qElemNumber: 67,
                qState: "O"
              },
              {
                qText: "&curren;",
                qNum: "NaN",
                qElemNumber: 67,
                qState: "O"
              },
              {
                qText: "Currency Sign",
                qNum: "NaN",
                qElemNumber: 67,
                qState: "O"
              }
            ],
            [
              {
                qText: "¢",
                qNum: "NaN",
                qElemNumber: 66,
                qState: "O"
              },
              {
                qText: "&cent;",
                qNum: "NaN",
                qElemNumber: 66,
                qState: "O"
              },
              {
                qText: "Cent Sign",
                qNum: "NaN",
                qElemNumber: 66,
                qState: "O"
              }
            ],
            [
              {
                qText: "$",
                qNum: "NaN",
                qElemNumber: 68,
                qState: "O"
              },
              {
                qText: "&dollar;",
                qNum: "NaN",
                qElemNumber: 68,
                qState: "O"
              },
              {
                qText: "Dollar Sign",
                qNum: "NaN",
                qElemNumber: 68,
                qState: "O"
              }
            ],
            [
              {
                qText: "£",
                qNum: "NaN",
                qElemNumber: 70,
                qState: "O"
              },
              {
                qText: "&pound;",
                qNum: "NaN",
                qElemNumber: 70,
                qState: "O"
              },
              {
                qText: "Pound Sign",
                qNum: "NaN",
                qElemNumber: 70,
                qState: "O"
              }
            ],
            [
              {
                qText: "¥",
                qNum: "NaN",
                qElemNumber: 71,
                qState: "O"
              },
              {
                qText: "&yen;",
                qNum: "NaN",
                qElemNumber: 71,
                qState: "O"
              },
              {
                qText: "Yen Sign",
                qNum: "NaN",
                qElemNumber: 71,
                qState: "O"
              }
            ]
          ],
          qTails: [
            {
              qUp: 0,
              qDown: 0
            },
            {
              qUp: 0,
              qDown: 0
            },
            {
              qUp: 0,
              qDown: 0
            }
          ],
          qArea: {
            qLeft: 0,
            qTop: 0,
            qWidth: 3,
            qHeight: 100
          },
        },
      ],
    },
  ],
});
