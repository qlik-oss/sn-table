export function getColor(color = {}, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export function getHeadStyle(layout, theme) {
  const header = layout.components?.[0]?.header;
  return header
    ? {
        fontColor: getColor(header.fontColor, '#404040', theme),
        fontSize: header.fontSize || '14px',
        padding: header.fontSize ? `${header.fontSize / 2}px ${header.fontSize}px` : '7px 14px',
      }
    : { padding: '7px 14px' };
}

export function getBodyStyle(layout, theme) {
  const content = layout.components?.[0]?.content;
  return content
    ? {
        fontColor: getColor(content.fontColor, '#404040', theme),
        fontSize: content.fontSize || '14px',
        padding: content.fontSize ? `${content.fontSize / 2}px ${content.fontSize}px` : '7px 14px',
      }
    : { padding: '7px 14px' };
}
