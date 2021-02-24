/* eslint-disable no-cond-assign */
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

function isDarkColor(color) {
  let r;
  let g;
  let b;
  let matches;
  if (
    (matches =
      /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(color) ||
      /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(color))
  ) {
    r = parseInt(matches[1], 10);
    g = parseInt(matches[2], 10);
    b = parseInt(matches[3], 10);
  } else if ((matches = /^#([A-f0-9]{2})([A-f0-9]{2})([A-f0-9]{2})$/i.exec(color))) {
    // #aBc123
    r = parseInt(matches[1], 16);
    g = parseInt(matches[2], 16);
    b = parseInt(matches[3], 16);
  }
  // Using the HSP (Highly Sensitive Poo) value, determine whether the color is light or dark
  // HSP < 125, the color is dark, otherwise, the color is light
  return 0.299 * r + 0.587 * g + 0.114 * b < 125;
}

function isUnset(prop) {
  return !prop || JSON.stringify(prop) === JSON.stringify({ index: -1, color: null });
}

export function getBodyStyle(layout, theme) {
  const content = layout.components?.[0]?.content;
  if (!content) return {};

  //  "hoverFontColor": {
  //   "index": -1,
  //   "color": null
  // } means the hover fornt color is unset.
  const unsetHoverFontColor = isUnset(content.hoverFontColor);
  const unsetHoverBackgroundColor = isUnset(content.hoverColor);
  const unsetHoverFontandBackgroundColor = unsetHoverFontColor && unsetHoverBackgroundColor;

  // 1. hoverEffect is true, there is no hover font color but a hover background color,
  // when hovering, the hover font color becomes white when the hover background color is a dark color
  // or the hover font color stays the same as whetever the font color is when the hover background color is a light color.
  // 2. hoverEffect is true, there is a hover font color but no hover background color,
  // when hovering, only a hover font color is applied when hovering and and the hover background color disappears.
  // 3. hoverEffect is true, there is a font color but no hover font color and no hover background color, when hovering, the defalut hover effect
  // 4. hoverEffect is true, there are all colors, when hovering, the set hover font color and the the hover background color take effect.

  const hoverBackgroundColor = unsetHoverFontandBackgroundColor
    ? 'rgba(0, 0, 0, 0.03)'
    : unsetHoverBackgroundColor
    ? 'rgba(0, 0, 0, 0)'
    : getColor(content.hoverColor, 'rgba(0, 0, 0, 0.03)', theme);

  const fontColor = getColor(content.fontColor, '#404040', theme);
  const hoverFontColor = unsetHoverFontandBackgroundColor
    ? fontColor
    : getColor(content.hoverFontColor, isDarkColor(hoverBackgroundColor) ? '#ffffff' : fontColor, theme);

  return {
    fontColor: getColor(content.fontColor, '#404040', theme),
    fontSize: content.fontSize || '14px',
    hoverBackgroundColor: `${hoverBackgroundColor} !important`,
    hoverFontColor,
  };
}
