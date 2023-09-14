import { ExtendedTheme } from '../../types';
import { getBackgroundColors } from '../use-extended-theme';

describe('getBackgroundColors', () => {
  let themeObjectBackgroundColor: string | undefined;
  let themeTableBackgroundColor: string | undefined;
  let rootElement: HTMLElement;
  let color: string | undefined;
  const theme = {
    getStyle: (base: string, path: string, attribute: string) =>
      attribute === 'backgroundColor' ? themeObjectBackgroundColor : themeTableBackgroundColor,
  } as ExtendedTheme;
  let valueWithLightBackgroundColor = {
    tableColorFromTheme: 'inherit',
    color,
    isDark: false,
    isTransparent: false,
  };
  let valueWithDarkBackgroundColor = {
    ...valueWithLightBackgroundColor,
    isDark: true,
  };

  beforeEach(() => {
    themeTableBackgroundColor = undefined;
    themeObjectBackgroundColor = undefined;
  });

  describe('mashup', () => {
    rootElement = {
      closest: () => null,
    } as unknown as HTMLElement;

    describe('when there is no background color in the theme file', () => {
      it('should return the valueWithLightBackgroundColor', () => {
        const result = getBackgroundColors(theme, rootElement);
        expect(result).toEqual(valueWithLightBackgroundColor);
      });
    });

    describe('when there is a background color in the theme file', () => {
      describe('when this is only a object background color', () => {
        describe('when the background color is opaque', () => {
          it('should return the valueWithLightBackgroundColor when the background color is light', () => {
            themeObjectBackgroundColor = '#fff';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({ ...valueWithLightBackgroundColor, color: themeObjectBackgroundColor });
          });

          it('should return the valueWithDarkBackgroundColor when the background color is dark', () => {
            themeObjectBackgroundColor = '#000';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({ ...valueWithDarkBackgroundColor, color: themeObjectBackgroundColor });
          });
        });

        describe('when the background color is transparent', () => {
          it('should return the valueWithLightBackgroundColor and isTransparent to be true when the background color is light', () => {
            themeObjectBackgroundColor = 'rgba(255, 255, 255, 0)';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              color: themeObjectBackgroundColor,
              isTransparent: true,
            });
          });

          it('should return the valueWithLightBackgroundColor when the background color is dark', () => {
            themeObjectBackgroundColor = 'rgba(0, 0, 0, 0)';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              color: themeObjectBackgroundColor,
              isTransparent: true,
            });
          });
        });
      });

      describe('when this is only a table background color', () => {
        it('should return the valueWithLightBackgroundColor, backgroundColor, and tableColorFromTheme when the background color is light', () => {
          themeObjectBackgroundColor = undefined;
          themeTableBackgroundColor = '#fff';

          const result = getBackgroundColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            color: themeTableBackgroundColor,
            tableColorFromTheme: themeTableBackgroundColor,
          });
        });

        it('should return the valueWithDarkBackgroundColor, backgroundColor, and tableColorFromTheme when the background color is dark', () => {
          themeObjectBackgroundColor = undefined;
          themeTableBackgroundColor = '#000';

          const result = getBackgroundColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithDarkBackgroundColor,
            color: themeTableBackgroundColor,
            tableColorFromTheme: themeTableBackgroundColor,
          });
        });
      });

      describe('when this are both object and table background color', () => {
        it('should return the default value when the table background color is light', () => {
          themeObjectBackgroundColor = '#000';
          themeTableBackgroundColor = '#fff';

          const result = getBackgroundColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            color: themeTableBackgroundColor,
            tableColorFromTheme: themeTableBackgroundColor,
          });
        });

        it('should return the valueWithDarkBackgroundColor when the table background color is dark', () => {
          themeObjectBackgroundColor = '#fff';
          themeTableBackgroundColor = '#000';

          const result = getBackgroundColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithDarkBackgroundColor,
            color: themeTableBackgroundColor,
            tableColorFromTheme: themeTableBackgroundColor,
          });
        });
      });
    });
  });

  describe('client', () => {
    rootElement = {
      closest: (selector: string): HTMLElement => {
        // This needs to return a proper HTMLelement for getComputedStyle to work later
        const el = document.createElement('div');
        // Need to split the selector since it can be two classes
        el.classList.add(...selector.split(' '));
        return el;
      },
    } as HTMLElement;
    let qvPanelSheetBackgroundColor: string;
    let qvInnerObjectBackgroundColor: string;
    global.window.getComputedStyle = (selector) =>
      ({
        backgroundColor: selector.classList.contains('.qv-panel-sheet')
          ? qvPanelSheetBackgroundColor
          : qvInnerObjectBackgroundColor,
      }) as CSSStyleDeclaration;

    beforeEach(() => {
      valueWithLightBackgroundColor = {
        ...valueWithLightBackgroundColor,
        color: 'rgba(0, 0, 0, 0)',
        isTransparent: true,
      };
      valueWithDarkBackgroundColor = {
        ...valueWithDarkBackgroundColor,
        color: 'rgba(0, 0, 0, 0)',
        isTransparent: true,
      };
      qvPanelSheetBackgroundColor = '#fff';
      qvInnerObjectBackgroundColor = 'rgba(0, 0, 0, 0)';
    });

    describe('when there is no background color from theme or css file', () => {
      it('should return the valueWithLightBackgroundColor', () => {
        const result = getBackgroundColors(theme, rootElement);
        expect(result).toEqual(valueWithLightBackgroundColor);
      });
    });

    describe('when there is a background color from css file on sheet', () => {
      describe('when the background color is dark', () => {
        it('should return the valueWithDarkBackgroundColor', () => {
          qvPanelSheetBackgroundColor = '#000';

          const result = getBackgroundColors(theme, rootElement);
          expect(result).toEqual(valueWithDarkBackgroundColor);
        });
      });
    });

    describe('when there is a background color from theme file on object', () => {
      describe('when the background color is opaque', () => {
        describe('when the background color is light', () => {
          it('should return the valueWithLightBackgroundColor, backgroundColor, and isTransparent to be false', () => {
            qvPanelSheetBackgroundColor = '#000';
            qvInnerObjectBackgroundColor = '#fff';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              color: qvInnerObjectBackgroundColor,
              isTransparent: false,
            });
          });
        });

        describe('when the background color is dark', () => {
          it('should return the valueWithDarkBackgroundColor, backgroundColor, and isTransparent to be false', () => {
            qvInnerObjectBackgroundColor = '#000';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithDarkBackgroundColor,
              color: qvInnerObjectBackgroundColor,
              isTransparent: false,
            });
          });
        });
      });

      describe('when the background color is transparent', () => {
        it('should return the valueWithLightBackgroundColor and backgroundColor', () => {
          qvPanelSheetBackgroundColor = '#fff';
          qvInnerObjectBackgroundColor = 'rgba(255, 255, 255, 0)';

          const result = getBackgroundColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            color: qvInnerObjectBackgroundColor,
          });
        });
      });
    });

    describe('when there is a background color from theme file on table', () => {
      describe('when the background color is opaque', () => {
        describe('when the background color is light', () => {
          it('should return the valueWithLightBackgroundColor and backgroundColor', () => {
            themeTableBackgroundColor = '#fff';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              color: themeTableBackgroundColor,
              tableColorFromTheme: themeTableBackgroundColor,
              isTransparent: false,
            });
          });
        });

        describe('when the background color is dark', () => {
          it('should return the valueWithLightBackgroundColor, backgroundColor, tableColorFromTheme and isTransparent to false', () => {
            themeTableBackgroundColor = '#000';

            const result = getBackgroundColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithDarkBackgroundColor,
              color: themeTableBackgroundColor,
              tableColorFromTheme: themeTableBackgroundColor,
              isTransparent: false,
            });
          });
        });
      });

      describe('when the background color is transparent', () => {
        it('should return the valueWithLightBackgroundColor, backgroundColor, tableColorFromTheme', () => {
          themeTableBackgroundColor = 'rgba(255, 255, 255, 0)';

          const result = getBackgroundColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            color: themeTableBackgroundColor,
            tableColorFromTheme: themeTableBackgroundColor,
          });
        });
      });
    });
  });
});
