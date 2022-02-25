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
    color: styleObj?.fontColor ? getColor(STYLING_DEFAULTS.FONT_COLOR, theme, styleObj?.fontColor) : color,
    fontSize: styleObj?.fontSize || fontSize,
    padding: styleObj?.fontSize && `${styleObj?.fontSize / 2}px ${styleObj?.fontSize}px`,
    borderBottom: theme.isBackgroundDarkColor ? '1px solid #F2F2F3' : '1px solid #D9D9D9',
    borderRight: theme.isBackgroundDarkColor ? '1px solid #F2F2F3' : '1px solid #D9D9D9',
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
  const headerBackgroundColor = isDarkColor(headerStyle.color) ? '#FAFAFA' : '#323232';
  // When the table background color from sense theme is transparent,
  // there is a default background color for the header
  // to avoid seeing the table body through the table head
  headerStyle.backgroundColor = theme.backgroundColor === 'transparent' ? headerBackgroundColor : theme.backgroundColor;
  headerStyle.borderTop = theme.isBackgroundDarkColor ? '1px solid #F2F2F3' : '1px solid #D9D9D9';
  return headerStyle;
}

export function getBodyCellStyle(layout, theme) {
  const content = layout.components?.[0]?.content;

  // Cases when hoverEffect is true:
  // 1. There is no hover font color but a hover background color,
  // when hovering, the hover font color becomes white when the hover
  // background color is a dark color or the hover font color stays
  // the same as whatever the font color is when the hover background
  // color is a light color.
  // 2. There is a hover font color but no hover background color,
  // when hovering, only a hover font color is applied and the hover
  // background color disappears.
  // 3. There is no hover font color and no hover background color,
  // when hovering, the default hover effect (light gray background)
  // 4. There are both hover font and background colors, when hovering,
  // the hover font and background colors take effect.

  const unsetHoverBackgroundColor = isUnset(content?.hoverColor);
  const unsetHoverFontBackgroundColor = isUnset(content?.hoverFontColor) && unsetHoverBackgroundColor;

  const setHoverBackgroundColor = unsetHoverBackgroundColor
    ? ''
    : getColor(STYLING_DEFAULTS.HOVER_BACKGROUND, theme, content?.hoverColor);

  const hoverBackgroundColor = unsetHoverFontBackgroundColor
    ? STYLING_DEFAULTS.HOVER_BACKGROUND
    : setHoverBackgroundColor;

  const hoverFontColor = unsetHoverFontBackgroundColor
    ? ''
    : getColor(getAutoFontColor(hoverBackgroundColor), theme, content?.hoverFontColor);

  const contentStyle = getBaseStyling(content, 'content', theme);
  return {
    ...contentStyle,
    hoverBackgroundColor,
    hoverFontColor,
  };
}

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
    background: columnColors.cellBackgroundColor,
  };
}

export function getSelectionColors(cell, selectionState, background, tableBackgroundColor) {
  const { colIdx, rows, api } = selectionState;

  if (api.isModal()) {
    if (colIdx !== cell.colIdx)
      return {
        background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, ${
          background || tableBackgroundColor || STYLING_DEFAULTS.WHITE
        }`,
      };

    const match = (row) => row.qElemNumber === cell.qElemNumber;
    if (rows.some(match)) return SELECTION_STYLING.SELECTED;

    return SELECTION_STYLING.POSSIBLE;
  }

  return {};
}

export function getSelectionStyle(styling, cell, selectionState, tableBackgroundColor) {
  return { ...styling, ...getSelectionColors(cell, selectionState, styling.background, tableBackgroundColor) };
}
