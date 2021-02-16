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
      }
    : {};
}

export function getBodyStyle(layout, theme) {
  const content = layout.components?.[0]?.content;
  const hoverColor = layout.components?.[0]?.hoverColor;
  const hoverFontColor = layout.components?.[0]?.hoverFontColor;
  return content
    ? {
        fontColor: getColor(content.fontColor, '#404040', theme),
        fontSize: content.fontSize || '14px',
        hoverBackGroundColor: getColor(hoverColor, 'blue', theme),
        hoverFontColor: getColor(hoverFontColor, 'black', theme),
      }
    : {};
}
