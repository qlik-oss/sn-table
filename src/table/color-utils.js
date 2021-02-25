/* eslint-disable no-cond-assign */
export default function isDarkColor(color) {
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
