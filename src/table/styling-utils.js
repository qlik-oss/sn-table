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
  //  "hoverFontColor": {
  //   "index": -1,
  //   "color": null
  // } means the hover fornt color is unset.
  const unsetHoverFontColor =
    !content.hoverFontColor || JSON.stringify(content.hoverFontColor) === JSON.stringify({ index: -1, color: null });
  const unsetHoverColor =
    !content.hoverColor || JSON.stringify(content.hoverColor) === JSON.stringify({ index: -1, color: null });
  const unsetProps = unsetHoverFontColor && unsetHoverColor;

  // 1. hoverEffect is true, there is no font color (hover or non-hover) and a hover background color, the hover font color becomes white and the hover background color is set.
  // 2. hoverEffect is true, there is a hover font color but no hover background color, only a hover font color is applied when hovering and and the hover background color disappears.
  // 3. hoverEffect is true, there is a font color and a hover font colors and no hover background color
  // 4. hoverEffect is true, there is a font color and no hover font colors and no hover background colors
  return content
    ? {
        fontColor: getColor(content.fontColor, '#404040', theme),
        fontSize: content.fontSize || '14px',
        hoverBackGroundColor: `${
          unsetProps
            ? 'rgba(0, 0, 0, 0.03)'
            : unsetHoverColor
            ? 'rgba(0, 0, 0, 0)'
            : getColor(content.hoverColor, '#E5E5E5', theme)
        } !important`,
        hoverFontColor: unsetProps ? '' : getColor(content.hoverFontColor, '#ffffff', theme),
      }
    : {};
}
