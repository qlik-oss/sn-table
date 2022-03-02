import { resolveExpression, isDarkColor } from './color-utils';

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

export function getPadding(styleObj, defaultPadding) {
  let padding = defaultPadding;
  if (styleObj?.padding) {
    ({ padding } = styleObj);
  } else if (styleObj?.fontSize) {
    padding = `${styleObj.fontSize / 2}px ${styleObj.fontSize}px`;
  }
  return padding;
}

export function getColor(defaultColor, theme, color = {}) {
  const resolvedColor = theme.getColorPickerColor(color);

  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export const getAutoFontColor = (backgroundColor) =>
  isDarkColor(backgroundColor) ? STYLING_DEFAULTS.WHITE : STYLING_DEFAULTS.FONT_COLOR;

export const getBaseStyling = (styleObj, objetName, theme) => {
  const backgroundColor = theme.getStyle('object', 'straightTable', 'backgroundColor');
  const fontFamily = theme.getStyle('object', `straightTable.${objetName}`, 'fontFamily');
  const color = theme.getStyle('object', `straightTable.${objetName}`, 'color');
  const fontSize = theme.getStyle('object', `straightTable.${objetName}`, 'fontSize');

  const baseStyle = {
    backgroundColor,
    fontFamily,
    color: styleObj?.fontColor ? getColor(STYLING_DEFAULTS.FONT_COLOR, theme, styleObj.fontColor) : color,
    fontSize: styleObj?.fontSize || fontSize,
    padding: getPadding(styleObj, STYLING_DEFAULTS.PADDING),
    borderBottom: theme.isBackgroundDarkColor ? '1px solid #F2F2F2' : '1px solid #D9D9D9',
    borderRight: theme.isBackgroundDarkColor ? '1px solid #F2F2F2' : '1px solid #D9D9D9',
  };
  // Remove all Undefined Values from an Object
  Object.keys(baseStyle).forEach((key) => baseStyle[key] == null && delete baseStyle[key]);
  return baseStyle;
};

// Both index === -1 and color === null must be true for the property to be unset
export const isUnset = (prop) => !prop || JSON.stringify(prop) === JSON.stringify({ index: -1, color: null });

export function getHeaderStyle(layout, theme) {
  const header = layout.components?.[0]?.header;
  const headerStyle = getBaseStyling(header, 'header', theme);

  // When the table background color from the sense theme is transparent,
  // there is a header background color depending on the header font color
  // to avoid seeing the table body through the table head.
  const headerBackgroundColor = isDarkColor(headerStyle.color) ? '#FAFAFA' : '#323232';
  headerStyle.backgroundColor = theme.backgroundColor === 'transparent' ? headerBackgroundColor : theme.backgroundColor;
  headerStyle.borderTop = theme.isBackgroundDarkColor ? '1px solid #F2F2F2' : '1px solid #D9D9D9';
  // When you set the header font color,
  // the sort label color should be same.
  // When there is no header content color setting,
  // the sort label color is depending on the header background color.
  headerStyle.sortLabelColor =
    headerStyle.color ?? isDarkColor(headerStyle.backgroundColor) ? 'rgba(255,255,255,0.9)' : 'rgba(0, 0, 0, 0.54)';
  return headerStyle;
}

export function getHoverBackgroundColor(theme) {
  const hoverBackgroundColor = theme.getStyle('object', 'straightTable.content.hover', 'backgroundColor');
  const tableBackgroundColor = theme.getStyle('object', 'straightTable', 'backgroundColor');
  const objectBackgroundColor = theme.getStyle('object', '', 'backgroundColor');
  const isHoverBackgroundColorFromTheme =
    !(hoverBackgroundColor === tableBackgroundColor || hoverBackgroundColor === objectBackgroundColor) ||
    // hoverBackgroundColor is green
    // tableBackgroundColor is red
    // objectBackgroundColor is green
    (hoverBackgroundColor !== tableBackgroundColor && hoverBackgroundColor === objectBackgroundColor);

  return isHoverBackgroundColorFromTheme ? hoverBackgroundColor : undefined;
}

export function getHoverFontColor(theme) {
  const hoverFontColor = theme.getStyle('object', 'straightTable.content.hover', 'color');
  const contentFontColor = theme.getStyle('object', 'straightTable.content', 'color');
  const tableFontColor = theme.getStyle('object', 'straightTable', 'color');
  const isHoverFontColorFromTheme = !(hoverFontColor === contentFontColor || hoverFontColor === tableFontColor);

  return isHoverFontColorFromTheme ? hoverFontColor : undefined;
}

export function getBodyCellStyle(layout, theme) {
  const hoverBackgroundColorFromTheme = getHoverBackgroundColor(theme);
  const hoverFontColorFromTheme = getHoverFontColor(theme);

  const content = layout.components?.[0]?.content;
  const contentHoverBackgroundColor = content?.hoverColor;
  const contentHoverFontColor = content?.hoverFontColor;

  // Cases when hoverEffect is true:
  // 1. There is no hover font color but a hover background color,
  // when hovering, the hover font color becomes white when the hover
  // background color is a dark color or the hover font color stays
  // the same as whatever the font color is when the hover background
  // color is a light color.
  // 2. There is a hover font color but no hover background color,
  // when hovering, only the font color is applied and no hover
  // background color is shown.
  // 3. There is no hover font color and no hover background color,
  // when hovering, the default hover effect (a light gray hover background
  // color and no hover font color).
  // 4. There are both a hover font and a hover background color,
  // when hovering, the hover font and the hover background color take effect.
  // Note that hover colors from properties have a
  // higher priority than those from theme.
  const unsetHoverBackgroundColor = isUnset(contentHoverBackgroundColor) && !hoverBackgroundColorFromTheme;
  const unsetHoverFontColor = isUnset(contentHoverFontColor) && !hoverFontColorFromTheme;
  const unsetHoverFontBackgroundColor = unsetHoverBackgroundColor && unsetHoverFontColor;

  // case 1 or 4
  let hoverBackgroundColor = isUnset(contentHoverBackgroundColor)
    ? hoverBackgroundColorFromTheme
    : getColor(STYLING_DEFAULTS.HOVER_BACKGROUND, theme, contentHoverBackgroundColor);
  hoverBackgroundColor = unsetHoverBackgroundColor
    ? '' // case 2
    : hoverBackgroundColor;
  hoverBackgroundColor = unsetHoverFontBackgroundColor
    ? STYLING_DEFAULTS.HOVER_BACKGROUND // case 3
    : hoverBackgroundColor;

  const hoverFontColor = unsetHoverFontBackgroundColor
    ? '' // case 3
    : getColor(
        getAutoFontColor(hoverBackgroundColor),
        theme,
        isUnset(contentHoverFontColor) ? hoverFontColorFromTheme : contentHoverFontColor
      ); // case 1 or 2 or 4

  const contentStyle = getBaseStyling(content, 'content', theme);
  return {
    ...contentStyle,
    hoverBackgroundColor,
    hoverFontColor,
  };
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
 * @param {Object} styling - style from styling in CellRenderer in TableBodyWrapper
 * @param {?Object} qAttrExps - qAttributeExpressions from each cell
 * @param {Array} stylingInfo - stylingInfo from each column
 * @returns {Object} cell font color and background color used for cells in specific columns
 */
export function getColumnStyle(styling, qAttrExps, stylingInfo) {
  const columnColors = {};
  qAttrExps?.qValues.forEach((val, i) => {
    columnColors[stylingInfo[i]] = resolveExpression(val.qText);
  });

  if (columnColors.cellBackgroundColor && !columnColors.cellForegroundColor)
    columnColors.cellForegroundColor = getAutoFontColor(columnColors.cellBackgroundColor);

  return {
    ...styling,
    color: columnColors.cellForegroundColor || styling.color,
    backgroundColor: columnColors.cellBackgroundColor,
  };
}

/**
 * Get the style for one cell based on wether it is
 * selected or possible to be selected or not possible to be selected
 * @param {Object} cell - The info of one cell in the table body
 * @param {Object} selectionState - The info of which cells are selected
 * @param {?String} columnBackgroundColor - The background color from qAttributeExpressions in qDimensions or qMeasures
 * @param {?String} [themeBackgroundColor='#fff'] - The background color from nebula theme or sense theme
 * @returns {Object} The style for the provided cell
 */
export function getSelectionColors(
  cell,
  selectionState,
  columnBackgroundColor,
  themeBackgroundColor = STYLING_DEFAULTS.WHITE
) {
  const { colIdx, rows, api } = selectionState;

  if (api.isModal()) {
    if (colIdx !== cell.colIdx)
      return {
        background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, ${columnBackgroundColor || themeBackgroundColor}`,
      };

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].qElemNumber === cell.qElemNumber) {
        return SELECTION_STYLING.SELECTED;
      }
    }

    return SELECTION_STYLING.POSSIBLE;
  }

  return {};
}

export function getSelectionStyle(styling, cell, selectionState, themeBackgroundColor) {
  return {
    ...styling,
    ...getSelectionColors(cell, selectionState, styling.backgroundColor, themeBackgroundColor),
  };
}
