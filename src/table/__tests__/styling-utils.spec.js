import {
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
      expect(resultStyling).to.eql({
        fontColor: '#fff',
        fontSize: 12,
        padding: '6px 12px',
      });
    });
    it('should return styling with fontColor and default fontSize and padding', () => {
      styleObj.fontSize = null;

      const resultStyling = getBaseStyling(styleObj, theme);
      expect(resultStyling).to.eql({
        fontColor: '#fff',
        fontSize: '14px',
        padding: '7px 14px',
      });
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
      expect(resultStyling).to.eql({ padding: '7px 14px' });
    });
    it('should call default styling', () => {
      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).to.eql({
        fontColor: '#404040',
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
        fontColor: resolvedColor,
        padding: '11px 22px',
        hoverBackgroundColor: '#f4f4f4',
        hoverFontColor: '',
        selectedCellClass: '',
      });
    });
    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      layout.components[0].content.hoverFontColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal('');
      expect(resultStyling.hoverFontColor).to.equal(resolvedColor);
    });
    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal(resolvedColor);
      expect(resultStyling.hoverFontColor).to.equal('#fff');
    });
    it('should return styling with light hoverBackgroundColor and no hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal(altResolvedColor);
      expect(resultStyling.hoverFontColor).to.equal('');
    });
    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;
      layout.components[0].content.hoverFontColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal(resolvedColor);
      expect(resultStyling.hoverFontColor).to.equal(altResolvedColor);
    });
  });

  describe('getColumnStyle', () => {
    let styling;
    let qAttrExps;
    let stylingInfo;

    beforeEach(() => {
      styling = { fontColor: 'someFontColor' };
      qAttrExps = {
        qValues: [{ qText: 'someColumnBackground' }, { qText: 'someColumnForeground' }],
      };
      stylingInfo = ['cellBackgroundColor', 'cellForegroundColor'];
    });

    it('should return styling with both new fontColor and backgroundColor when selected', () => {
      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.backgroundColor).to.equal('someColumnBackground');
      expect(columnStyle.fontColor).to.equal('someColumnForeground');
    });
    it('should return styling with new fontColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[1]];
      stylingInfo = [stylingInfo[1]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.backgroundColor).to.equal(undefined);
      expect(columnStyle.fontColor).to.equal('someColumnForeground');
    });
    it('should return styling with backgroundColoe', () => {
      qAttrExps.qValues = [qAttrExps.qValues[0]];
      stylingInfo = [stylingInfo[0]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.backgroundColor).to.equal('someColumnBackground');
      expect(columnStyle.fontColor).to.equal('someFontColor');
    });
    it('should return styling unchanged', () => {
      qAttrExps = undefined;
      stylingInfo = [];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingInfo);
      expect(columnStyle.backgroundColor).to.equal(undefined);
      expect(columnStyle.fontColor).to.equal('someFontColor');
    });
  });

  describe('getSelectionStyle', () => {
    let selState;
    let cell;

    beforeEach(() => {
      selState = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }] };
      cell = { qElemNumber: 1, colIdx: 1 };
    });

    it('should return selected when selected styling', () => {
      const selectionClass = getSelectionColors(cell, selState);
      expect(selectionClass).to.equal(SELECTION_STYLING.SELECTED);
    });
    it('should return excluded styling when other column', () => {
      cell.qElemNumber = 2;
      cell.colIdx = 2;

      const selectionClass = getSelectionColors(cell, selState);
      expect(selectionClass).to.equal(SELECTION_STYLING.EXCLUDED);
    });
    it('should return excluded styling when other column that happens to have the same qElemNumber', () => {
      cell.colIdx = 2;

      const selectionClass = getSelectionColors(cell, selState);
      expect(selectionClass).to.equal(SELECTION_STYLING.EXCLUDED);
    });
    it('should return possible styling when active and available to select', () => {
      cell.qElemNumber = 2;

      const selectionClass = getSelectionColors(cell, selState);
      expect(selectionClass).to.equal(SELECTION_STYLING.POSSIBLE);
    });
    it('should return empty object when no active selections', () => {
      selState = { rows: [] };

      const selectionClass = getSelectionColors(cell, selState);
      expect(selectionClass).to.eql({});
    });
  });
});
