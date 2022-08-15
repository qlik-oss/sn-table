import { stardust } from '@nebula.js/stardust';

import { resolveToRGBAorRGB, isDarkColor, removeOpacity } from './color-utils';
import { SelectionStates } from './selections-utils';
import { TableLayout, ExtendedTheme, StylingLayout, GeneratedStyling, CellStyle, PaletteColor } from '../../types';
// the order of style
// default (inl. sprout theme) < Sense theme < styling settings
// < column < selection (except the selected green) < hover < selected green

export const STYLING_DEFAULTS = {
  FONT_COLOR: '#404040',
  HOVER_BACKGROUND: '#f4f4f4',
  SELECTED_CLASS: 'selected',
  SELECTED_BACKGROUND: '#009845',
  EXCLUDED_BACKGROUND:
    'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px)',
  WHITE: '#fff',
  PADDING: '7px 14px',
};

export const SELECTION_STYLING = {
  SELECTED: {
    color: STYLING_DEFAULTS.WHITE,
    background: STYLING_DEFAULTS.SELECTED_BACKGROUND,
    // Setting a specific class for selected cells styling to override hover effect
    selectedCellClass: STYLING_DEFAULTS.SELECTED_CLASS,
  },
  POSSIBLE: {
    color: STYLING_DEFAULTS.FONT_COLOR,
    background: STYLING_DEFAULTS.WHITE,
  },
};

/**
 * Determines if a palette color is set or not. Both index !== -1 and color !== null must be true for it to be unset
 */
export const isColorSet = (prop: PaletteColor | undefined): boolean =>
  !!prop && JSON.stringify(prop) !== JSON.stringify({ index: -1, color: null });

/**
 * Gets specified padding from layout if defined, otherwise calculates it based on specified font size if defined, otherwise returns default padding.
 * Note that the padding property can't be set in the styling panel
 */
export function getPadding(styleObj: StylingLayout | undefined, defaultPadding: string): string {
  let padding = defaultPadding;
  if (styleObj?.padding) {
    ({ padding } = styleObj);
  } else if (styleObj?.fontSize) {
    padding = `${styleObj.fontSize / 2}px ${styleObj.fontSize}px`;
  }
  return padding;
}

/**
 * Gets color from color picker. Defaults to default color if resolved color is invalid
 */
export function getColor(defaultColor: string, theme: stardust.Theme, color = {}): string {
  const resolvedColor = theme.getColorPickerColor(color);

  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

/**
 * Gets font color based on background, making sure contrast is good enough
 */
export const getAutoFontColor = (backgroundColor: string): string =>
  isDarkColor(backgroundColor) ? STYLING_DEFAULTS.WHITE : STYLING_DEFAULTS.FONT_COLOR;

/**
 * Gets base styling for either header or body taking table theme settings into account
 */
export const getBaseStyling = (
  styleObj: StylingLayout | undefined,
  objetName: string,
  theme: ExtendedTheme
): GeneratedStyling => {
  const fontFamily = theme.getStyle('object', `straightTable.${objetName}`, 'fontFamily');
  const color = theme.getStyle('object', `straightTable.${objetName}`, 'color');
  const fontSize = theme.getStyle('object', `straightTable.${objetName}`, 'fontSize');

  const baseStyle: GeneratedStyling = {
    fontFamily,
    color: isColorSet(styleObj?.fontColor) ? getColor(STYLING_DEFAULTS.FONT_COLOR, theme, styleObj?.fontColor) : color,
    fontSize: (styleObj?.fontSize && `${styleObj.fontSize}px`) || fontSize,
    padding: getPadding(styleObj, STYLING_DEFAULTS.PADDING),
    borderStyle: 'solid',
    borderColor: theme.table.body.borderColor,
  };
  // Remove all undefined and null values
  Object.keys(baseStyle).forEach((key) => {
    const typedKey = key as keyof GeneratedStyling;
    baseStyle[typedKey] == null && delete baseStyle[typedKey]; // == catches null and undefined but not 0
  });
  return baseStyle;
};

/**
 * Gets complete styling for the header. Extends base styling with header specific styling
 */
export function getHeaderStyle(layout: TableLayout, theme: ExtendedTheme): GeneratedStyling {
  const header = layout.components?.[0]?.header;
  const headerStyle = getBaseStyling(header, 'header', theme);
  headerStyle.cursor = 'pointer';
  headerStyle.borderWidth = '1px 1px 1px 0px';

  // To avoid seeing the table body through the table head:
  // - When the table background color from the sense theme is transparent,
  // there is a header background color depending on the header font color
  // - When the table background color from the sense theme has opacity,
  // removing that.
  const headerBackgroundColor = isDarkColor(headerStyle.color) ? '#FAFAFA' : '#323232';
  headerStyle.backgroundColor = theme.table.isBackgroundTransparentColor
    ? headerBackgroundColor
    : removeOpacity(theme.table.backgroundColor);

  // When you set the header font color,
  // the sort label color should be same.
  // When there is no header content color setting,
  // the sort label color is depending on the header background color.
  headerStyle.sortLabelColor =
    headerStyle.color ?? (isDarkColor(headerStyle.backgroundColor) ? 'rgba(255,255,255,0.9)' : 'rgba(0, 0, 0, 0.54)');

  return headerStyle;
}

/**
 * Gets complete styling for the body. Extends base styling with hover styling
 */
export function getBodyCellStyle(layout: TableLayout, theme: ExtendedTheme): GeneratedStyling {
  const content = layout.components?.[0]?.content;
  const contentStyle = getBaseStyling(content, 'content', theme);
  contentStyle.borderWidth = '0px 1px 1px 0px';

  const hoverBackgroundColorFromLayout = content?.hoverColor;
  const hoverFontColorFromLayout = content?.hoverFontColor;

  const hoverBackgroundColorFromTheme = theme.getStyle('object', '', 'straightTable.content.hover.backgroundColor');
  const hoverFontColorFromTheme = theme.getStyle('object', '', 'straightTable.content.hover.color');

  // Cases when hoverEffect is true:
  // 1. There is no hover font color but a hover background color,
  // when hovering, the hover font color becomes white when the hover
  // background color is a dark color or the hover font color stays
  // the same as whatever the font color is when the hover background
  // color is a light color.
  // 2. There is no hover font color and no hover background color,
  // when hovering, the default hover effect (a light gray hover background
  // color and no hover font color) is in use.
  // 3. There is a hover font color but no hover background color,
  // when hovering, only the font color is applied and no hover
  // background color is shown.
  // 4. There are both a hover font and a hover background color,
  // when hovering, the hover font and the hover background color take effect.

  // Note: Hover colors from Layout have a higher priority than those from theme.

  const isHoverFontColorSet = isColorSet(hoverFontColorFromLayout) || !!hoverFontColorFromTheme;
  const isHoverBackgroundColorSet = isColorSet(hoverBackgroundColorFromLayout) || !!hoverBackgroundColorFromTheme;
  const isHoverFontOrBackgroundColorSet = isHoverFontColorSet || isHoverBackgroundColorSet;

  let hoverBackgroundColor;
  if (isColorSet(hoverBackgroundColorFromLayout)) {
    // case 1 or 4
    hoverBackgroundColor = getColor(STYLING_DEFAULTS.HOVER_BACKGROUND, theme, hoverBackgroundColorFromLayout);
  } else if (hoverBackgroundColorFromTheme) {
    // case 1 or 4
    hoverBackgroundColor = hoverBackgroundColorFromTheme;
  } else if (isHoverFontColorSet) {
    hoverBackgroundColor = ''; // case 3
  } else {
    hoverBackgroundColor = STYLING_DEFAULTS.HOVER_BACKGROUND; // case 2
  }

  const hoverFontColor = isHoverFontOrBackgroundColorSet
    ? getColor(
        getAutoFontColor(hoverBackgroundColor),
        theme,
        isColorSet(hoverFontColorFromLayout) ? hoverFontColorFromLayout : hoverFontColorFromTheme
      ) // case 1 or 3 or 4
    : ''; // case 2;

  return {
    ...contentStyle,
    hoverBackgroundColor,
    hoverFontColor,
  };
}

/**
 * Gets complete styling for the totals cells. Based on the body style but with the background from the body
 */
export function getTotalsCellStyle(layout: TableLayout, theme: ExtendedTheme) {
  const headerStyle = getHeaderStyle(layout, theme);
  return { ...getBodyCellStyle(layout, theme), backgroundColor: headerStyle.backgroundColor };
}

/**
 * You can set the background color expression and/or text color expression
 * for measure data and/or dimension data.
 * Ex:
 * {"qHyperCubeDef": {
 *     "qDimensions": [{
 *        "qAttributeExpressions": [
          {
            "qExpression": "rgb(4,4,4)",
            "qAttribute": true,
            "id": "cellBackgroundColor"
          },
          {
            "qExpression": "rgb(219, 42, 42)",
            "qAttribute": true,
            "id": "cellForegroundColor"
          }
        ],
 *     }]
 * }}
 *
 * get style from qAttributeExpressions in qDimensions or qMeasures
 */
export function getColumnStyle(
  styling: CellStyle,
  qAttrExps: EngineAPI.INxAttributeExpressionValues,
  stylingIDs: string[]
): CellStyle {
  const columnColors: Record<string, string> = {};
  qAttrExps.qValues.forEach((val, i) => {
    const resolvedColor = val.qText && resolveToRGBAorRGB(val.qText);
    if (resolvedColor && resolvedColor !== 'none') {
      columnColors[stylingIDs[i]] = resolvedColor;
    }
  });
  if (columnColors.cellBackgroundColor && !columnColors.cellForegroundColor)
    columnColors.cellForegroundColor = getAutoFontColor(columnColors.cellBackgroundColor);

  return {
    ...styling,
    color: columnColors.cellForegroundColor || styling.color,
    backgroundColor: columnColors.cellBackgroundColor || styling.backgroundColor,
  };
}

/**
 * Extends the cell styling with selection styling based on whether it is
 * selected, possible, excluded or not in in selection mode (no changes)
 */
export function getSelectionStyle(styling: CellStyle, cellSelectionState: SelectionStates): CellStyle {
  let selectionStyling = {};
  switch (cellSelectionState) {
    case SelectionStates.SELECTED:
      selectionStyling = SELECTION_STYLING.SELECTED;
      break;
    case SelectionStates.POSSIBLE:
      selectionStyling = SELECTION_STYLING.POSSIBLE;
      break;
    case SelectionStates.EXCLUDED:
      selectionStyling = {
        background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, ${styling.backgroundColor}`,
      };
      break;
    default:
      break;
  }

  return {
    ...styling,
    ...selectionStyling,
  };
}
