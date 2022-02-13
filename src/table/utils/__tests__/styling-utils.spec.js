import {
  STYLING_DEFAULTS,
  SELECTION_STYLING,
  getColor,
  getBaseStyling,
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

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).to.equal(resolvedColor);
    });
    it('should return a default color when getColorPickerColor returns false', () => {
      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).to.equal(defaultColor);
    });
    it('should return a default color when getColorPickerColor returns none', () => {
      // Some palettes have none as the first value in the array of colors
      color.index = 0;

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).to.equal(defaultColor);
    });
    it('should return a default color when color is undefined', () => {
      color = undefined;

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).to.equal(defaultColor);
    });
  });

  describe('getBaseStyling', () => {
    let styleObj;
    let objetName;

    beforeEach(() => {
      resolvedColor = '#fff';
      styleObj = {
        fontColor: {
          index: 1,
          color: null,
        },
        fontSize: 12,
      };
      objetName = '';
    });

    it('should return styling with fontColor and fontSize', () => {
      const resultStyling = getBaseStyling(styleObj, objetName, theme);
      expect(resultStyling).to.eql({
        color: '#fff',
        fontSize: 12,
      });
    });
    it('should return styling with fontSize', () => {
      styleObj.fontColor = null;
      const resultStyling = getBaseStyling(styleObj, objetName, theme);
      expect(resultStyling).to.eql({
        fontSize: 12,
      });
    });
    it('should return styling with fontColor as the font size and padding are from sprout theme', () => {
      styleObj.fontSize = null;

      const resultStyling = getBaseStyling(styleObj, objetName, theme);
      expect(resultStyling).to.eql({
        color: '#fff',
      });
    });
  });

  describe('getHeadStyle', () => {
    let layout;

    beforeEach(() => {
      layout = {
        components: [
          {
            header: {
              fontColor: '#444444',
              fontSize: '44px',
            },
          },
        ],
      };
    });

    it('should return empty object as the padding and font size are from sprout theme', () => {
      layout = {};

      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).to.eql({});
    });
    it('should return header style with only fontColor', () => {
      layout = {
        components: [
          {
            header: {
              fontColor: '#444444',
            },
          },
        ],
      };

      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).to.eql({
        color: '#404040',
      });
    });
    it('should return header style from layout', () => {
      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).to.eql({
        color: '#404040',
        fontSize: '44px',
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

    it('should return styling with  default hoverBackgroundColor and hoverFontColor', () => {
      layout = {};

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).to.eql({ hoverBackgroundColor: '#f4f4f4', hoverFontColor: '' });
    });
    it('should return styling with fontColor, fontSize, padding plus default hoverBackgroundColor and hoverFontColor', () => {
      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).to.eql({
        fontSize: 22,
        color: resolvedColor,
        hoverBackgroundColor: '#f4f4f4',
        hoverFontColor: '',
      });
    });
    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      layout.components[0].content.hoverFontColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql('');
      expect(resultStyling.hoverFontColor).to.eql(resolvedColor);
    });
    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql(resolvedColor);
      expect(resultStyling.hoverFontColor).to.eql(STYLING_DEFAULTS.WHITE);
    });
    it('should return styling with light hoverBackgroundColor and no hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql(altResolvedColor);
      expect(resultStyling.hoverFontColor).to.eql(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;
      layout.components[0].content.hoverFontColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.eql(resolvedColor);
      expect(resultStyling.hoverFontColor).to.eql(altResolvedColor);
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
    let tableBackgroundColor;

    beforeEach(() => {
      background = undefined;
      selectionState = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }], api: { isModal: () => true } };
      cell = { qElemNumber: 1, colIdx: 1 };
      tableBackgroundColor = '#123456';
    });

    it('should return selected when selected styling', () => {
      const selectionClass = getSelectionColors(cell, selectionState, background, tableBackgroundColor);
      expect(selectionClass).to.equal(SELECTION_STYLING.SELECTED);
    });
    it('should return excluded styling when other column', () => {
      cell.colIdx = 2;

      const selectionClass = getSelectionColors(cell, selectionState, background, tableBackgroundColor);
      expect(selectionClass).to.eql({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, #123456` });
    });
    it('should return excluded styling with columns background when other column and background color exists', () => {
      cell.colIdx = 2;
      background = 'someColor';

      const selectionClass = getSelectionColors(cell, selectionState, background, tableBackgroundColor);
      expect(selectionClass).to.eql({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, someColor` });
    });
    it('should return possible styling when active and available to select', () => {
      cell.qElemNumber = 2;

      const selectionClass = getSelectionColors(cell, selectionState, background, tableBackgroundColor);
      expect(selectionClass).to.equal(SELECTION_STYLING.POSSIBLE);
    });
    it('should return empty object when no active selections', () => {
      selectionState = { rows: [], api: { isModal: () => false } };

      const selectionClass = getSelectionColors(cell, selectionState, background, tableBackgroundColor);
      expect(selectionClass).to.eql({});
    });
  });
});
