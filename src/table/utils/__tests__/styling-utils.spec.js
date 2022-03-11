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
      expect(resultColor).toEqual(resolvedColor);
    });
    it('should return a default color when getColorPickerColor returns falsey', () => {
      const resultColor = getColor(color, defaultColor, theme);
      expect(resultColor).toEqual(defaultColor);
    });
    it('should return a default color when getColorPickerColor returns none', () => {
      // Some palettes have none as the first value in the array of colors
      color.index = 0;

      const resultColor = getColor(color, defaultColor, theme);
      expect(resultColor).toEqual(defaultColor);
    });
    it('should return a default color when color is undefined', () => {
      color = undefined;

      const resultColor = getColor(color, defaultColor, theme);
      expect(resultColor).toEqual(defaultColor);
    });
  });

  describe('getBaseStyling', () => {
    let styleObj;

    beforeEach(() => {
      resolvedColor = '#fff';
      styleObj = {
        fontColor: {
          index: 1,
          color: null,
        },
        fontSize: 12,
      };
    });

    it('should return styling with fontColor and fontSize', () => {
      const resultStyling = getBaseStyling(styleObj, theme);
      expect(resultStyling).toEqual({
        color: '#fff',
        fontSize: 12,
        padding: '6px 12px',
      });
    });
    it('should return styling with fontColor and default fontSize and padding', () => {
      styleObj.fontSize = null;

      const resultStyling = getBaseStyling(styleObj, theme);
      expect(resultStyling).toEqual({
        color: '#fff',
        fontSize: '14px',
        padding: '7px 14px',
      });
    });
    it('should return styling with custom padding', () => {
      styleObj.padding = '4px';

      const resultStyling = getBaseStyling(styleObj, theme);
      expect(resultStyling.padding).toEqual('4px');
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
      expect(resultStyling).toEqual({ padding: '7px 14px' });
    });
    it('should call default styling', () => {
      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).toEqual({
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
      expect(resultStyling).toEqual({ padding: '7px 14px' });
    });
    it('should return styling with fontColor, fontSize, padding plus defualt hoverBackgroundColor and hoverFontColor', () => {
      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).toEqual({
        fontSize: 22,
        color: resolvedColor,
        padding: '11px 22px',
        hoverBackgroundColor: '#f4f4f4',
        hoverFontColor: '',
        selectedCellClass: 'unselected',
      });
    });
    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      layout.components[0].content.hoverFontColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toEqual('');
      expect(resultStyling.hoverFontColor).toEqual(resolvedColor);
    });
    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toEqual(resolvedColor);
      expect(resultStyling.hoverFontColor).toEqual(STYLING_DEFAULTS.WHITE);
    });
    it('should return styling with light hoverBackgroundColor and no hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toEqual(altResolvedColor);
      expect(resultStyling.hoverFontColor).toEqual(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;
      layout.components[0].content.hoverFontColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toEqual(resolvedColor);
      expect(resultStyling.hoverFontColor).toEqual(altResolvedColor);
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
      expect(columnStyle.background).toEqual('#dddddd');
      expect(columnStyle.color).toEqual('#111111');
    });
    it('should return styling with new fontColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[1]];
      stylingInfo = [stylingInfo[1]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.background).toEqual(undefined);
      expect(columnStyle.color).toEqual('#111111');
    });
    it('should return styling with backgroundColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[0]];
      stylingInfo = [stylingInfo[0]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.background).toEqual('#dddddd');
      expect(columnStyle.color).toEqual(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling unchanged', () => {
      qAttrExps = undefined;
      stylingInfo = [];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.background).toEqual(undefined);
      expect(columnStyle.color).toEqual('someFontColor');
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
      expect(selectionClass).toEqual(SELECTION_STYLING.SELECTED);
    });
    it('should return excluded styling when other column', () => {
      cell.colIdx = 2;

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).toEqual({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, #fff` });
    });
    it('should return excluded styling with columns background when other column and background color exists', () => {
      cell.colIdx = 2;
      background = 'someColor';

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).toEqual({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, someColor` });
    });
    it('should return possible styling when active and available to select', () => {
      cell.qElemNumber = 2;

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).toEqual(SELECTION_STYLING.POSSIBLE);
    });
    it('should return empty object when no active selections', () => {
      selectionState = { rows: [], api: { isModal: () => false } };

      const selectionClass = getSelectionColors(background, cell, selectionState);
      expect(selectionClass).toEqual({});
    });
  });
});
