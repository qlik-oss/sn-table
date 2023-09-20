import { COLORING } from "@qlik/nebula-table-utils/lib/utils";
import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import { ContentStyling, HeaderStyling, PaletteColor, TableLayout } from "../../../types";
import { SelectionStates } from "../../constants";
import { SELECTION_STYLING } from "../../styling-defaults";
import { CellStyle } from "../../types";
import {
  getBaseStyling,
  getBodyStyle,
  getBorderColors,
  getColor,
  getColumnStyle,
  getHeaderStyle,
  getSelectionStyle,
} from "../styling-utils";

describe("styling-utils", () => {
  let resolvedColor: string;
  let altResolvedColor: string;
  const theme = {
    // very simple mock of getColorPickerColor. Normally color.color has to be null for the fn to return null
    getColorPickerColor: ({ index, color }: PaletteColor) => {
      switch (index) {
        case -1:
          return color;
        case 0:
          return "none";
        case 1:
          return resolvedColor;
        case 2:
          return altResolvedColor;
        default:
          return null;
      }
    },
    getStyle: () => undefined,
    background: { isDark: false, color: "#323232" },
  } as unknown as ExtendedTheme;
  const defaultBorderColors = {
    borderBottomColor: COLORING.BORDER_LIGHT,
    borderTopColor: COLORING.BORDER_HEAVY,
    borderRightColor: COLORING.BORDER_MEDIUM,
    borderLeftColor: COLORING.BORDER_MEDIUM,
  };

  describe("getColor", () => {
    let color: PaletteColor;
    let defaultColor: string;

    beforeEach(() => {
      defaultColor = "#000";
      color = {
        index: -1,
        color: null,
      };
      resolvedColor = "#fff";
    });

    it("should return a hex color when color obj has index", () => {
      color.index = 1;

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).toBe(resolvedColor);
    });
    it("should return a default color when getColorPickerColor returns false", () => {
      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).toBe(defaultColor);
    });

    it("should return a default color when getColorPickerColor returns none", () => {
      // Some palettes have none as the first value in the array of colors
      color.index = 0;

      const resultColor = getColor(defaultColor, theme, color);
      expect(resultColor).toBe(defaultColor);
    });

    it("should return a default color when color is undefined", () => {
      const resultColor = getColor(defaultColor, theme, undefined);
      expect(resultColor).toBe(defaultColor);
    });
  });

  describe("getBorderColors", () => {
    let isBackgroundDark: boolean;
    let separatingBorder: boolean;

    beforeEach(() => {
      isBackgroundDark = false;
      separatingBorder = false;
    });

    it("should return default border colors when background is not dark and no separating border", () => {
      const borders = getBorderColors(isBackgroundDark, separatingBorder);
      expect(borders).toEqual(defaultBorderColors);
    });

    it("should return border colors with dark bottom border when background is not dark and separatingBorder is bottom", () => {
      separatingBorder = true;

      const borders = getBorderColors(isBackgroundDark, separatingBorder);
      expect(borders).toEqual({
        ...defaultBorderColors,
        borderBottomColor: COLORING.BORDER_HEAVY,
      });
    });

    it("should return light border colors background is dark", () => {
      isBackgroundDark = true;

      const borders = getBorderColors(isBackgroundDark, separatingBorder);
      expect(borders).toEqual({
        borderBottomColor: COLORING.DARK_MODE_BORDER,
        borderTopColor: COLORING.DARK_MODE_BORDER,
        borderRightColor: COLORING.DARK_MODE_BORDER,
        borderLeftColor: COLORING.DARK_MODE_BORDER,
      });
    });
  });

  describe("getBaseStyling", () => {
    let styleObj: HeaderStyling | ContentStyling;
    let objetName: string;

    beforeEach(() => {
      resolvedColor = "#fff";
      styleObj = {
        fontColor: {
          index: 1,
          color: null,
        },
        fontSize: 12,
      };
      objetName = "";
    });

    it("should return styling with color, fontSize and border colors", () => {
      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: "#fff",
        fontSize: "12px",
        ...defaultBorderColors,
      });
    });

    it("should return styling with fontSize, color and border colors", () => {
      styleObj.fontColor = undefined;

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: COLORING.TEXT,
        fontSize: "12px",
        ...defaultBorderColors,
      });
    });

    it("should return styling with only borderColors and color", () => {
      styleObj.fontColor = undefined;
      styleObj.fontSize = undefined;

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: COLORING.TEXT,
        ...defaultBorderColors,
      });
    });

    it("should return styling with fontSize, color and border colors when the index for font color is -1 and color is null", () => {
      styleObj.fontColor = { index: -1, color: null };

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: COLORING.TEXT,
        fontSize: "12px",
        ...defaultBorderColors,
      });
    });

    it("should return styling with fontSize, color and border colors when the index for font color is -1 and color is null and there is a color from theme", () => {
      styleObj.fontColor = { index: -1, color: null };
      const customTheme = {
        ...theme,
        getStyle: (basePath: string, path: string, prop: string) => (prop === "color" ? "#111" : undefined),
      } as unknown as ExtendedTheme;

      const resultStyling = getBaseStyling(objetName, customTheme, styleObj);
      expect(resultStyling).toEqual({
        color: "#111",
        fontSize: "12px",
        ...defaultBorderColors,
      });
    });

    it("should return styling with fontSize, color and border colors when the index for font color is -1 and the color is not null", () => {
      styleObj.fontColor = { index: -1, color: "fff" };

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: "fff",
        fontSize: "12px",
        ...defaultBorderColors,
      });
    });

    it("should return styling with color as the font size and padding are from sprout theme", () => {
      styleObj.fontSize = undefined;

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling).toEqual({
        color: "#fff",
        ...defaultBorderColors,
      });
    });

    it("should return styling with custom padding", () => {
      (<ContentStyling>styleObj).padding = "4px";

      const resultStyling = getBaseStyling(objetName, theme, styleObj);
      expect(resultStyling.padding).toBe("4px");
    });
  });

  describe("getHeaderStyle", () => {
    let layout: TableLayout;

    beforeEach(() => {
      layout = {
        components: [
          {
            key: "theme",
            header: {
              fontColor: "#444444",
              fontSize: 44,
            },
          },
        ],
      } as unknown as TableLayout;
    });

    it("should return empty object except background and border as the padding and font size are from sprout theme", () => {
      layout = {} as unknown as TableLayout;

      const resultStyling = getHeaderStyle(layout, theme, false);
      expect(resultStyling).toEqual({
        background: "#323232",
        color: COLORING.TEXT,
        ...defaultBorderColors,
      });
    });

    it("should return header style with only fontColor except background and border", () => {
      layout = {
        components: [
          {
            key: "theme",
            header: {
              fontColor: "#444444",
            },
          },
        ],
      } as unknown as TableLayout;

      const resultStyling = getHeaderStyle(layout, theme, false);
      expect(resultStyling).toEqual({
        color: COLORING.TEXT,
        background: "#323232",
        ...defaultBorderColors,
      });
    });

    it("should return all header style from layout", () => {
      const resultStyling = getHeaderStyle(layout, theme, false);
      expect(resultStyling).toEqual({
        color: COLORING.TEXT,
        fontSize: "44px",
        background: "#323232",
        ...defaultBorderColors,
      });
    });
  });

  describe("getBodyStyle", () => {
    let layout: TableLayout;
    const defaultHoverColors = { background: "rgba(0, 0, 0, 0.03)", color: "" };

    beforeEach(() => {
      resolvedColor = "#222222"; // dark color
      altResolvedColor = "#dddddd"; // light color
      layout = {
        components: [
          {
            key: "theme",
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
              padding: "11px 22px",
            },
          },
        ],
      } as unknown as TableLayout;
    });

    it("should return default hover, font, background and border colors", () => {
      layout = {} as unknown as TableLayout;

      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).toEqual({
        color: COLORING.TEXT,
        hoverColors: defaultHoverColors,
        background: "#323232",
        lastRowBottomBorder: "0px",
        ...defaultBorderColors,
      });
    });

    it("should return styling with fontColor, fontSize and padding plus default hover colors", () => {
      const resultStyling = getBodyStyle(layout, theme);
      expect(resultStyling).toEqual({
        fontSize: "22px",
        color: "#222222",
        padding: "11px 22px",
        hoverColors: defaultHoverColors,
        background: "#323232",
        lastRowBottomBorder: "0px",
        ...defaultBorderColors,
      });
    });

    // Only checking hover properties from here on
    it("should return hover colors with no background color and the specified font color", () => {
      if (layout.components?.[0].content?.hoverFontColor) layout.components[0].content.hoverFontColor.index = 1;

      const { hoverColors } = getBodyStyle(layout, theme);
      expect(hoverColors?.background).toBe("");
      expect(hoverColors?.color).toBe(resolvedColor);
    });

    it("should return colors with dark background from theme and the white font color", () => {
      theme.getStyle = () => "#111";

      const { hoverColors } = getBodyStyle(layout, theme);
      expect(hoverColors?.background).toBe("#111");
      expect(hoverColors?.color).toBe(COLORING.WHITE);
    });

    it("should return hover colors with light background color from theme and the default font color", () => {
      theme.getStyle = () => "#fff";

      const { hoverColors } = getBodyStyle(layout, theme);
      expect(hoverColors?.background).toBe("#fff");
      expect(hoverColors?.color).toBe(COLORING.TEXT);
    });

    it("should return hover colors with dark background color and white font color", () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 1;

      const { hoverColors } = getBodyStyle(layout, theme);
      expect(hoverColors?.background).toBe(resolvedColor);
      expect(hoverColors?.color).toBe(COLORING.WHITE);
    });

    it("should return hover colors with light background color and the default font color", () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 2;

      const { hoverColors } = getBodyStyle(layout, theme);
      expect(hoverColors?.background).toBe(altResolvedColor);
      expect(hoverColors?.color).toBe(COLORING.TEXT);
    });

    it("should return hover colors with set background and font color", () => {
      if (layout.components?.[0].content?.hoverColor) layout.components[0].content.hoverColor.index = 1;
      if (layout.components?.[0].content?.hoverFontColor) layout.components[0].content.hoverFontColor.index = 2;

      const { hoverColors } = getBodyStyle(layout, theme);
      expect(hoverColors?.background).toBe(resolvedColor);
      expect(hoverColors?.color).toBe(altResolvedColor);
    });
  });

  describe("getColumnStyle", () => {
    let styling: CellStyle;
    let qAttrExps: EngineAPI.INxAttributeExpressionValues;
    let stylingIDs: string[];

    beforeEach(() => {
      styling = { color: "someFontColor", background: "someBgColor" };
      qAttrExps = {
        qValues: [
          { qText: "#dddddd", qNum: NaN },
          { qText: "#111111", qNum: NaN },
        ],
      };
      stylingIDs = ["cellBackgroundColor", "cellForegroundColor"];
    });

    it("should return styling with both new fontColor and background when selected", () => {
      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle.background).toBe("rgb(221,221,221)");
      expect(columnStyle.color).toBe("rgb(17,17,17)");
    });
    it("should return styling with new fontColor", () => {
      qAttrExps.qValues = [qAttrExps.qValues[1]];
      stylingIDs = [stylingIDs[1]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle.background).toBe("someBgColor");
      expect(columnStyle.color).toBe("rgb(17,17,17)");
    });
    it("should return styling with background and automatic font color", () => {
      qAttrExps.qValues = [qAttrExps.qValues[0]];
      stylingIDs = [stylingIDs[0]];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle.background).toBe("rgb(221,221,221)");
      expect(columnStyle.color).toBe(COLORING.TEXT);
    });
    it("should return styling unchanged when no qText", () => {
      qAttrExps.qValues = [{ qNum: NaN }, { qNum: NaN }];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle).toEqual(styling);
    });
    it("should return styling unchanged when qText is an invalid color", () => {
      qAttrExps.qValues = [
        { qNum: NaN, qText: "invalidColor" },
        { qNum: NaN, qText: "invalidColor" },
      ];

      const columnStyle = getColumnStyle(styling, qAttrExps, stylingIDs);
      expect(columnStyle).toEqual(styling);
    });
  });

  describe("getSelectionStyle", () => {
    let styling: CellStyle;
    let cellSelectionState: SelectionStates;

    beforeEach(() => {
      styling = {
        color: "#654321",
        background: "#123456",
      };
      cellSelectionState = SelectionStates.SELECTED;
    });

    it("should return selected when selected styling", () => {
      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({ ...styling, ...SELECTION_STYLING.SELECTED });
    });

    it("should return excluded styling when other column", () => {
      cellSelectionState = SelectionStates.EXCLUDED;

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({
        ...styling,
        background: `${SELECTION_STYLING.EXCLUDED_BACKGROUND}, ${styling.background}`,
        selectedCellClass: SelectionStates.EXCLUDED,
      });
    });

    it("should return excluded styling with columns background when other column and background color exists", () => {
      cellSelectionState = SelectionStates.EXCLUDED;
      styling.background = "someColor";

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({
        ...styling,
        background: `${SELECTION_STYLING.EXCLUDED_BACKGROUND}, ${styling.background}`,
        selectedCellClass: SelectionStates.EXCLUDED,
      });
    });

    it("should return possible styling when active and available to select", () => {
      cellSelectionState = SelectionStates.POSSIBLE;

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual({ ...styling, ...SELECTION_STYLING.POSSIBLE });
    });

    it("should return empty object when no active selections", () => {
      cellSelectionState = SelectionStates.INACTIVE;

      const selectionStyling = getSelectionStyle(styling, cellSelectionState);
      expect(selectionStyling).toEqual(styling);
    });
  });
});
