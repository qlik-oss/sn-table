export function getColor(color, defaultColor, theme) {
  const resolvedColor = theme.getColorPickerColor(color);
  return !resolvedColor || resolvedColor === 'none' ? defaultColor : resolvedColor;
}

export function getHeadStyle(layout, theme) {
  return {
    fontColor: getColor(layout.components[0].header.fontColor, '#000', theme),
    fontSize: layout.components[0].header.fontSize,
  };
}
