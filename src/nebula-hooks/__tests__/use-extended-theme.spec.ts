import { ExtendedTheme } from '../../types';
import { tableThemeColors } from '../use-extended-theme';

describe('tableThemeColors', () => {
  let themeObjectBackgroundColor: string | undefined;
  let themeTableBackgroundColor: string | undefined;
  let rootElement: HTMLElement;
  let backgroundColor: string | undefined;
  const theme = {
    getStyle: (base: string, path: string, attribute: string) =>
      attribute === 'backgroundColor' ? themeObjectBackgroundColor : themeTableBackgroundColor,
  } as ExtendedTheme;
  let valueWithLightBackgroundColor = {
    tableBackgroundColorFromTheme: 'inherit',
    backgroundColor,
    isBackgroundDarkColor: false,
    isBackgroundTransparentColor: false,
    body: { borderColor: '#D9D9D9' },
    borderColor: '#D9D9D9',
    pagination: {
      borderColor: '#D9D9D9',
      color: '#404040',
      iconColor: 'rgba(0, 0, 0, 0.54)',
      disabledIconColor: 'rgba(0, 0, 0, 0.3)',
    },
  };
  let valueWithDarkBackgroundColor = {
    ...valueWithLightBackgroundColor,
    isBackgroundDarkColor: true,
    body: { borderColor: ' #F2F2F2' },
    borderColor: ' #F2F2F2',
    pagination: {
      borderColor: ' #F2F2F2',
      color: 'rgba(255, 255, 255, 0.9)',
      disabledIconColor: 'rgba(255, 255, 255, 0.3)',
      iconColor: 'rgba(255, 255, 255, 0.9)',
    },
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
        const result = tableThemeColors(theme, rootElement);
        expect(result).toEqual(valueWithLightBackgroundColor);
      });
    });

    describe('when there is a background color in the theme file', () => {
      describe('when this is only a object background color', () => {
        describe('when the background color is opaque', () => {
          it('should return the valueWithLightBackgroundColor when the background color is light', () => {
            themeObjectBackgroundColor = '#fff';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({ ...valueWithLightBackgroundColor, backgroundColor: themeObjectBackgroundColor });
          });

          it('should return the valueWithDarkBackgroundColor when the background color is dark', () => {
            themeObjectBackgroundColor = '#000';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({ ...valueWithDarkBackgroundColor, backgroundColor: themeObjectBackgroundColor });
          });
        });

        describe('when the background color is transparent', () => {
          it('should return the valueWithLightBackgroundColor and isBackgroundTransparentColor to be true when the background color is light', () => {
            themeObjectBackgroundColor = 'rgba(255, 255, 255, 0)';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: themeObjectBackgroundColor,
              isBackgroundTransparentColor: true,
            });
          });

          it('should return the valueWithLightBackgroundColor when the background color is dark', () => {
            themeObjectBackgroundColor = 'rgba(0, 0, 0, 0)';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: themeObjectBackgroundColor,
              isBackgroundTransparentColor: true,
            });
          });
        });
      });

      describe('when this is only a table background color', () => {
        it('should return the valueWithLightBackgroundColor, backgroundColor, and tableBackgroundColorFromTheme when the background color is light', () => {
          themeObjectBackgroundColor = undefined;
          themeTableBackgroundColor = '#fff';

          const result = tableThemeColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: themeTableBackgroundColor,
            tableBackgroundColorFromTheme: themeTableBackgroundColor,
          });
        });

        it('should return the valueWithDarkBackgroundColor, backgroundColor, and tableBackgroundColorFromTheme when the background color is dark', () => {
          themeObjectBackgroundColor = undefined;
          themeTableBackgroundColor = '#000';

          const result = tableThemeColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithDarkBackgroundColor,
            backgroundColor: themeTableBackgroundColor,
            tableBackgroundColorFromTheme: themeTableBackgroundColor,
          });
        });
      });

      describe('when this are both object and table background color', () => {
        it('should return the default value when the table background color is light', () => {
          themeObjectBackgroundColor = '#000';
          themeTableBackgroundColor = '#fff';

          const result = tableThemeColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: themeTableBackgroundColor,
            tableBackgroundColorFromTheme: themeTableBackgroundColor,
          });
        });

        it('should return the valueWithDarkBackgroundColor when the table background color is dark', () => {
          themeObjectBackgroundColor = '#fff';
          themeTableBackgroundColor = '#000';

          const result = tableThemeColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithDarkBackgroundColor,
            backgroundColor: themeTableBackgroundColor,
            tableBackgroundColorFromTheme: themeTableBackgroundColor,
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
      } as CSSStyleDeclaration);

    beforeEach(() => {
      valueWithLightBackgroundColor = {
        ...valueWithLightBackgroundColor,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        isBackgroundTransparentColor: true,
      };
      valueWithDarkBackgroundColor = {
        ...valueWithDarkBackgroundColor,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        isBackgroundTransparentColor: true,
      };
      qvPanelSheetBackgroundColor = '#fff';
      qvInnerObjectBackgroundColor = 'rgba(0, 0, 0, 0)';
    });

    describe('when there is no background color from theme or css file', () => {
      it('should return the valueWithLightBackgroundColor', () => {
        const result = tableThemeColors(theme, rootElement);
        expect(result).toEqual(valueWithLightBackgroundColor);
      });
    });

    describe('when there is a background color from css file on sheet', () => {
      describe('when the background color is dark', () => {
        it('should return the valueWithDarkBackgroundColor', () => {
          qvPanelSheetBackgroundColor = '#000';

          const result = tableThemeColors(theme, rootElement);
          expect(result).toEqual(valueWithDarkBackgroundColor);
        });
      });
    });

    describe('when there is a background color from theme file on object', () => {
      describe('when the background color is opaque', () => {
        describe('when the background color is light', () => {
          it('should return the valueWithLightBackgroundColor, backgroundColor, and isBackgroundTransparentColor to be false', () => {
            qvPanelSheetBackgroundColor = '#000';
            qvInnerObjectBackgroundColor = '#fff';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: qvInnerObjectBackgroundColor,
              isBackgroundTransparentColor: false,
            });
          });
        });

        describe('when the background color is dark', () => {
          it('should return the valueWithDarkBackgroundColor, backgroundColor, and isBackgroundTransparentColor to be false', () => {
            qvInnerObjectBackgroundColor = '#000';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithDarkBackgroundColor,
              backgroundColor: qvInnerObjectBackgroundColor,
              isBackgroundTransparentColor: false,
            });
          });
        });
      });

      describe('when the background color is transparent', () => {
        it('should return the valueWithLightBackgroundColor and backgroundColor', () => {
          qvPanelSheetBackgroundColor = '#fff';
          qvInnerObjectBackgroundColor = 'rgba(255, 255, 255, 0)';

          const result = tableThemeColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: qvInnerObjectBackgroundColor,
          });
        });
      });
    });

    describe('when there is a background color from theme file on table', () => {
      describe('when the background color is opaque', () => {
        describe('when the background color is light', () => {
          it('should return the valueWithLightBackgroundColor and backgroundColor', () => {
            themeTableBackgroundColor = '#fff';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: themeTableBackgroundColor,
              tableBackgroundColorFromTheme: themeTableBackgroundColor,
              isBackgroundTransparentColor: false,
            });
          });
        });

        describe('when the background color is dark', () => {
          it('should return the valueWithLightBackgroundColor, backgroundColor, tableBackgroundColorFromTheme and isBackgroundTransparentColor to false', () => {
            themeTableBackgroundColor = '#000';

            const result = tableThemeColors(theme, rootElement);
            expect(result).toEqual({
              ...valueWithDarkBackgroundColor,
              backgroundColor: themeTableBackgroundColor,
              tableBackgroundColorFromTheme: themeTableBackgroundColor,
              isBackgroundTransparentColor: false,
            });
          });
        });
      });

      describe('when the background color is transparent', () => {
        it('should return the valueWithLightBackgroundColor, backgroundColor, tableBackgroundColorFromTheme', () => {
          themeTableBackgroundColor = 'rgba(255, 255, 255, 0)';

          const result = tableThemeColors(theme, rootElement);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: themeTableBackgroundColor,
            tableBackgroundColorFromTheme: themeTableBackgroundColor,
          });
        });
      });
    });
  });
});
