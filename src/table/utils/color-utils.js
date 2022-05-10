/* eslint-disable no-cond-assign */
import cssColors from './css-colors';

const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, 'g'));
const convertHexUnitTo256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16);
const hexToRGBAorRGB = (hex) => {
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = getChunksFromString(hex.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return typeof a !== 'undefined' ? `rgba(${r},${g},${b},${a / 255})` : `rgb(${r},${g},${b})`;
};

export function resolveExpression(input) {
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
    const a = Math.round(matches[1] / 2.55) / 100;
    return `rgba(${matches[2]},${matches[3]},${matches[4]},${a})`;
  }
  // hex
  matches = /^#([A-Fa-f0-9]{3,4}){1,2}$/i.exec(input);
  if (matches) {
    return hexToRGBAorRGB(input);
  }
  // css color
  const color = input && cssColors[input.toLowerCase()];
  if (color) {
    const a = color.a !== undefined ? color.a : 1;
    return `rgba(${color.r},${color.g},${color.b},${a})`;
  }
  // invalid
  return 'none';
}

export function isDarkColor(color) {
  const rgba = resolveExpression(color);
  const matches =
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(rgba) ||
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
  const r = +matches?.[1];
  const g = +matches?.[2];
  const b = +matches?.[3];

  // Using the HSP (Highly Sensitive Poo) value, determine whether the color is light or dark
  // HSP < 125, the color is dark, otherwise, the color is light
  return 0.299 * r + 0.587 * g + 0.114 * b < 125;
}

export function isTransparentColor(color, opacity) {
  if (+opacity === 0) {
    return true;
  }
  const rgba = resolveExpression(color);
  const matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
  return +matches?.[4] === 0;
}

export function removeOpacity(color) {
  const rgba = resolveExpression(color);
  const matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(rgba);
  if (matches) return `rgb(${matches[1]},${matches[2]},${matches[3]})`;
  return color;
}
