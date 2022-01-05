import { resolveExpression, isDarkColor } from './color-utils';

// the order of style
// default < theme < styling settings < column < selection (except the selected green) < hover < selected green
export const STYLING_DEFAULTS = {
  FONT_SIZE: '14px',
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

export function getColor(color = {}, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export const getAutoFontColor = (backgroundColor) =>
  isDarkColor(backgroundColor) ? STYLING_DEFAULTS.WHITE : STYLING_DEFAULTS.FONT_COLOR;

// Both index === -1 and color === null must be true for the property to be unset
export const isUnset = (prop) => !prop || JSON.stringify(prop) === JSON.stringify({ index: -1, color: null });

export function getHeadStyle(layout, theme) {
  const header = layout.components?.[0]?.header;
  const headerStyle = {
    fontFamily: theme.getStyle('object.straightTable', 'header', 'fontFamily') || 'inherit',
    color: header
      ? getColor(header.fontColor, STYLING_DEFAULTS.FONT_COLOR, theme)
      : theme.getStyle('object.straightTable', 'header', 'color'),
    fontSize:
      header?.fontSize || theme.getStyle('object.straightTable', 'header', 'fontSize') || STYLING_DEFAULTS.FONT_SIZE,
    padding: header?.fontSize ? `${header.fontSize / 2}px ${header.fontSize}px` : STYLING_DEFAULTS.PADDING,
  };
  return headerStyle;
}

export function getBodyStyle(layout, theme) {
  const content = layout.components?.[0]?.content;

  // Cases when hoverEffect is true:
  // 1. There is no hover font color but a hover background color,
  // when hovering, the hover font color becomes white when the hover background color is a dark color
  // or the hover font color stays the same as whatever the font color is when the hover background color is a light color.
  // 2. There is a hover font color but no hover background color,
  // when hovering, only a hover font color is applied and the hover background color disappears.
  // 3. There is no hover font color and no hover background color, when hovering, the default hover effect (light gray background)
  // 4. There are both hover font and background colors, when hovering, the hover font and background colors take effect.

  const unsetHoverBackgroundColor = isUnset(content?.hoverColor);
  const unsetHoverFontandBackgroundColor = isUnset(content?.hoverFontColor) && unsetHoverBackgroundColor;
  const hoverBackgroundColorFromTheme = theme.getStyle('object.straightTable', 'content.hover', 'backgroundColor');

  const setHoverBackgroundColor = unsetHoverBackgroundColor
    ? hoverBackgroundColorFromTheme || ''
    : getColor(content.hoverColor, STYLING_DEFAULTS.HOVER_BACKGROUND, theme);

  const hoverBackgroundColor = unsetHoverFontandBackgroundColor
    ? hoverBackgroundColorFromTheme || STYLING_DEFAULTS.HOVER_BACKGROUND
    : setHoverBackgroundColor;

  const hoverFontColor = unsetHoverFontandBackgroundColor
    ? theme.getStyle('object.straightTable', 'content.hover', 'color') || ''
    : getColor(content.hoverFontColor, getAutoFontColor(hoverBackgroundColor), theme);

  const contentStyle = {
    fontFamily: theme.getStyle('object.straightTable', 'content', 'fontFamily') || 'inherit',
    color: content
      ? getColor(content.fontColor, STYLING_DEFAULTS.FONT_COLOR, theme)
      : theme.getStyle('object.straightTable', 'content', 'color'),
    fontSize:
      content?.fontSize || theme.getStyle('object.straightTable', 'content', 'fontSize') || STYLING_DEFAULTS.FONT_SIZE,
    padding: content?.fontSize ? `${content.fontSize / 2}px ${content.fontSize}px` : STYLING_DEFAULTS.PADDING,
    hoverBackgroundColor: [hoverBackgroundColor, '!important'],
    hoverFontColor: [hoverFontColor, '!important'],
    selectedCellClass: '',
  };

  return contentStyle;
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

export function getSelectionColors(background = STYLING_DEFAULTS.WHITE, cell, selectionState, backgroundColor) {
  const { colIdx, rows, api } = selectionState;

  if (api.isModal()) {
    if (colIdx !== cell.colIdx) {
      return { background: `${STYLING_DEFAULTS.EXCLUDED_BACKGROUND}, ${backgroundColor || background}` };
    }

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].qElemNumber === cell.qElemNumber) {
        return SELECTION_STYLING.SELECTED;
      }
    }

    return { ...SELECTION_STYLING.POSSIBLE, background: backgroundColor || SELECTION_STYLING.POSSIBLE.background };
  }

  return {};
}

export function getSelectionStyle(styling, cell, selectionState, backgroundColor) {
  const selectionStyle = {
    ...styling,
    ...getSelectionColors(styling.background, cell, selectionState, backgroundColor),
  };
  return selectionStyle;
}
