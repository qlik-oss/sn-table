import isDarkColor from './color-utils';

export const STYLING_DEFAULTS = {
  FONT_SIZE: '14px',
  FONT_COLOR: '#404040',
  HOVER_BACKGROUND: '#f4f4f4',
  HOVER_TRANSPARENT: 'rgba(0, 0, 0, 0)',
  SELECTED_BACKGROUND: '#009845',
  EXCLUDED_BACKGROUND:
    'repeating-linear-gradient(-45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 6px)',
  WHITE: '#fff',
  PADDING: '7px 14px',
  HEIGHT: 'auto',
  HEAD_LINE_HEIGHT: '150%',
  BODY_LINE_HEIGHT: '130%',
};

export function getColor(color = {}, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export const getBaseStyling = (styleObj, theme) => ({
  color: getColor(styleObj.fontColor, STYLING_DEFAULTS.FONT_COLOR, theme),
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

  const baseStyling = getBaseStyling(content, theme);

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
    ? STYLING_DEFAULTS.HOVER_TRANSPARENT
    : getColor(content.hoverColor, STYLING_DEFAULTS.HOVER_BACKGROUND, theme);
  const hoverFontColor = unsetHoverFontandBackgroundColor
    ? baseStyling.fontColor
    : getColor(
        content.hoverFontColor,
        isDarkColor(hoverBackgroundColor) ? STYLING_DEFAULTS.WHITE : baseStyling.fontColor,
        theme
      );

  return { ...baseStyling, hoverBackgroundColor, hoverFontColor };
}

export function getColumnStyling(styling, qAttrExps, stylingInfo) {
  const props = {};
  qAttrExps?.qValues.forEach((val, i) => {
    props[stylingInfo[i]] = val.qText;
  });

  return {
    ...styling,
    color: props.cellForegroundColor || styling.color,
    background: props.cellBackgroundColor,
    height: STYLING_DEFAULTS.HEIGHT,
    lineHeight: STYLING_DEFAULTS.BODY_LINE_HEIGHT,
  };
}
