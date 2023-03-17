module.exports = (type) => ({
  type, // added to make Nebula load the dark material UI theme
  _variables: {
    '@myColorLight': '#FFFFFF',
    '@myColorDark': '#404040',
    '@black': '#00000',
    '@white': '#ffffff',
    '@B25': '#404040',
    '@B55': '#8b8b8b',
    '@B80': '#cdcdcd',
    '@B90': '#e5e5e5',
    '@B95': '#F2F2F2',
    '@B98': '#fbfbfb',
    '@transparent': 'rgba(0, 0, 0, 0)',
  },
  fontFamily: 'Source Sans Pro, sans-serif',
  fontSize: '12px',
  color: '@myColorDark',
  backgroundColor: 'rgba(200,200,200,0.3)',
  object: {
    title: {
      main: {
        color: '@myColorDark',
        fontSize: '16px',
      },
      subTitle: {
        color: '@B55',
        fontSize: '14px',
      },
      footer: {
        backgroundColor: '@B98',
        fontSize: '12px',
        color: 'rgba(0, 0, 0, 0.55)',
        fontVariant: 'regular',
      },
    },
    straightTableV2: {
      header: {
        fontSize: '25px',
        color: 'chocolate',
        fontFamily: 'Source Sans Pro',
      },
      content: {
        fontSize: '16px',
        color: 'magenta',
        fontFamily: 'Source Sans Pro',
        hover: {
          backgroundColor: 'black',
          color: 'red',
        },
      },
    },
  },
  palettes: {
    data: [
      {
        name: '12 Colors',
        translation: 'properties.colorNumberOfColors.12',
        propertyValue: '12',
        type: 'pyramid',
        scale: [
          ['#006580'],
          ['#006580', '#87205D'],
          ['#006580', '#10CFC9', '#87205D'],
          ['#006580', '#E0BD8D', '#10CFC9', '#87205D'],
          ['#006580', '#E0BD8D', '#8A85C6', '#10CFC9', '#87205D'],
          ['#006580', '#AC4D58', '#E0BD8D', '#8A85C6', '#10CFC9', '#87205D'],
          ['#006580', '#AC4D58', '#83AF9B', '#E0BD8D', '#8A85C6', '#10CFC9', '#87205D'],
          ['#006580', '#AC4D58', '#E1DAD5', '#83AF9B', '#E0BD8D', '#8A85C6', '#10CFC9', '#87205D'],
          ['#006580', '#AC4D58', '#E1DAD5', '#83AF9B', '#E0BD8D', '#8A85C6', '#10CFC9', '#87205D', '#C4CFDA'],
          [
            '#006580',
            '#C8C7A9',
            '#AC4D58',
            '#E1DAD5',
            '#83AF9B',
            '#E0BD8D',
            '#8A85C6',
            '#10CFC9',
            '#87205D',
            '#C4CFDA',
          ],
          [
            '#006580',
            '#C8C7A9',
            '#AC4D58',
            '#99CFCD',
            '#E1DAD5',
            '#83AF9B',
            '#E0BD8D',
            '#8A85C6',
            '#10CFC9',
            '#87205D',
            '#C4CFDA',
          ],
          [
            '#006580',
            '#C8C7A9',
            '#AC4D58',
            '#99CFCD',
            '#E1DAD5',
            '#83AF9B',
            '#E0BD8D',
            '#8A85C6',
            '#10CFC9',
            '#A16090',
            '#87205D',
            '#C4CFDA',
          ],
        ],
      },
      {
        name: '100 Colors',
        translation: 'properties.colorNumberOfColors.100',
        propertyValue: '100',
        type: 'row',
        scale: [
          '#006580',
          '#C8C7A9',
          '#AC4D58',
          '#99CFCD',
          '#E1DAD5',
          '#83AF9B',
          '#E0BD8D',
          '#8A85C6',
          '#10CFC9',
          '#A16090',
          '#87205D',
          '#C4CFDA',
          '#d0e0da',
          '#d796dd',
          '#64487b',
          '#e4e72b',
          '#6f7330',
          '#932834',
          '#ae6c7d',
          '#986717',
          '#e3cb70',
          '#408c1d',
          '#dd325f',
          '#533d1c',
          '#2a3c54',
          '#db7127',
          '#72e3e2',
          '#e2c1da',
          '#d47555',
          '#7d7f81',
          '#54ae9b',
          '#e9daa6',
          '#3a8855',
          '#5be66e',
          '#ab39a4',
          '#a6e332',
          '#6c469d',
          '#e39e51',
          '#4f1c42',
          '#273c1c',
          '#aa972e',
          '#8bb32a',
          '#bdeca5',
          '#63ec9b',
          '#9c3519',
          '#aaa484',
          '#72256d',
          '#4d749f',
          '#9884df',
          '#e590b8',
          '#44b62b',
          '#ad5792',
          '#c65dea',
          '#e670ca',
          '#e38783',
          '#29312d',
          '#6a2c1e',
          '#d7b1aa',
          '#b1e7c3',
          '#cdc134',
          '#9ee764',
          '#56b8ce',
          '#2c6323',
          '#65464a',
          '#b1cfea',
          '#3c7481',
          '#3a4e96',
          '#6493e1',
          '#db5656',
          '#747259',
          '#bbabe4',
          '#e33f92',
          '#d0607d',
          '#759f79',
          '#9d6b5e',
          '#8574ae',
          '#7e304c',
          '#ad8fac',
          '#4b77de',
          '#647e17',
          '#b9c379',
          '#8da8b0',
          '#b972d9',
          '#786279',
          '#7ec07d',
          '#916436',
          '#2d274f',
          '#dce680',
          '#759748',
          '#dae65a',
          '#459c49',
          '#b7934a',
          '#51c671',
          '#9ead3f',
          '#969a5c',
          '#b9976a',
          '#46531a',
          '#c0f084',
          '#76c146',
          '#bad0ad',
        ],
      },
    ],
    ui: [
      {
        name: 'Palette',
        colors: [
          '#ffffff',
          '#99CFCD',
          '#83AF9B',
          '#C4CFDA',
          '#10CFC9',
          '#006580',
          '#87205D',
          '#8A85C6',
          '#A16090',
          '#AC4D58',
          '#E0BD8D',
          '#E1DAD5',
          '#b0afae',
          '#7b7a78',
          '#000000',
          '#C8C7A9',
        ],
      },
    ],
  },
});
