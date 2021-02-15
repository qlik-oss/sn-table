export function getColor(color, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export function getHeadStyle(layout, theme) {
  const styling = layout?.components?.[0];
  return styling
    ? {
        fontColor: getColor(styling.header.fontColor, '#404040', theme),
        fontSize: styling.header.fontSize || '14px',
      }
    : {};
}
