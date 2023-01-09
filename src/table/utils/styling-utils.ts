import { stardust } from '@nebula.js/stardust';

import { resolveToRGBAorRGB, isDarkColor, removeOpacity } from './color-utils';
import { TableLayout, ExtendedTheme, HeaderStyling, ContentStyling, PaletteColor, BackgroundColors } from '../../types';
import { GeneratedStyling, CellStyle, FooterStyle } from '../types';
import { SelectionStates, StylingDefaults, SELECTION_STYLING } from '../constants';

// the order of style
// default (inl. sprout theme) < Sense theme < styling settings
// < column < selection (except the selected green) < hover < selected green

/**
 * Determines if a palette color is set or not. Both index !== -1 and color !== null must be true for it to be set
 */
export const isColorSet = (prop: PaletteColor | undefined): boolean =>
  !!prop && (prop.color !== null || prop.index > -1);

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
  isDarkColor(backgroundColor) ? StylingDefaults.WHITE : StylingDefaults.FONT_COLOR;

/**
 * get the border color based on the color of the background, returns bright color if background is dark and vice versa
 * the borderLeftColor is only used for the leftmost cells, but that is added/removed by changing borderWidth
 * the same thing applies to the borderTopColor which is only used for totals when it is at the bottom
 */
export const getBorderColors = (isBackgroundDark: boolean, separatingBorder: string) => {
  // TODO: proper borders for dark background
  if (isBackgroundDark) {
    return {
      borderBottomColor: '#F2F2F2',
      borderRightColor: '#F2F2F2',
      borderLeftColor: '#F2F2F2',
      borderTopColor: '#F2F2F2',
    };
  }

  return {
    borderLeftColor: '#D9D9D9',
    borderRightColor: '#D9D9D9',
    borderTopColor: '#808080',
    borderBottomColor: separatingBorder === 'bottom' ? '#808080' : '#EBEBEB',
  };
};

/**
 * Gets base styling for either header or body taking table theme settings into account
 */
export const getBaseStyling = (
  objetName: string,
  theme: ExtendedTheme,
  styleObj: HeaderStyling | ContentStyling | undefined,
  separatingBorder = ''
): GeneratedStyling => {
  const fontFamily = theme.getStyle('object', `straightTable.${objetName}`, 'fontFamily');
  const color = theme.getStyle('object', `straightTable.${objetName}`, 'color');
  const fontSize = theme.getStyle('object', `straightTable.${objetName}`, 'fontSize');

  const baseStyle: GeneratedStyling = {
    fontFamily,
    color: isColorSet(styleObj?.fontColor) ? getColor(StylingDefaults.FONT_COLOR, theme, styleObj?.fontColor) : color,
    fontSize: (styleObj?.fontSize && `${styleObj.fontSize}px`) || fontSize,
    // When we do not set padding for content or header, but set font size,
    // we need to calculate the padding based on the font size
    padding: styleObj && 'padding' in styleObj ? styleObj?.padding : undefined,
    ...getBorderColors(theme.background.isDark, separatingBorder),
  };
  // Remove all undefined and null values
  Object.keys(baseStyle).forEach((key) => {
    const typedKey = key as keyof GeneratedStyling;
    baseStyle[typedKey] == null && delete baseStyle[typedKey]; // == catches null and undefined but not 0
  });
  return baseStyle;
};

/**
 * Gets complete styling for the header. Extends base styling with header specific styling se
 */
export function getHeaderStyle(layout: TableLayout, theme: ExtendedTheme, separatingBorder: string): GeneratedStyling {
  const header = layout.components?.[0]?.header;
  const headerStyle = getBaseStyling('header', theme, header, separatingBorder);

  // To avoid seeing the table body through the table head:
  // - When the table background color from the sense theme is transparent,
  // there is a header background color depending on the header font color
  // - When the table background color from the sense theme has opacity,
  // removing that.
  const headerBackgroundColor = isDarkColor(headerStyle.color)
    ? StylingDefaults.WHITE
    : StylingDefaults.HEAD_BACKGROUND_DARK;
  headerStyle.backgroundColor = theme.background.isTransparent
    ? headerBackgroundColor
    : removeOpacity(theme.background.color);

  // When you set the header font color,
  // the sort label color should be same.
  // When there is no header content color setting,
  // the sort label color is depending on the header background color.
  headerStyle.sortLabelColor =
    headerStyle.color ??
    (isDarkColor(headerStyle.backgroundColor) ? StylingDefaults.SORT_LABEL_LIGHT : StylingDefaults.SORT_LABEL_DARK);

  return headerStyle;
}

/**
 * Gets complete styling for the body. Extends base styling with hover styling
 */
export function getBodyCellStyle(layout: TableLayout, theme: ExtendedTheme): GeneratedStyling {
  const content = layout.components?.[0]?.content;
  const contentStyle = getBaseStyling('content', theme, content);

  // All following colors concern hover
  const backgroundColorFromLayout = content?.hoverColor;
  const fontColorFromLayout = content?.hoverFontColor;

  const backgroundColorFromTheme = theme.getStyle('object', '', 'straightTable.content.hover.backgroundColor');
  const fontColorFromTheme = theme.getStyle('object', '', 'straightTable.content.hover.color');

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

  const isFontColorSet = isColorSet(fontColorFromLayout) || !!fontColorFromTheme;
  const isBackgroundColorSet = isColorSet(backgroundColorFromLayout) || !!backgroundColorFromTheme;
  const isFontOrBackgroundColorSet = isFontColorSet || isBackgroundColorSet;

  let backgroundColor;
  if (isColorSet(backgroundColorFromLayout)) {
    // case 1 or 4
    backgroundColor = getColor(StylingDefaults.HOVER_BACKGROUND, theme, backgroundColorFromLayout);
  } else if (backgroundColorFromTheme) {
    // case 1 or 4
    backgroundColor = backgroundColorFromTheme;
  } else if (isFontColorSet) {
    backgroundColor = ''; // case 3
  } else {
    backgroundColor = StylingDefaults.HOVER_BACKGROUND; // case 2
  }

  const color = isFontOrBackgroundColorSet
    ? getColor(
        getAutoFontColor(backgroundColor),
        theme,
        isColorSet(fontColorFromLayout) ? fontColorFromLayout : fontColorFromTheme
      ) // case 1 or 3 or 4
    : ''; // case 2;

  return {
    ...contentStyle,
    hoverColors: {
      backgroundColor,
      color,
    },
  };
}

export const getFooterStyle = (background: BackgroundColors): FooterStyle =>
  background.isDark
    ? {
        backgroundColor: background.color,
        borderColor: '#F2F2F2',
        color: 'rgba(255, 255, 255, 0.9)',
        iconColor: 'rgba(255, 255, 255, 0.9)',
        disabledIconColor: 'rgba(255, 255, 255, 0.3)',
      }
    : {
        backgroundColor: background.color,
        borderColor: '#D9D9D9',
        color: '#404040',
        iconColor: 'rgba(0, 0, 0, 0.54)',
        disabledIconColor: 'rgba(0, 0, 0, 0.3)',
      };

/**
 * Gets complete styling for the totals cells. Based on the body style but with the background and borders from header
 */
export function getTotalsCellStyle(layout: TableLayout, theme: ExtendedTheme, totalsPosition: string) {
  const separatingBorder = totalsPosition === 'top' ? 'bottom' : 'top';
  const { borderBottomColor, borderTopColor, backgroundColor } = getHeaderStyle(layout, theme, separatingBorder);
  return { ...getBodyCellStyle(layout, theme), borderBottomColor, backgroundColor, borderTopColor };
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
        background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${styling.backgroundColor}`,
        selectedCellClass: SelectionStates.EXCLUDED,
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
