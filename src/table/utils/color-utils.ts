/* eslint-disable no-cond-assign */
import cssColors from './css-colors';

const getChunksFromString = (st: string, chunkSize: number) => st.match(new RegExp(`.{${chunkSize}}`, 'g'));
const convertHexUnitTo256 = (hexStr: string) => parseInt(hexStr.repeat(2 / hexStr.length), 16);
const hexToRGBAorRGB = (hex: string) => {
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = getChunksFromString(hex.slice(1), chunkSize);
  if (hexArr) {
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
    return typeof a !== 'undefined' ? `rgba(${r},${g},${b},${a / 255})` : `rgb(${r},${g},${b})`;
  }
  return '';
};

export function resolveToRGBAorRGB(input: string | undefined) {
  // rgb
  let matches = input && /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(input);
  if (matches) {
    return `rgb(${matches[1]},${matches[2]},${matches[3]})`;
  }
  // rgba
  matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(input);
  if (matches) {
    return `rgba(${matches[1]},${matches[2]},${matches[3]},${matches[4]})`;
  }
  // argb
  matches = /^argb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(input);
  if (matches) {
    const a = Math.round(+matches[1] / 2.55) / 100;
    return `rgba(${matches[2]},${matches[3]},${matches[4]},${a})`;
  }
  // hex (#rgb, #rgba, #rrggbb, and #rrggbbaa)
  matches = input && /^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i.exec(input);
  if (matches) {
    return input && hexToRGBAorRGB(input);
  }
  // css color
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const color = input && (cssColors as any)[input.toLowerCase()];
  if (color) {
    return typeof color.a !== 'undefined'
      ? `rgba(${color.r},${color.g},${color.b},${color.a})`
      : `rgb(${color.r},${color.g},${color.b})`;
  }
  // invalid
  return 'none';
}

export function isDarkColor(color: string | undefined) {
  const rgba = resolveToRGBAorRGB(color);
  const matches =
    rgba &&
    (/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(rgba) ||
      /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba));
  if (matches) {
    const r = +matches[1];
    const g = +matches[2];
    const b = +matches[3];

    // Using the HSP (Highly Sensitive Poo) value, determine whether the color is light or dark
    // HSP < 125, the color is dark, otherwise, the color is light
    return 0.299 * r + 0.587 * g + 0.114 * b < 125;
  }
  return false;
}

export function isTransparentColor(color: string | undefined) {
  const rgba = resolveToRGBAorRGB(color);
  const matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
  if (matches) {
    return +matches[4] === 0;
  }
  return false;
}

export function removeOpacity(color: string) {
  const rgba = resolveToRGBAorRGB(color);
  const matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
  if (matches) return `rgb(${matches[1]},${matches[2]},${matches[3]})`;
  return color;
}
