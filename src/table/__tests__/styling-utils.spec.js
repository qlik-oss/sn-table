import { getColor, getHeadStyle, getBodyStyle } from '../styling-utils';

describe('styling-utils', () => {
  let resolvedColor;
  const theme = {
    // very simple mock of getColorPickerColor. Normally color.color has to be null for the fn to return null
    getColorPickerColor: ({ index }) => (index > -1 ? resolvedColor : null),
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
      resolvedColor = 'none';

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
      resolvedColor = '#fff';
      layout = {
        components: [
          {
            header: {
              fontColor: {
                index: 1,
              },
              fontSize: 12,
            },
          },
        ],
      };
    });

    it('should return object with only padding', () => {
      layout = {};

      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).to.eql({ padding: '7px 14px' });
    });
    it('should return styling with fontColor and fontSize', () => {
      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).to.eql({
        fontColor: '#fff',
        fontSize: 12,
        padding: '6px 12px',
      });
    });
    it('should return styling with fontColor and default fontSize and padding', () => {
      layout.components[0].header.fontSize = null;

      const resultStyling = getHeadStyle(layout, theme);
      expect(resultStyling).to.eql({
        fontColor: '#fff',
        fontSize: '14px',
        padding: '7px 14px',
      });
    });
  });

  describe('getBodyStyle', () => {
    let layout;

    beforeEach(() => {
      resolvedColor = '#fff';
      layout = {};
    });

    it('should return empty object when no components property', () => {
      layout = {};

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).to.eql({});
    });
    it('should return styling with fontColor and fontSize', () => {
      layout = {
        components: [
          {
            content: {
              fontSize: '22px',
              fontColor: {
                index: -1,
                color: null,
              },
              hoverEffect: true,
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

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).to.eql({
        fontSize: '22px',
        fontColor: '#404040',
        hoverBackgroundColor: 'rgba(0, 0, 0, 0.03) !important',
        hoverFontColor: '#404040',
      });
    });
  });
});
