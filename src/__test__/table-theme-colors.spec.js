import tableThemeColors from '../table-theme-colors';

describe('table-theme-colors', () => {
  const spyQuerySelector = jest.fn();
  const spyGetComputedStyle = jest.fn();
  let theme;

  beforeEach(() => {
    Object.defineProperty(global.document, 'querySelector', { value: spyQuerySelector });
    Object.defineProperty(global.window, 'getComputedStyle', { value: spyGetComputedStyle });
    theme = {
      getStyle: jest.fn(),
      // getStyle:
    };
    theme.getStyle.mockReturnValue('black');
  });

  it('', async () => {
    theme.getStyle = jest.fn((base, path, attribute) => {
      if (attribute === 'object.straightTable.backgroundColor') {
        return '#000000';
      }
      return undefined;
    });

    const themeColors = tableThemeColors(theme);

    expect(themeColors).toEqual({
      tableBackgroundColorFromTheme: 'inherit',
      backgroundColor: undefined,
      isBackgroundTransparentColor: true,
      isBackgroundDarkColor: false,
      borderColor: '#D9D9D9',
      body: { borderColor: '#D9D9D9' },
      pagination: {
        borderColor: '#D9D9D9',
        color: '#404040',
        iconColor: 'rgba(0, 0, 0, 0.54)',
        disabledIconColor: 'rgba(0, 0, 0, 0.3)',
      },
    });
    console.log('🚀 ~ file: table-theme-colors.spec.js ~ line 12 ~ it ~ themeColors', themeColors);
  });
});
