/* eslint-disable no-cond-assign */
import cssColors from './css-colors';

const getChunksFromString = (st: string, chunkSize: number): RegExpMatchArray =>
  st.match(new RegExp(`.{${chunkSize}}`, 'g')) as RegExpMatchArray;

const convertHexUnitTo256 = (hexStr: string): number => parseInt(hexStr.repeat(2 / hexStr.length), 16);

const hexToRGBAorRGB = (hex: string): string => {
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = getChunksFromString(hex.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return typeof a !== 'undefined' ? `rgba(${r},${g},${b},${a / 255})` : `rgb(${r},${g},${b})`;
};

export function resolveToRGBAorRGB(input: string): string {
  // rgb
  let matches = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(input);
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
  matches = /^#(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i.exec(input);
  if (matches) {
    return hexToRGBAorRGB(input);
  }
  // css color
  const color = input && cssColors[input.toLowerCase()];
  if (color) {
    return typeof color.a !== 'undefined'
      ? `rgba(${color.r},${color.g},${color.b},${color.a})`
      : `rgb(${color.r},${color.g},${color.b})`;
  }
  // invalid
  return 'none';
}

export function isDarkColor(color: string | undefined | null): boolean {
<<<<<<< HEAD
  if (!color) return false;
=======
  if (color == null) return false;
>>>>>>> main

  const rgba = resolveToRGBAorRGB(color);
  const matches =
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(rgba) ||
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
  const r = matches?.[1];
  const g = matches?.[2];
  const b = matches?.[3];
  const validRGB = r !== undefined && g !== undefined && b !== undefined;

  // Using the HSP (Highly Sensitive Poo) value, determine whether the color is light or dark
  // HSP < 125, the color is dark, otherwise, the color is light
  return validRGB ? 0.299 * +r + 0.587 * +g + 0.114 * +b < 125 : false;
}

export function isTransparentColor(color: string | undefined): boolean {
  if (color === undefined) return false;

  const rgba = resolveToRGBAorRGB(color);
  const matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
  const a = matches?.[4];
  return a !== undefined ? +a === 0 : false;
}

export function removeOpacity(color: string | undefined): string | undefined {
  if (color !== undefined) {
    const rgba = resolveToRGBAorRGB(color);
    const matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
    if (matches) return `rgb(${matches[1]},${matches[2]},${matches[3]})`;
  }
  return color;
}
