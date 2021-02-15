export function getColor(color, defaultColor, theme) {
  const resolvedColor = color && theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? color || defaultColor : resolvedColor;
}

export function getHeadStyle(layout, theme) {
  const header = layout?.components?.[0]?.header;
  return header
    ? {
        fontColor: getColor(header.fontColor, '#404040', theme),
        fontSize: header.fontSize || '14px',
      }
    : {};
}

export function getBodyStyle(layout, theme) {
  const content = layout?.components?.[0]?.content;
  return content
    ? {
        fontColor: getColor(content.fontColor, '#404040', theme),
        fontSize: content.fontSize || '14px',
      }
    : {};
}
