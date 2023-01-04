import {
  getColor,
  getBaseStyling,
  getHeaderStyle,
  getBodyCellStyle,
  getColumnStyle,
  getSelectionStyle,
  getBorderColors,
} from '../styling-utils';
import { ExtendedTheme, PaletteColor, HeaderStyling, ContentStyling, TableLayout } from '../../../types';
import { CellStyle } from '../../types';
import { SelectionStates, StylingDefaults, SELECTION_STYLING } from '../../constants';

describe('styling-utils', () => {
  let resolvedColor: string;
  let altResolvedColor: string;
  const theme = {
    // very simple mock of getColorPickerColor. Normally color.color has to be null for the fn to return null
    getColorPickerColor: ({ index, color }: PaletteColor) => {
      switch (index) {
        case -1:
          return color;
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
    getStyle: () => undefined,
    background: { isDark: false, color: '#323232' },
  } as unknown as ExtendedTheme;
  // TODO: switch these to sprout color constants
  const defaultBorderColors = {
    borderBottomColor: '#EBEBEB',
    borderTopColor: '#808080',
    borderRightColor: '#D9D9D9',
    borderLeftColor: '#D9D9D9',
  };

  describe('getColor', () => {
    let color: PaletteColor;
    let defaultColor: string;

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
      const resultColor = getColor(defaultColor, theme, undefined);
      expect(resultColor).toBe(defaultColor);
    });
  });

  describe('getBorderColors', () => {
    let isBackgroundDark: boolean;
    let separatingBorder: string;

    beforeEach(() => {
      isBackgroundDark = false;
      separatingBorder = '';
    });

    it('should return default border colors when background is not dark and no separating border', () => {
      const borders = getBorderColors(isBackgroundDark, separatingBorder);
      expect(borders).toEqual(defaultBorderColors);
    });

    it('should return border colors with dark bottom border when background is not dark and separatingBorder is bottom', () => {
      separatingBorder = 'bottom';

      const borders = getBorderColors(isBackgroundDark, separatingBorder);
      expect(borders).toEqual({
        ...defaultBorderColors,
        borderBottomColor: '#808080',
      });
    });

    it('should return light border colors background is dark', () => {
      isBackgroundDark = true;

      const borders = getBorderColors(isBackgroundDark, separatingBorder);
      expect(borders).toEqual({
        borderBottomColor: '#F2F2F2',
        borderTopColor: '#F2F2F2',
        borderRightColor: '#F2F2F2',
        borderLeftColor: '#F2F2F2',
      });
    });
  });

  describe('getBaseStyling', () => {
    let styleObj: HeaderStyling | ContentStyling;
    let objetName: string;

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

    it('should return styling with fontColor, fontSize and border colors', () => {
      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: '#fff',
        fontSize: '12px',
        ...defaultBorderColors,
      });
    });

    it('should return styling with fontSize and border colors', () => {
      styleObj.fontColor = undefined;

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        fontSize: '12px',
        ...defaultBorderColors,
      });
    });

    it('should return styling with only borderColors', () => {
      styleObj.fontColor = undefined;
      styleObj.fontSize = undefined;

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        ...defaultBorderColors,
      });
    });

    it('should return styling with fontSize and border colors when the index for font color is -1 and color is null', () => {
      styleObj.fontColor = { index: -1, color: null };

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        fontSize: '12px',
        ...defaultBorderColors,
      });
    });

    it('should return styling with fontSize, padding and font color when the index for font color is -1 and color is null and there is a color from theme', () => {
      styleObj.fontColor = { index: -1, color: null };
      const customTheme = {
        ...theme,
        getStyle: (basePath: string, path: string, prop: string) => (prop === 'color' ? '#111' : undefined),
      } as unknown as ExtendedTheme;

      const resultStyling = getBaseStyling(objetName, customTheme, styleObj);
      expect(resultStyling).toEqual({
        color: '#111',
        fontSize: '12px',
        ...defaultBorderColors,
      });
    });

    it('should return styling with fontSize, padding and font color when the index for font color is -1 and the color is not null', () => {
      styleObj.fontColor = { index: -1, color: 'fff' };

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: 'fff',
        fontSize: '12px',
        ...defaultBorderColors,
      });
    });

    it('should return styling with fontColor as the font size and padding are from sprout theme', () => {
      styleObj.fontSize = undefined;

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: '#fff',
        ...defaultBorderColors,
      });
    });

    it('should return styling with custom padding', () => {
      (<ContentStyling>styleObj).padding = '4px';

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling.padding).toBe('4px');
    });
  });

  describe('getHeaderStyle', () => {
    let layout: TableLayout;

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
      } as unknown as TableLayout;
    });

    it('should return empty object except backgroundColor and border as the padding and font size are from sprout theme', () => {
      layout = {} as unknown as TableLayout;

      const resultStyling = getHeaderStyle(layout, theme, '');
      expect(resultStyling).toEqual({
        backgroundColor: '#323232',
        sortLabelColor: 'rgba(255,255,255,0.9)',
        ...defaultBorderColors,
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
      } as unknown as TableLayout;

      const resultStyling = getHeaderStyle(layout, theme, '');
      expect(resultStyling).toEqual({
        color: '#404040',
        backgroundColor: '#323232',
        sortLabelColor: '#404040',
        ...defaultBorderColors,
      });
    });

    it('should return all header style from layout', () => {
      const resultStyling = getHeaderStyle(layout, theme, '');
      expect(resultStyling).toEqual({
        color: '#404040',
        fontSize: '44px',
        backgroundColor: '#323232',
        sortLabelColor: '#404040',
        ...defaultBorderColors,
      });
    });
  });

  describe('getBodyCellStyle', () => {
    let layout: TableLayout;
    const defaultHoverColors = { hoverBackgroundColor: '#f4f4f4', hoverFontColor: '' };

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
              padding: '11px 22px',
            },
          },
        ],
      } as unknown as TableLayout;
    });

    it('should return styling with default hoverBackgroundColor and hoverFontColor', () => {
      layout = {} as unknown as TableLayout;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling).toEqual({
        hoverColors: defaultHoverColors,
        ...defaultBorderColors,
      });
    });

    it('should return styling with fontColor, fontSize and padding plus default hoverBackgroundColor and hoverFontColor', () => {
      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling).toEqual({
        fontSize: '22px',
        color: '#222222',
        padding: '11px 22px',
        hoverColors: defaultHoverColors,
        ...defaultBorderColors,
      });
    });

    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverFontColor) layout.components[0].content.hoverFontColor.index = 1;

      const { hoverColors } = getBodyCellStyle(layout, theme);
      expect(hoverColors?.hoverBackgroundColor).toBe('');
      expect(hoverColors?.hoverFontColor).toBe(resolvedColor);
    });

    it('should return styling with dark hoverBackgroundColor from theme and the white hoverFontColor', () => {
      theme.getStyle = () => '#111';

      const { hoverColors } = getBodyCellStyle(layout, theme);
      expect(hoverColors?.hoverBackgroundColor).toBe('#111');
      expect(hoverColors?.hoverFontColor).toBe(StylingDefaults.WHITE);
    });

    it('should return styling with light hoverBackgroundColor from theme and the default hoverFontColor', () => {
      theme.getStyle = () => '#fff';

      const { hoverColors } = getBodyCellStyle(layout, theme);
      expect(hoverColors?.hoverBackgroundColor).toBe('#fff');
      expect(hoverColors?.hoverFontColor).toBe(StylingDefaults.FONT_COLOR);
    });

    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 1;

      const { hoverColors } = getBodyCellStyle(layout, theme);
      expect(hoverColors?.hoverBackgroundColor).toBe(resolvedColor);
      expect(hoverColors?.hoverFontColor).toBe(StylingDefaults.WHITE);
    });

    it('should return styling with light hoverBackgroundColor and the default hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 2;

      const { hoverColors } = getBodyCellStyle(layout, theme);
      expect(hoverColors?.hoverBackgroundColor).toBe(altResolvedColor);
      expect(hoverColors?.hoverFontColor).toBe(StylingDefaults.FONT_COLOR);
    });

    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 1;
      if (layout.components?.[0].content?.hoverFontColor) layout.components[0].content.hoverFontColor.index = 2;

      const { hoverColors } = getBodyCellStyle(layout, theme);
      expect(hoverColors?.hoverBackgroundColor).toBe(resolvedColor);
      expect(hoverColors?.hoverFontColor).toBe(altResolvedColor);
    });
  });

  describe('getColumnStyle', () => {
    let styling: CellStyle;
    let qAttrExps: EngineAPI.INxAttributeExpressionValues;
    let stylingIDs: string[];

    beforeEach(() => {
      styling = { color: 'someFontColor', backgroundColor: 'someBgColor' };
      qAttrExps = {
        qValues: [
          { qText: '#dddddd', qNum: NaN },
          { qText: '#111111', qNum: NaN },
        ],
      };
      stylingIDs = ['cellBackgroundColor', 'cellForegroundColor'];
    });

    it('should return styling with both new fontColor and backgroundColor when selected', () => {
      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle.backgroundColor).toBe('rgb(221,221,221)');
      expect(columnStyle.color).toBe('rgb(17,17,17)');
    });
    it('should return styling with new fontColor', () => {
      qAttrExps.qValues = [qAttrExps.qValues[1]];
      stylingIDs = [stylingIDs[1]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle.backgroundColor).toBe('someBgColor');
      expect(columnStyle.color).toBe('rgb(17,17,17)');
    });
    it('should return styling with backgroundColor and automatic font color', () => {
      qAttrExps.qValues = [qAttrExps.qValues[0]];
      stylingIDs = [stylingIDs[0]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle.backgroundColor).toBe('rgb(221,221,221)');
      expect(columnStyle.color).toBe(StylingDefaults.FONT_COLOR);
    });
    it('should return styling unchanged when no qText', () => {
      qAttrExps.qValues = [{ qNum: NaN }, { qNum: NaN }];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle).toEqual(styling);
    });
    it('should return styling unchanged when qText is an invalid color', () => {
      qAttrExps.qValues = [
        { qNum: NaN, qText: 'invalidColor' },
        { qNum: NaN, qText: 'invalidColor' },
      ];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle).toEqual(styling);
    });
  });

  describe('getSelectionStyle', () => {
    let styling: CellStyle;
    let cellSelectionState: SelectionStates;

    beforeEach(() => {
      styling = {
        color: '#654321',
        backgroundColor: '#123456',
      };
      cellSelectionState = SelectionStates.SELECTED;
    });

    it('should return selected when selected styling', () => {
      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({ ...styling, ...SELECTION_STYLING.SELECTED });
    });

    it('should return excluded styling when other column', () => {
      cellSelectionState = SelectionStates.EXCLUDED;

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({
        ...styling,
        background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${styling.backgroundColor}`,
        selectedCellClass: SelectionStates.EXCLUDED,
      });
    });

    it('should return excluded styling with columns background when other column and background color exists', () => {
      cellSelectionState = SelectionStates.EXCLUDED;
      styling.backgroundColor = 'someColor';

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({
        ...styling,
        background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${styling.backgroundColor}`,
        selectedCellClass: SelectionStates.EXCLUDED,
      });
    });

    it('should return possible styling when active and available to select', () => {
      cellSelectionState = SelectionStates.POSSIBLE;

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({ ...styling, ...SELECTION_STYLING.POSSIBLE });
    });

    it('should return empty object when no active selections', () => {
      cellSelectionState = SelectionStates.INACTIVE;

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual(styling);
    });
  });
});
