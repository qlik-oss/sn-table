import { resolveExpression, isDarkColor, removeOpacity } from './color-utils';

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

// Both index !== -1 and color !== null must be true for the property to be set
export const isSet = (prop) => prop && JSON.stringify(prop) !== JSON.stringify({ index: -1, color: null });

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
  const fontFamily = theme.getStyle('object', `straightTable.${objetName}`, 'fontFamily');
  const color = theme.getStyle('object', `straightTable.${objetName}`, 'color');
  const fontSize = theme.getStyle('object', `straightTable.${objetName}`, 'fontSize');

  const baseStyle = {
    fontFamily,
    color: isSet(styleObj?.fontColor) ? getColor(STYLING_DEFAULTS.FONT_COLOR, theme, styleObj.fontColor) : color,
    fontSize: styleObj?.fontSize || fontSize,
    padding: getPadding(styleObj, STYLING_DEFAULTS.PADDING),
    borderStyle: 'solid',
    borderColor: theme.table.body.borderColor,
  };
  // Remove all Undefined Values from an Object
  Object.keys(baseStyle).forEach((key) => baseStyle[key] == null && delete baseStyle[key]);
  return baseStyle;
};

export function getHeaderStyle(layout, theme) {
  const header = layout.components?.[0]?.header;
  const headerStyle = getBaseStyling(header, 'header', theme);
  headerStyle.borderWidth = '1px 1px 1px 0px';

  // When the table background color from the sense theme is transparent,
  // there is a header background color depending on the header font color
  // to avoid seeing the table body through the table head.
  const headerBackgroundColor = isDarkColor(headerStyle.color) ? '#FAFAFA' : '#323232';
  const RGB = removeOpacity(theme.table.backgroundColor);
  headerStyle.backgroundColor = theme.table.backgroundColor === 'transparent' ? headerBackgroundColor : RGB;

  // When you set the header font color,
  // the sort label color should be same.
  // When there is no header content color setting,
  // the sort label color is depending on the header background color.
  headerStyle.sortLabelColor =
    headerStyle.color ?? (isDarkColor(headerStyle.backgroundColor) ? 'rgba(255,255,255,0.9)' : 'rgba(0, 0, 0, 0.54)');

  return headerStyle;
}

export function getBodyCellStyle(layout, theme) {
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

  const isHoverFontColorSet = isSet(hoverFontColorFromLayout) || !!hoverFontColorFromTheme;
  const isHoverBackgroundColorSet = isSet(hoverBackgroundColorFromLayout) || !!hoverBackgroundColorFromTheme;
  const isHoverFontOrBackgroundColorSet = isHoverFontColorSet || isHoverBackgroundColorSet;

  let hoverBackgroundColor;
  if (isSet(hoverBackgroundColorFromLayout)) {
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
        isSet(hoverFontColorFromLayout) ? hoverFontColorFromLayout : hoverFontColorFromTheme
      ) // case 1 or 3 or 4
    : ''; // case 2;

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
