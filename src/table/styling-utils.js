import isDarkColor from './color-utils';

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
  HEIGHT: 'auto',
  HEAD_LINE_HEIGHT: '150%',
  BODY_LINE_HEIGHT: '130%',
};

export const SELECTION_STYLING = {
  EXCLUDED: {
    background: STYLING_DEFAULTS.EXCLUDED_BACKGROUND,
  },
  SELECTED: {
    fontColor: STYLING_DEFAULTS.WHITE,
    backgroundColor: STYLING_DEFAULTS.SELECTED_BACKGROUND,
    // Setting a specific class for selected cells styling to override hover effect
    selectedCellClass: STYLING_DEFAULTS.SELECTED_CLASS,
  },
  POSSIBLE: {
    fontColor: STYLING_DEFAULTS.FONT_COLOR,
    backgroundColor: STYLING_DEFAULTS.WHITE,
  },
};

export function getColor(color = {}, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export const getBaseStyling = (styleObj, theme) => ({
  fontColor: getColor(styleObj.fontColor, STYLING_DEFAULTS.FONT_COLOR, theme),
  fontSize: styleObj.fontSize || STYLING_DEFAULTS.FONT_SIZE,
  padding: styleObj.fontSize ? `${styleObj.fontSize / 2}px ${styleObj.fontSize}px` : STYLING_DEFAULTS.PADDING,
});

// Both index === -1 and color === null must be true for the property to be unset
export const isUnset = (prop) => !prop || JSON.stringify(prop) === JSON.stringify({ index: -1, color: null });

export function getHeadStyle(layout, theme) {
  const header = layout.components?.[0]?.header;
  return header ? getBaseStyling(header, theme) : { padding: STYLING_DEFAULTS.PADDING };
}

export function getBodyStyle(layout, theme) {
  const content = layout.components?.[0]?.content;
  if (!content) return { padding: STYLING_DEFAULTS.PADDING };

  // Cases when hoverEffect is true:
  // 1. There is no hover font color but a hover background color,
  // when hovering, the hover font color becomes white when the hover background color is a dark color
  // or the hover font color stays the same as whetever the font color is when the hover background color is a light color.
  // 2. There is a hover font color but no hover background color,
  // when hovering, only a hover font color is applied and the hover background color disappears.
  // 3. There is no hover font color and no hover background color, when hovering, the defalut hover effect (light gray backgournd)
  // 4. There are both hover font and background colors, when hovering, the hover font and background colors take effect.

  const unsetHoverBackgroundColor = isUnset(content.hoverColor);
  const unsetHoverFontandBackgroundColor = isUnset(content.hoverFontColor) && unsetHoverBackgroundColor;

  const hoverBackgroundColor = unsetHoverFontandBackgroundColor
    ? STYLING_DEFAULTS.HOVER_BACKGROUND
    : unsetHoverBackgroundColor
    ? ''
    : getColor(content.hoverColor, STYLING_DEFAULTS.HOVER_BACKGROUND, theme);
  const hoverFontColor = unsetHoverFontandBackgroundColor
    ? ''
    : getColor(content.hoverFontColor, isDarkColor(hoverBackgroundColor) ? STYLING_DEFAULTS.WHITE : '', theme);

  return { ...getBaseStyling(content, theme), hoverBackgroundColor, hoverFontColor, selectedCellClass: '' };
}

export function getColumnStyle(styling, qAttrExps, stylingInfo) {
  const columnColors = {};
  qAttrExps?.qValues.forEach((val, i) => {
    columnColors[stylingInfo[i]] = val.qText;
  });

  return {
    ...styling,
    fontColor: columnColors.cellForegroundColor || styling.fontColor,
    backgroundColor: columnColors.cellBackgroundColor,
  };
}

export function getSelectionColors(cell, selState) {
  const { colIdx, rows } = selState;

  if (rows.length) {
    if (colIdx !== cell.colIdx) return SELECTION_STYLING.EXCLUDED;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].qElemNumber === cell.qElemNumber) return SELECTION_STYLING.SELECTED;
    }

    return SELECTION_STYLING.POSSIBLE;
  }

  return {};
}

export function getSelectionStyle(styling, cell, selState) {
  return { ...styling, ...getSelectionColors(cell, selState) };
}
