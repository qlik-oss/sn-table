import { getColor, getBaseStyling, getHeadStyle, getBodyStyle } from '../styling-utils';

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
        hoverFontColor: resolvedColor,
      });
    });
    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      layout.components[0].content.hoverFontColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal('rgba(0, 0, 0, 0)');
      expect(resultStyling.hoverFontColor).to.equal(resolvedColor);
    });
    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal(resolvedColor);
      expect(resultStyling.hoverFontColor).to.equal('#fff');
    });
    it('should return styling with light hoverBackgroundColor and fontColor as hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal(altResolvedColor);
      expect(resultStyling.hoverFontColor).to.equal(resolvedColor);
    });
    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      layout.components[0].content.hoverColor.index = 1;
      layout.components[0].content.hoverFontColor.index = 2;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).to.equal(resolvedColor);
      expect(resultStyling.hoverFontColor).to.equal(altResolvedColor);
    });
  });
});
