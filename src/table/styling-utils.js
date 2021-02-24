import isDarkColor from './color-utils';

export const STYLING_DEFAULTS = {
  FONT_SIZE: '14px',
  FONT_COLOR: '#404040',
  HOVER_BACKGROUND: '#f4f4f4',
  HOVER_TRANSPARENT: 'rgba(0, 0, 0, 0)',
  LIGHT_COLOR: '#ffffff',
  PADDING: '7px 14px',
  HEIGHT: 'auto',
  HEAD_LINE_HEIGHT: '150%',
  BODY_LINE_HEIGHT: '130%',
};

export function getColor(color = {}, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export function getHeadStyle(layout, theme) {
  const header = layout.components?.[0]?.header;
  return header
    ? {
        fontColor: getColor(header.fontColor, STYLING_DEFAULTS.FONT_COLOR, theme),
        fontSize: header.fontSize || STYLING_DEFAULTS.FONT_SIZE,
        padding: header.fontSize ? `${header.fontSize / 2}px ${header.fontSize}px` : STYLING_DEFAULTS.PADDING,
      }
    : { padding: STYLING_DEFAULTS.PADDING };
}

// Both index === -1 and color === null must be true for the property to be unset
export function isUnset(prop) {
  return !prop || JSON.stringify(prop) === JSON.stringify({ index: -1, color: null });
}

export function getBodyStyle(layout, theme) {
  const content = layout.components?.[0]?.content;
  if (!content) return { padding: STYLING_DEFAULTS.PADDING };

  const fontColor = getColor(content.fontColor, STYLING_DEFAULTS.FONT_COLOR, theme);

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
    ? fontColor
    : getColor(
        content.hoverFontColor,
        isDarkColor(hoverBackgroundColor) ? STYLING_DEFAULTS.LIGHT_COLOR : fontColor,
        theme
      );

  return {
    fontSize: content.fontSize || STYLING_DEFAULTS.FONT_SIZE,
    padding: content.fontSize ? `${content.fontSize / 2}px ${content.fontSize}px` : STYLING_DEFAULTS.PADDING,
    fontColor,
    hoverBackgroundColor,
    hoverFontColor,
  };
}
