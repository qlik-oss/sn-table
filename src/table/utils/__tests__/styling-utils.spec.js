import {
  STYLING_DEFAULTS,
  SELECTION_STYLING,
  getColor,
  getHeadStyle,
  getBodyStyle,
  getColumnStyle,
  getSelectionColors,
} from '../styling-utils';

describe('styling-utils', () => {
  let resolvedColor;
  let altResolvedColor;
  const theme = {
    // very simple mock of getColorPickerColor. Normally color.color has to be null for the fn to return null
    getColorPickerColor: ({ index }) => {
      switch (index) {
        case -1:
          return null;
        case 0:
          return 'none';
        case 1:
          return resolvedColor;
        case 2:
          return altResolvedColor;
        default:
          return null;
      }
    },
    getStyle: () => {},
  };

  describe('getColor', () => {
    let color;
    let defaultColor;

    beforeEach(() => {
      defaultColor = '#000';
      color = {
        index: -1,
        color: null,
      };
      resolvedColor = '#fff';
    });

    it('should return a hex color when color obj has index', () => {
      color.index = 1;

      const resultColor = getColor(color, defaultColor, theme);
      expect(resultColor).to.equal(resolvedColor);
    });
    it('should return a default color when getColorPickerColor returns falsey', () => {
      const resultColor = getColor(color, defaultColor, theme);
      expect(resultColor).to.equal(defaultColor);
    });
    it('should return a default color when getColorPickerColor returns none', () => {
      // Some palettes have none as the first value in the array of colors
      color.index = 0;

      const resultColor = getColor(color, defaultColor, theme);
      expect(resultColor).to.equal(defaultColor);
    });
    it('should return a default color when color is undefined', () => {
      color = undefined;

      const resultColor = getColor(color, defaultColor, theme);
      expect(resultColor).to.equal(defaultColor);
    });
  });

  describe('getHeadStyle', () => {
    let layout;

    beforeEach(() => {
      layout = {
        components: [
          {
            header: {},
          },
        ],
      };
    });

    it('should return object with only padding when no header property', () => {
      layout = {};

      const resultStyling = getHeadStyle(layout, theme);
      console.log({ resultStyling });
      expect(resultStyling).to.eql({ padding: '7px 14px' });
    });
    it('should call default styling', () => {
      const resultStyling = getHeadStyle(layout, theme);
      console.log({ resultStyling });
      expect(resultStyling).to.eql({
        color: '#404040',
        fontSize: '14px',
        padding: '7px 14px',
      });
    });
  });

  describe('getBodyStyle', () => {
    let layout;

    beforeEach(() => {
      resolvedColor = '#222222'; // dark color
      altResolvedColor = '#dddddd'; // light color

      layout = {
        components: [
          {
            content: {
              fontSize: 22,
              fontColor: {
                index: 1,
                color: null,
              },
              hoverColor: {
                index: -1,
                color: null,
              },
              hoverFontColor: {
                index: -1,
                color: null,
              },
            },
          },
        ],
      };
    });

    it('should return object with only padding when no header property', () => {
      layout = {};

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).to.eql({ padding: '7px 14px' });
    });
    it('should return styling with fontColor, fontSize, padding plus defualt hoverBackgroundColor and hoverFontColor', () => {
      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).to.eql({
        fontSize: 22,
        color: resolvedColor,
        padding: '11px 22px',
        hoverBackgroundColor: ['#f4f4f4', '!important'],
        hoverFontColor: ['', '!important'],
        selectedCellClass: '',
      });
    });
    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      layout.components[0].content.hoverFontColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql(['', '!important']);
      expect(resultStyling.hoverFontColor).to.eql([resolvedColor, '!important']);
    });
    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql([resolvedColor, '!important']);
      expect(resultStyling.hoverFontColor).to.eql([STYLING_DEFAULTS.WHITE, '!important']);
    });
    it('should return styling with light hoverBackgroundColor and no hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql([altResolvedColor, '!important']);
      expect(resultStyling.hoverFontColor).to.eql([STYLING_DEFAULTS.FONT_COLOR, '!important']);
    });
    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;
      layout.components[0].content.hoverFontColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql([resolvedColor, '!important']);
      expect(resultStyling.hoverFontColor).to.eql([altResolvedColor, '!important']);
    });
  });

  describe('getColumnStyle', () => {
    let styling;
    let qAttrExps;
    let stylingInfo;

    beforeEach(() => {
      styling = { color: 'someFontColor' };
      qAttrExps = {
        qValues: [{ qText: '#dddddd' }, { qText: '#111111' }],
      };
      stylingInfo = ['cellBackgroundColor', 'cellForegroundColor'];
    });

    it('should return styling with both new fontColor and backgroundColor when selected', () => {
      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.background).to.equal('#dddddd');
      expect(columnStyle.color).to.equal('#111111');
    });
    it('should return styling with new fontColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[1]];
      stylingInfo = [stylingInfo[1]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.background).to.equal(undefined);
      expect(columnStyle.color).to.equal('#111111');
    });
    it('should return styling with backgroundColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[0]];
      stylingInfo = [stylingInfo[0]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.background).to.equal('#dddddd');
      expect(columnStyle.color).to.equal(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling unchanged', () => {
      qAttrExps = undefined;
      stylingInfo = [];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.background).to.equal(undefined);
      expect(columnStyle.color).to.equal('someFontColor');
    });
  });

  describe('getSelectionStyle', () => {
    let selectionState;
    let cell;
    let background;

    beforeEach(() => {
      background = undefined;
      selectionState = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }], api: { isModal: () => true } };
      cell = { qElemNumber: 1, colIdx: 1 };
    });

    it('should return selected when selected styling', () => {
      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).to.equal(SELECTION_STYLING.SELECTED);
    });
    it('should return excluded styling when other column', () => {
      cell.colIdx = 2;

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).to.eql({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, #fff` });
    });
    it('should return excluded styling with columns background when other column and background color exists', () => {
      cell.colIdx = 2;
      background = 'someColor';

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).to.eql({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, someColor` });
    });
    it('should return possible styling when active and available to select', () => {
      cell.qElemNumber = 2;

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).to.equal(SELECTION_STYLING.POSSIBLE);
    });
    it('should return empty object when no active selections', () => {
      selectionState = { rows: [], api: { isModal: () => false } };

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).to.eql({});
    });
  });
});
