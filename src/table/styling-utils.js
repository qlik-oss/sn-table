export function getColor(color, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export function getHeadStyle(layout, theme) {
  const header = layout.components?.[0]?.header;
  return header
    ? {
        fontColor: getColor(header.fontColor, '#404040', theme),
        fontSize: header.fontSize || '14px',
      }
    : {};
}
