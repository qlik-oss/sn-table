import {
  STYLING_DEFAULTS,
  SELECTION_STYLING,
  getColor,
  getBaseStyling,
  getHeaderStyle,
  getBodyCellStyle,
  getColumnStyle,
  getSelectionStyle,
} from '../styling-utils';
import { SelectionStates } from '../selections-utils';
import { ExtendedTheme, PaletteColor, HeaderStyling, ContentStyling, TableLayout, CellStyle } from '../../../types';

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
    table: {
      body: { borderColor: '#D9D9D9' },
      backgroundColor: '#323232',
    },
  } as unknown as ExtendedTheme;

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

    it('should return styling with fontColor, fontSize and padding', () => {
      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        color: '#fff',
        fontSize: '12px',
        padding: '6px 12px',
      });
    });
    it('should return styling with fontSize and padding', () => {
      styleObj.fontColor = undefined;
      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        fontSize: '12px',
        padding: '6px 12px',
      });
    });
    it('should return styling with fontSize and padding when the index for font color is -1 and color is null', () => {
      styleObj.fontColor = { index: -1, color: null };

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        fontSize: '12px',
        padding: '6px 12px',
      });
    });
    it('should return styling with fontSize, padding and font color when the index for font color is -1 and color is null and there is a color from theme', () => {
      styleObj.fontColor = { index: -1, color: null };
      const customTheme = {
        ...theme,
        getStyle: () => '#111',
      } as unknown as ExtendedTheme;

      const resultStyling = getBaseStyling(objetName, customTheme, styleObj);
      expect(resultStyling).toEqual({
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        color: '#111',
        fontSize: '12px',
        padding: '6px 12px',
        fontFamily: '#111',
      });
    });
    it('should return styling with fontSize, padding and font color when the index for font color is -1 and the color is not null', () => {
      styleObj.fontColor = { index: -1, color: 'fff' };

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        color: 'fff',
        fontSize: '12px',
        padding: '6px 12px',
      });
    });
    it('should return styling with fontColor as the font size and padding are from sprout theme', () => {
      styleObj.fontSize = undefined;

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: '#fff',
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
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

      const resultStyling = getHeaderStyle(layout, theme);
      expect(resultStyling).toEqual({
        backgroundColor: '#323232',
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        borderWidth: '1px 1px 1px 0px',
        cursor: 'pointer',
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
      } as unknown as TableLayout;

      const resultStyling = getHeaderStyle(layout, theme);
      expect(resultStyling).toEqual({
        color: '#404040',
        cursor: 'pointer',
        backgroundColor: '#323232',
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        borderWidth: '1px 1px 1px 0px',
        sortLabelColor: '#404040',
      });
    });
    it('should return all header style from layout', () => {
      const resultStyling = getHeaderStyle(layout, theme);
      expect(resultStyling).toEqual({
        color: '#404040',
        cursor: 'pointer',
        fontSize: '44px',
        padding: '22px 44px',
        backgroundColor: '#323232',
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        borderWidth: '1px 1px 1px 0px',
        sortLabelColor: '#404040',
      });
    });
  });

  describe('getBodyCellStyle', () => {
    let layout: TableLayout;

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
      } as unknown as TableLayout;
    });

    it('should return styling with default hoverBackgroundColor and hoverFontColor', () => {
      layout = {} as unknown as TableLayout;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling).toEqual({
        hoverFontColor: '',
        borderColor: '#D9D9D9',
        hoverBackgroundColor: '#f4f4f4',
        borderStyle: 'solid',
        borderWidth: '0px 1px 1px 0px',
      });
    });
    it('should return styling with fontColor, fontSize, padding plus default hoverBackgroundColor and hoverFontColor', () => {
      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling).toEqual({
        fontSize: '22px',
        color: '#222222',
        padding: '11px 22px',
        hoverBackgroundColor: '#f4f4f4',
        hoverFontColor: '',
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        borderWidth: '0px 1px 1px 0px',
      });
    });
    // Only checking hover properties from here on
    it('should return styling with no hoverBackgroundColor and the specified hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverFontColor) layout.components[0].content.hoverFontColor.index = 1;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe('');
      expect(resultStyling.hoverFontColor).toBe(resolvedColor);
    });
    it('should return styling with dark hoverBackgroundColor from theme and the white hoverFontColor', () => {
      theme.getStyle = () => '#111';

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe('#111');
      expect(resultStyling.hoverFontColor).toBe(STYLING_DEFAULTS.WHITE);
    });
    it('should return styling with light hoverBackgroundColor from theme and the default hoverFontColor', () => {
      theme.getStyle = () => '#fff';

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe('#fff');
      expect(resultStyling.hoverFontColor).toBe(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling with dark hoverBackgroundColor and white hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 1;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe(resolvedColor);
      expect(resultStyling.hoverFontColor).toBe(STYLING_DEFAULTS.WHITE);
    });
    it('should return styling with light hoverBackgroundColor and the default hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 2;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe(altResolvedColor);
      expect(resultStyling.hoverFontColor).toBe(STYLING_DEFAULTS.FONT_COLOR);
    });
    it('should return styling with set hoverBackgroundColor and hoverFontColor', () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 1;
      if (layout.components?.[0].content?.hoverFontColor) layout.components[0].content.hoverFontColor.index = 2;

      const resultStyling = getBodyCellStyle(layout, theme);
      expect(resultStyling.hoverBackgroundColor).toBe(resolvedColor);
      expect(resultStyling.hoverFontColor).toBe(altResolvedColor);
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
      expect(columnStyle.color).toBe(STYLING_DEFAULTS.FONT_COLOR);
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
        background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, ${styling.backgroundColor}`,
      });
    });

    it('should return excluded styling with columns background when other column and background color exists', () => {
      cellSelectionState = SelectionStates.EXCLUDED;
      styling.backgroundColor = 'someColor';

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({
        ...styling,
        background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, ${styling.backgroundColor}`,
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
