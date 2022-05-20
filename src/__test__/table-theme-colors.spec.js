import tableThemeColors from '../table-theme-colors';

describe('table-theme-colors', () => {
  const spyQuerySelector = jest.fn();
  const spyGetComputedStyle = jest.fn();
  const spyGetStyle = jest.fn();
  const defaultValue = {
    tableBackgroundColorFromTheme: 'inherit',
    backgroundColor: undefined,
    isBackgroundTransparentColor: false,
    isBackgroundDarkColor: false,
    borderColor: '#D9D9D9',
    body: { borderColor: '#D9D9D9' },
    pagination: {
      borderColor: '#D9D9D9',
      color: '#404040',
      iconColor: 'rgba(0, 0, 0, 0.54)',
      disabledIconColor: 'rgba(0, 0, 0, 0.3)',
    },
  };
  const darkBackgroundColorValue = {
    tableBackgroundColorFromTheme: 'inherit',
    backgroundColor: undefined,
    body: {
      borderColor: ' #F2F2F2',
    },
    borderColor: ' #F2F2F2',
    isBackgroundDarkColor: true,
    isBackgroundTransparentColor: false,
    pagination: {
      borderColor: ' #F2F2F2',
      color: 'rgba(255, 255, 255, 0.9)',
      disabledIconColor: 'rgba(255, 255, 255, 0.3)',
      iconColor: 'rgba(255, 255, 255, 0.9)',
    },
  };
  let theme;

  beforeEach(() => {
    global.document.querySelector = spyQuerySelector;
    global.window.getComputedStyle = spyGetComputedStyle;
    theme = {
      getStyle: spyGetStyle,
    };
    spyQuerySelector.mockReturnValue(undefined);
    spyGetComputedStyle.mockReturnValue(undefined);
    spyGetStyle.mockReturnValue(undefined);
  });

  describe('when there is no background color from theme or css file', () => {
    it('should return the default value', () => {
      const result = tableThemeColors(theme);
      expect(result).toEqual(defaultValue);
    });
  });

  describe('when there is only background color on sheet', () => {
    it('should return the default value ', () => {
      global.document.querySelector = jest.fn((selector) => {
        if (selector === '.qv-panel-sheet') return selector;
        return undefined;
      });
      global.window.getComputedStyle = jest.fn((selector) => {
        if (selector === '.qv-panel-sheet') {
          return { backgroundColor: '#fff' };
        }
        return undefined;
      });
      let result = tableThemeColors(theme);
      expect(result).toEqual(defaultValue);

      global.window.getComputedStyle = jest.fn((selector) => {
        if (selector === '.qv-panel-sheet') {
          return { backgroundColor: '#000' };
        }
        return undefined;
      });
      result = tableThemeColors(theme);
      expect(result).toEqual(defaultValue);
    });
  });

  describe('when there is background color on object', () => {
    describe('when there is only background color on object', () => {
      it('should return the default value and backgroundColor when the background color is light', () => {
        global.document.querySelector = jest.fn((selector) => {
          if (selector === '.qv-object .qv-inner-object') return selector;
          return undefined;
        });
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#fff' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({ ...defaultValue, backgroundColor: '#fff' });
      });

      it('should return the darkBackgroundColorValue and backgroundColor when the background color is dark', () => {
        global.document.querySelector = jest.fn((selector) => {
          if (selector === '.qv-object .qv-inner-object') return selector;
          return undefined;
        });
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#000' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...darkBackgroundColorValue,
          backgroundColor: '#000',
        });
      });

      it('should return the defaultValue and backgroundColor and isBackgroundTransparentColor to be true when the background color is transparent', () => {
        global.document.querySelector = jest.fn((selector) => {
          if (selector === '.qv-object .qv-inner-object') return selector;
          return undefined;
        });
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: 'transparent' };
          }
          return style;
        });
        let result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: 'transparent',
          isBackgroundTransparentColor: true,
        });

        global.document.querySelector = jest.fn((selector) => {
          if (selector === '.qv-object .qv-inner-object') return selector;
          return undefined;
        });
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: 'rgba(0,0,0,0)' };
          }
          return style;
        });
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: 'rgba(0,0,0,0)',
          isBackgroundTransparentColor: true,
        });

        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: 'rgba(255,255,255,0)' };
          }
          return style;
        });
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: 'rgba(255,255,255,0)',
          isBackgroundTransparentColor: true,
        });

        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#11111100' };
          }
          return style;
        });
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: '#11111100',
          isBackgroundTransparentColor: true,
        });
      });
    });

    describe('when there is background color on object and background color on sheet', () => {
      it('should return the when the background color on object is dark and opaque', () => {
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#000' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#fff' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({ ...darkBackgroundColorValue, backgroundColor: '#000' });
      });

      it('should return the when the background color on object is light and opaque', () => {
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#fff' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#000' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({ ...defaultValue, backgroundColor: '#fff' });
      });

      it('should return the when the background color on object is transparent and background color on sheet is light', () => {
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: 'rgba(0,0,0,0)' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#fff' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: 'rgba(0,0,0,0)',
          isBackgroundTransparentColor: true,
        });
      });

      it('should return the when the background color on object is transparent and background color on sheet is dark', () => {
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: 'rgba(0,0,0,0)' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#000' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...darkBackgroundColorValue,
          backgroundColor: 'rgba(0,0,0,0)',
          isBackgroundTransparentColor: true,
        });
      });
    });
  });

  describe('when there is background color on table', () => {
    describe('when there is only background color on table', () => {
      it('should return defaultValue, backgroundColor, and tableBackgroundColorFromTheme when the background color on table is light and opaque', () => {
        spyGetStyle.mockReturnValue('#fff');
        let result = tableThemeColors(theme);
        expect(result).toEqual({ ...defaultValue, backgroundColor: '#fff', tableBackgroundColorFromTheme: '#fff' });

        spyGetStyle.mockReturnValue('rgba(255, 255, 255, 0.2)');
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          tableBackgroundColorFromTheme: 'rgba(255, 255, 255, 0.2)',
        });
      });

      it('should return the darkBackgroundColorValue, backgroundColor, and tableBackgroundColorFromTheme when the background color on table is dark and opaque', () => {
        spyGetStyle.mockReturnValue('#000');
        let result = tableThemeColors(theme);
        expect(result).toEqual({
          ...darkBackgroundColorValue,
          backgroundColor: '#000',
          tableBackgroundColorFromTheme: '#000',
        });

        spyGetStyle.mockReturnValue('rgba(0, 0, 0, 0.2)');
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...darkBackgroundColorValue,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          tableBackgroundColorFromTheme: 'rgba(0, 0, 0, 0.2)',
        });
      });

      it('should return the defaultValue, backgroundColor, and tableBackgroundColorFromTheme, isBackgroundTransparentColor to be true when the background color on table is transparent', () => {
        spyGetStyle.mockReturnValue('rgba(0, 0, 0, 0)');
        let result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          tableBackgroundColorFromTheme: 'rgba(0, 0, 0, 0)',
          isBackgroundTransparentColor: true,
        });

        spyGetStyle.mockReturnValue('rgba(255, 255, 255, 0)');
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          tableBackgroundColorFromTheme: 'rgba(255, 255, 255, 0)',
          isBackgroundTransparentColor: true,
        });

        spyGetStyle.mockReturnValue('#11111100');
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: '#11111100',
          tableBackgroundColorFromTheme: '#11111100',
          isBackgroundTransparentColor: true,
        });
      });
    });

    describe('when there is background color on table and background color on object', () => {
      it('when the background color on table is light and opaque', () => {
        spyGetStyle.mockReturnValue('#fff');
        global.document.querySelector = jest.fn((selector) => {
          if (selector === '.qv-object .qv-inner-object') return selector;
          return undefined;
        });
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#000' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: '#fff',
          tableBackgroundColorFromTheme: '#fff',
        });
      });

      it('should return when the background color on table is dark and opaque', () => {
        spyGetStyle.mockReturnValue('#000');
        global.document.querySelector = jest.fn((selector) => {
          if (selector === '.qv-object .qv-inner-object') return selector;
          return undefined;
        });
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#fff' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...darkBackgroundColorValue,
          backgroundColor: '#000',
          tableBackgroundColorFromTheme: '#000',
        });
      });

      it('when the background color on table is transparent', () => {
        spyGetStyle.mockReturnValue('rgba(0,0,0,0)');
        global.document.querySelector = jest.fn((selector) => {
          if (selector === '.qv-object .qv-inner-object') return selector;
          return undefined;
        });
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#000' };
          }
          return style;
        });
        let result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          isBackgroundTransparentColor: true,
          backgroundColor: 'rgba(0,0,0,0)',
          tableBackgroundColorFromTheme: 'rgba(0,0,0,0)',
        });

        spyGetStyle.mockReturnValue('#11111100');
        result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          isBackgroundTransparentColor: true,
          backgroundColor: '#11111100',
          tableBackgroundColorFromTheme: '#11111100',
        });
      });
    });

    describe('when there is background color on table and background color on object and background color on sheet', () => {
      it('when the background color on table is light and opaque', () => {
        spyGetStyle.mockReturnValue('#fff');
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#000' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#111' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          backgroundColor: '#fff',
          tableBackgroundColorFromTheme: '#fff',
        });
      });

      it('when the background color on table is dark and opaque', () => {
        spyGetStyle.mockReturnValue('#000');
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#fff' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#111' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...darkBackgroundColorValue,
          backgroundColor: '#000',
          tableBackgroundColorFromTheme: '#000',
        });
      });

      it('when the background color on table is transparent and background color on sheet is dark', () => {
        spyGetStyle.mockReturnValue('rgba(0,0,0,0)');
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#fff' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#111' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...darkBackgroundColorValue,
          isBackgroundTransparentColor: true,
          backgroundColor: 'rgba(0,0,0,0)',
          tableBackgroundColorFromTheme: 'rgba(0,0,0,0)',
        });
      });

      it('when the background color on table is transparent and background color on sheet is light', () => {
        spyGetStyle.mockReturnValue('rgba(0,0,0,0)');
        global.document.querySelector = jest.fn((selector) => selector);
        global.window.getComputedStyle = jest.fn((selector) => {
          let style;
          if (selector === '.qv-object .qv-inner-object') {
            style = { backgroundColor: '#000' };
          } else if (selector === '.qv-panel-sheet') {
            style = { backgroundColor: '#fff' };
          }
          return style;
        });
        const result = tableThemeColors(theme);
        expect(result).toEqual({
          ...defaultValue,
          isBackgroundTransparentColor: true,
          backgroundColor: 'rgba(0,0,0,0)',
          tableBackgroundColorFromTheme: 'rgba(0,0,0,0)',
        });
      });
    });
  });
});
