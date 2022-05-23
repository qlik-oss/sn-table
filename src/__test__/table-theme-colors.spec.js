import tableThemeColors from '../table-theme-colors';

describe('table-theme-colors', () => {
  const spyQuerySelector = jest.fn();
  const spyGetComputedStyle = jest.fn();
  const spyGetStyle = jest.fn();
  const setObjectAndTableBackgroundColorInTheme =
    (objectBackgroundColor, tableBackgroundColor) => (base, path, attribute) => {
      let backgroundColor;
      if (attribute === 'backgroundColor') {
        backgroundColor = objectBackgroundColor;
      } else if (attribute === 'object.straightTable.backgroundColor') {
        backgroundColor = tableBackgroundColor;
      }
      return backgroundColor;
    };
  const setqvPanelSheetAndqvInnerObject = (selector) => selector;
  const setqvPanelSheetAndqvInnerObjectBackgroundColor =
    (qvPanelSheetBackgroundColor = '#fff', qvInnerObjectBackgroundColor = 'rgba(0, 0, 0, 0)') =>
    (selector) => {
      let backgroundColor;
      if (selector === '.qv-panel-sheet') {
        backgroundColor = { backgroundColor: qvPanelSheetBackgroundColor };
      } else if (selector === '.qv-object .qv-inner-object') {
        backgroundColor = { backgroundColor: qvInnerObjectBackgroundColor };
      }
      return backgroundColor;
    };
  let valueWithLightBackgroundColor = {
    tableBackgroundColorFromTheme: 'inherit',
    backgroundColor: undefined,
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
  let theme;

  beforeEach(() => {
    theme = {
      getStyle: spyGetStyle,
    };
    spyQuerySelector.mockReturnValue(undefined);
  });

  describe('mashup', () => {
    beforeEach(() => {
      global.document.querySelector = spyQuerySelector;
      global.window.getComputedStyle = spyGetComputedStyle;
      spyQuerySelector.mockReturnValue(undefined);
      spyGetComputedStyle.mockReturnValue(undefined);
    });

    describe('when there is no background color in the theme file', () => {
      it('should return the valueWithLightBackgroundColor', () => {
        const result = tableThemeColors(theme);
        expect(result).toEqual(valueWithLightBackgroundColor);
      });
    });

    describe('when there is a background color in the theme file', () => {
      describe('when this is only a object background color', () => {
        describe('when the background color is opaque', () => {
          it('should return the valueWithLightBackgroundColor when the background color is light', () => {
            theme.getStyle = setObjectAndTableBackgroundColorInTheme('#fff');

            const result = tableThemeColors(theme);
            expect(result).toEqual({ ...valueWithLightBackgroundColor, backgroundColor: '#fff' });
          });

          it('should return the valueWithDarkBackgroundColor when the background color is dark', () => {
            theme.getStyle = setObjectAndTableBackgroundColorInTheme('#000');

            const result = tableThemeColors(theme);
            expect(result).toEqual({ ...valueWithDarkBackgroundColor, backgroundColor: '#000' });
          });
        });

        describe('when the background color is transparent', () => {
          it('should return the valueWithLightBackgroundColor and isBackgroundTransparentColor to be true when the background color is light', () => {
            theme.getStyle = setObjectAndTableBackgroundColorInTheme('rgba(255, 255, 255, 0)');

            const result = tableThemeColors(theme);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: 'rgba(255, 255, 255, 0)',
              isBackgroundTransparentColor: true,
            });
          });

          it('should return the valueWithLightBackgroundColor when the background color is dark', () => {
            theme.getStyle = setObjectAndTableBackgroundColorInTheme('rgba(0, 0, 0, 0)');

            const result = tableThemeColors(theme);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              isBackgroundTransparentColor: true,
            });
          });
        });
      });

      describe('when this is only a table background color', () => {
        it('should return the valueWithLightBackgroundColor, backgroundColor, and tableBackgroundColorFromTheme when the background color is light', () => {
          theme.getStyle = setObjectAndTableBackgroundColorInTheme(undefined, '#fff');

          const result = tableThemeColors(theme);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: '#fff',
            tableBackgroundColorFromTheme: '#fff',
          });
        });

        it('should return the valueWithDarkBackgroundColor, backgroundColor, and tableBackgroundColorFromTheme when the background color is dark', () => {
          theme.getStyle = setObjectAndTableBackgroundColorInTheme(undefined, '#000');

          const result = tableThemeColors(theme);
          expect(result).toEqual({
            ...valueWithDarkBackgroundColor,
            backgroundColor: '#000',
            tableBackgroundColorFromTheme: '#000',
          });
        });
      });

      describe('when this are both object and table background color', () => {
        it('should return the default value when the table background color is light', () => {
          theme.getStyle = setObjectAndTableBackgroundColorInTheme('#000', '#fff');

          const result = tableThemeColors(theme);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: '#fff',
            tableBackgroundColorFromTheme: '#fff',
          });
        });

        it('should return the valueWithDarkBackgroundColor when the table background color is dark', () => {
          theme.getStyle = setObjectAndTableBackgroundColorInTheme('#fff', '#000');

          const result = tableThemeColors(theme);
          expect(result).toEqual({
            ...valueWithDarkBackgroundColor,
            backgroundColor: '#000',
            tableBackgroundColorFromTheme: '#000',
          });
        });
      });
    });
  });

  describe('client', () => {
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
      global.document.querySelector = setqvPanelSheetAndqvInnerObject;
      global.window.getComputedStyle = setqvPanelSheetAndqvInnerObjectBackgroundColor();
    });

    describe('when there is no background color from theme or css file', () => {
      it('should return the valueWithLightBackgroundColor', () => {
        const result = tableThemeColors(theme);
        expect(result).toEqual(valueWithLightBackgroundColor);
      });
    });

    describe('when there is a background color from css file on sheet', () => {
      describe('when the background color is dark', () => {
        it('should return the valueWithDarkBackgroundColor', () => {
          global.window.getComputedStyle = setqvPanelSheetAndqvInnerObjectBackgroundColor('#000');

          const result = tableThemeColors(theme);
          expect(result).toEqual(valueWithDarkBackgroundColor);
        });
      });
    });

    describe('when there is a background color from theme file on object', () => {
      describe('when the background color is opaque', () => {
        describe('when the background color is light', () => {
          it('should return the valueWithLightBackgroundColor, backgroundColor, and isBackgroundTransparentColor to be false', () => {
            global.window.getComputedStyle = setqvPanelSheetAndqvInnerObjectBackgroundColor('#000', '#fff');

            const result = tableThemeColors(theme);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: '#fff',
              isBackgroundTransparentColor: false,
            });
          });
        });

        describe('when the background color is dark', () => {
          it('should return the valueWithDarkBackgroundColor, backgroundColor, and isBackgroundTransparentColor to be false', () => {
            global.window.getComputedStyle = setqvPanelSheetAndqvInnerObjectBackgroundColor('#fff', '#000');

            const result = tableThemeColors(theme);
            expect(result).toEqual({
              ...valueWithDarkBackgroundColor,
              backgroundColor: '#000',
              isBackgroundTransparentColor: false,
            });
          });
        });
      });

      describe('when the background color is transparent', () => {
        it('should return the valueWithLightBackgroundColor and backgroundColor', () => {
          global.window.getComputedStyle = setqvPanelSheetAndqvInnerObjectBackgroundColor(
            '#fff',
            'rgba(255, 255, 255, 0)'
          );

          const result = tableThemeColors(theme);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: 'rgba(255, 255, 255, 0)',
          });
        });
      });
    });

    describe('when there is a background color from theme file on table', () => {
      describe('when the background color is opaque', () => {
        describe('when the background color is light', () => {
          it('should return the valueWithLightBackgroundColor and backgroundColor', () => {
            theme.getStyle = setObjectAndTableBackgroundColorInTheme(undefined, '#fff');

            const result = tableThemeColors(theme);
            expect(result).toEqual({
              ...valueWithLightBackgroundColor,
              backgroundColor: '#fff',
              tableBackgroundColorFromTheme: '#fff',
              isBackgroundTransparentColor: false,
            });
          });
        });

        describe('when the background color is dark', () => {
          it('should return the valueWithLightBackgroundColor, backgroundColor, tableBackgroundColorFromTheme and isBackgroundTransparentColor to false', () => {
            theme.getStyle = setObjectAndTableBackgroundColorInTheme(undefined, '#000');

            const result = tableThemeColors(theme);
            expect(result).toEqual({
              ...valueWithDarkBackgroundColor,
              backgroundColor: '#000',
              tableBackgroundColorFromTheme: '#000',
              isBackgroundTransparentColor: false,
            });
          });
        });
      });

      describe('when the background color is transparent', () => {
        it('should return the valueWithLightBackgroundColor, backgroundColor, tableBackgroundColorFromTheme', () => {
          theme.getStyle = setObjectAndTableBackgroundColorInTheme(undefined, 'rgba(255, 255, 255, 0)');

          const result = tableThemeColors(theme);
          expect(result).toEqual({
            ...valueWithLightBackgroundColor,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            tableBackgroundColorFromTheme: 'rgba(255, 255, 255, 0)',
          });
        });
      });
    });
  });
});
