import {
  STYLING_DEFAULTS,
  SELECTION_STYLING,
  getColor,
  getBaseStyling,
  getHeaderStyle,
  getBodyCellStyle,
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
    table: {
      body: { borderColor: '1px solid #D9D9D9' },
      backgroundColor: '#323232',
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

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).toBe(resolvedColor);
    });
    it('should return a default color when getColorPickerColor returns false', () => {
      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).toBe(defaultColor);
    });

    it('should return a default color when getColorPickerColor returns none', () => {
      // Some palettes have none as the first value in the array of colors
      color.index = 0;

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).toBe(defaultColor);
    });

    it('should return a default color when color is undefined', () => {
      color = undefined;

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).toBe(defaultColor);
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
      expect(resultStyling).toEqual({
        color: '#fff',
        fontSize: 12,
        padding: '6px 12px',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
      });
    });
    it('should return styling with fontSize and padding', () => {
      styleObj.fontColor = null;
      const resultStyling = getBaseStyling(styleObj, objetName, theme);
      expect(resultStyling).toEqual({
        fontSize: 12,
        padding: '6px 12px',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
      });
    });
    it('should return styling with fontColor as the font size and padding are from sprout theme', () => {
      styleObj.fontSize = null;

      const resultStyling = getBaseStyling(styleObj, objetName, theme);
      expect(resultStyling).toEqual({
        color: '#fff',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
      });
    });
    it('should return styling with custom padding', () => {
      styleObj.padding = '4px';

      const resultStyling = getBaseStyling(styleObj, objetName, theme);
      expect(resultStyling.padding).toBe('4px');
    });
  });

  describe('getHeaderStyle', () => {
    let layout;

    beforeEach(() => {
      layout = {
        components: [
          {
            header: {
              fontColor: '#444444',
              fontSize: 44,
            },
          },
        ],
      };
    });

    it('should return empty object except backgroundColor and border as the padding and font size are from sprout theme', () => {
      layout = {};

      const resultStyling = getHeaderStyle(layout, theme);
      expect(resultStyling).toEqual({
        backgroundColor: '#323232',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
        borderTop: '1px solid #D9D9D9',
        sortLabelColor: 'rgba(255,255,255,0.9)',
      });
    });
    it('should return header style with only fontColor except backgroundColor and border', () => {
      layout = {
        components: [
          {
            header: {
              fontColor: '#444444',
            },
          },
        ],
      };

      const resultStyling = getHeaderStyle(layout, theme);
      expect(resultStyling).toEqual({
        color: '#404040',
        backgroundColor: '#323232',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
        borderTop: '1px solid #D9D9D9',
        sortLabelColor: 'rgba(255,255,255,0.9)',
      });
    });
    it('should return all header style from layout', () => {
      const resultStyling = getHeaderStyle(layout, theme);
      expect(resultStyling).toEqual({
        color: '#404040',
        fontSize: 44,
        padding: '22px 44px',
        backgroundColor: '#323232',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
        borderTop: '1px solid #D9D9D9',
        sortLabelColor: 'rgba(255,255,255,0.9)',
      });
    });
  });

  describe('getBodyCellStyle', () => {
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

    it('should return styling with default hoverBackgroundColor and hoverFontColor', () => {
      layout = {};

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling).toEqual({
        hoverBackgroundColor: '#f4f4f4',
        hoverFontColor: '',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
      });
    });
    it('should return styling with fontColor, fontSize, padding plus default hoverBackgroundColor and hoverFontColor', () => {
      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling).toEqual({
        fontSize: 22,
        color: resolvedColor,
        padding: '11px 22px',
        hoverBackgroundColor: '#f4f4f4',
        hoverFontColor: '',
        borderBottom: '1px solid #D9D9D9',
        borderRight: '1px solid #D9D9D9',
      });
    });
    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      layout.components[0].content.hoverFontColor.index = 1;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe('');
      expect(resultStyling.hoverFontColor).toBe(resolvedColor);
    });
    it('should return styling with light hoverBackgroundColor from theme and the default hoverFontColor', () => {
      theme.getStyle = () => '#111';

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe('#111');
      expect(resultStyling.hoverFontColor).toBe(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe(resolvedColor);
      expect(resultStyling.hoverFontColor).toBe(STYLING_DEFAULTS.WHITE);
    });
    it('should return styling with light hoverBackgroundColor and the default hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 2;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe(altResolvedColor);
      expect(resultStyling.hoverFontColor).toBe(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;
      layout.components[0].content.hoverFontColor.index = 2;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe(resolvedColor);
      expect(resultStyling.hoverFontColor).toBe(altResolvedColor);
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
      expect(columnStyle.backgroundColor).toBe('#dddddd');
      expect(columnStyle.color).toBe('#111111');
    });
    it('should return styling with new fontColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[1]];
      stylingInfo = [stylingInfo[1]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.backgroundColor).toBe(undefined);
      expect(columnStyle.color).toBe('#111111');
    });
    it('should return styling with backgroundColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[0]];
      stylingInfo = [stylingInfo[0]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.backgroundColor).toBe('#dddddd');
      expect(columnStyle.color).toBe(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling unchanged', () => {
      qAttrExps = undefined;
      stylingInfo = [];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.backgroundColor).toBe(undefined);
      expect(columnStyle.color).toBe('someFontColor');
    });
  });

  describe('getSelectionStyle', () => {
    let selectionState;
    let cell;
    let background;
    let themeBackgroundColor;

    beforeEach(() => {
      background = undefined;
      selectionState = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }], api: { isModal: () => true } };
      cell = { qElemNumber: 1, colIdx: 1 };
      themeBackgroundColor = '#123456';
    });

    it('should return selected when selected styling', () => {
      const selectionClass = getSelectionColors(cell, selectionState, background, themeBackgroundColor);
      expect(selectionClass).toBe(SELECTION_STYLING.SELECTED);
    });
    it('should return excluded styling when other column', () => {
      cell.colIdx = 2;

      const selectionClass = getSelectionColors(cell, selectionState, background, themeBackgroundColor);
      expect(selectionClass).toEqual({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, #123456` });
    });
    it('should return excluded styling with columns background when other column and background color exists', () => {
      cell.colIdx = 2;
      background = 'someColor';

      const selectionClass = getSelectionColors(cell, selectionState, background, themeBackgroundColor);
      expect(selectionClass).toEqual({ background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, someColor` });
    });
    it('should return possible styling when active and available to select', () => {
      cell.qElemNumber = 2;

      const selectionClass = getSelectionColors(cell, selectionState, background, themeBackgroundColor);
      expect(selectionClass).toBe(SELECTION_STYLING.POSSIBLE);
    });
    it('should return empty object when no active selections', () => {
      selectionState = { rows: [], api: { isModal: () => false } };

      const selectionClass = getSelectionColors(cell, selectionState, background, themeBackgroundColor);
      expect(selectionClass).toEqual({});
    });
  });
});
