export const STYLING_DEFAULTS = {
  FONT_SIZE: '14px',
  FONT_COLOR: '#404040',
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

export function getBodyStyle(layout, theme) {
  const content = layout.components?.[0]?.content;
  return content
    ? {
        fontColor: getColor(content.fontColor, STYLING_DEFAULTS.FONT_COLOR, theme),
        fontSize: content.fontSize || STYLING_DEFAULTS.FONT_SIZE,
        padding: content.fontSize ? `${content.fontSize / 2}px ${content.fontSize}px` : STYLING_DEFAULTS.PADDING,
      }
    : { padding: STYLING_DEFAULTS.PADDING };
}
