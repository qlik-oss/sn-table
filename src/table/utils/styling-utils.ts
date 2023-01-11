import { stardust } from '@nebula.js/stardust';

import { resolveToRGBAorRGB, isDarkColor, removeOpacity } from './color-utils';
import { TableLayout, ExtendedTheme, HeaderStyling, ContentStyling, PaletteColor, BackgroundColors } from '../../types';
import { GeneratedStyling, CellStyle, FooterStyle } from '../types';
import { SelectionStates, StylingDefaults, SELECTION_STYLING, PAGINATION_HEIGHT } from '../constants';

// the order of style
// default (inl. sprout theme) < Sense theme < styling settings
// < column < selection (except the selected green) < hover < selected green

/**
 * Determines if a palette color is set or not. Both index !== -1 and color !== null must be true for it to be set
 */
export const isPaletteColorSet = (prop: PaletteColor | undefined): boolean =>
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
export const getAutoFontColor = (background: string): string =>
  isDarkColor(background) ? StylingDefaults.WHITE : StylingDefaults.FONT_COLOR;

/**
 * get the border color based on the color of the background, returns bright color if background is dark and vice versa
 * the borderLeftColor is only used for the leftmost cells, but that is added/removed by changing borderWidth
 * the same thing applies to the borderTopColor which is only used for totals when it is at the bottom
 */
export const getBorderColors = (isBackgroundDark: boolean, bottomSeparatingBorder: boolean) => {
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
    borderBottomColor: bottomSeparatingBorder ? '#808080' : '#EBEBEB',
  };
};

/**
 * Get border widths for body. adds a bottom border if the rendered rows height is estimated to be greater than the container height
 */
const getLastRowBottomBorder = (fontSize: string | undefined, rowsLength?: number, rootElement?: HTMLElement) => {
  if (fontSize && rowsLength && rootElement) {
    // add line height (133%), padding and borders
    const rowHeight = (+fontSize.slice(0, -2) * 4) / 3 + 9;
    // multiply with number of rows plus header and totals. Compare if greater than container
    const showBottomBorder = rowHeight * (rowsLength + 2) < rootElement.offsetHeight - PAGINATION_HEIGHT;
    return showBottomBorder ? '1px' : '0px';
  }
  return '0px';
};

/**
 * Gets base styling for either header or body taking table theme settings into account
 */
export const getBaseStyling = (
  objetName: string,
  theme: ExtendedTheme,
  styleObj: HeaderStyling | ContentStyling | undefined,
  bottomSeparatingBorder = false
): GeneratedStyling => {
  const fontFamily = theme.getStyle('object', `straightTable.${objetName}`, 'fontFamily');
  const color = theme.getStyle('object', `straightTable.${objetName}`, 'color');
  const fontSize = theme.getStyle('object', `straightTable.${objetName}`, 'fontSize');

  const baseStyle: GeneratedStyling = {
    fontFamily,
    color: isPaletteColorSet(styleObj?.fontColor)
      ? getColor(StylingDefaults.FONT_COLOR, theme, styleObj?.fontColor)
      : color,
    fontSize: (styleObj?.fontSize && `${styleObj.fontSize}px`) || fontSize,
    padding: styleObj && 'padding' in styleObj ? styleObj?.padding : undefined,
    ...getBorderColors(theme.background.isDark, bottomSeparatingBorder),
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
export function getHeaderStyle(
  layout: TableLayout,
  theme: ExtendedTheme,
  bottomSeparatingBorder: boolean
): GeneratedStyling {
  const header = layout.components?.[0]?.header;
  const headerStyle = getBaseStyling('header', theme, header, bottomSeparatingBorder);

  // To avoid seeing the table body through the table head:
  // - When the table background color from the sense theme is transparent,
  // there is a header background color depending on the header font color
  // - When the table background color from the sense theme has opacity,
  // removing that.
  const headerBackground = isDarkColor(headerStyle.color)
    ? StylingDefaults.WHITE
    : StylingDefaults.HEAD_BACKGROUND_DARK;
  headerStyle.background = theme.background.isTransparent ? headerBackground : removeOpacity(theme.background.color);

  // When you set the header font color,
  // the sort label color should be same.
  // When there is no header content color setting,
  // the sort label color is depending on the header background color.
  headerStyle.sortLabelColor =
    headerStyle.color ??
    (isDarkColor(headerStyle.background) ? StylingDefaults.SORT_LABEL_LIGHT : StylingDefaults.SORT_LABEL_DARK);

  return headerStyle;
}

/**
 * Gets complete styling for the body. Extends base styling with hover styling and last row border
 */
export function getBodyStyle(
  layout: TableLayout,
  theme: ExtendedTheme,
  rowsLength?: number,
  rootElement?: HTMLElement
): GeneratedStyling {
  const content = layout.components?.[0]?.content;
  const contentStyle = getBaseStyling('content', theme, content);
  contentStyle.background = theme.background.color;

  const lastRowBottomBorder = getLastRowBottomBorder(contentStyle?.fontSize, rowsLength, rootElement);

  // All following colors concern hover
  const backgroundFromLayout = content?.hoverColor;
  const colorFromLayout = content?.hoverFontColor;

  const backgroundFromTheme = theme.getStyle('object', '', 'straightTable.content.hover.backgroundColor');
  const colorFromTheme = theme.getStyle('object', '', 'straightTable.content.hover.color');

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

  const isColorSet = isPaletteColorSet(colorFromLayout) || !!colorFromTheme;
  const isBackgroundSet = isPaletteColorSet(backgroundFromLayout) || !!backgroundFromTheme;
  const isColorOrBackgroundSet = isColorSet || isBackgroundSet;

  let background;
  if (isPaletteColorSet(backgroundFromLayout)) {
    // case 1 or 4
    background = getColor(StylingDefaults.HOVER_BACKGROUND, theme, backgroundFromLayout);
  } else if (backgroundFromTheme) {
    // case 1 or 4
    background = backgroundFromTheme;
  } else if (isColorSet) {
    background = ''; // case 3
  } else {
    background = StylingDefaults.HOVER_BACKGROUND; // case 2
  }

  const color = isColorOrBackgroundSet
    ? getColor(
        getAutoFontColor(background),
        theme,
        isPaletteColorSet(colorFromLayout) ? colorFromLayout : colorFromTheme
      ) // case 1 or 3 or 4
    : ''; // case 2;

  return {
    ...contentStyle,
    lastRowBottomBorder,
    hoverColors: {
      background,
      color,
    },
  };
}

export const getFooterStyle = (background: BackgroundColors): FooterStyle =>
  background.isDark
    ? {
        background: background.color,
        borderColor: '#F2F2F2',
        color: 'rgba(255, 255, 255, 0.9)',
        iconColor: 'rgba(255, 255, 255, 0.9)',
        disabledIconColor: 'rgba(255, 255, 255, 0.3)',
      }
    : {
        background: background.color,
        borderColor: '#D9D9D9',
        color: '#404040',
        iconColor: 'rgba(0, 0, 0, 0.54)',
        disabledIconColor: 'rgba(0, 0, 0, 0.3)',
      };

/**
 * Gets complete styling for the totals cells. Based on the body style but with the background and borders from header
 */
export function getTotalsCellStyle(layout: TableLayout, theme: ExtendedTheme, totalsAtTop: boolean) {
  const content = layout.components?.[0]?.content;
  const contentStyle = getBaseStyling('content', theme, content);
  const { borderBottomColor, borderTopColor, background } = getHeaderStyle(layout, theme, totalsAtTop);
  return { ...contentStyle, borderBottomColor, background, borderTopColor };
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
    background: columnColors.cellBackgroundColor || styling.background,
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
        background: `${StylingDefaults.EXCLUDED_BACKGROUND}, ${styling.background}`,
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
