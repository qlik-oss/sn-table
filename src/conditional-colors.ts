/* eslint-disable prefer-destructuring */
import { TableCell } from './types';

export type PaletteColor = {
  color: string;
  icon: string;
  index: number;
};

export type Limit = {
  value: number;
  gradient: boolean;
  normal: number;
};

export type Segments = {
  limits: Array<Limit>;
  paletteColors: Array<PaletteColor>;
};

export type ConditionalColoring = {
  segments: Segments;
};

export type Column = {
  conditionalColoring: ConditionalColoring;
  qMin?: number;
  qMax?: number;
};

export type LimitBound = {
  upperIndex: number;
  lowerIndex: number;
};

export type ConditionalColoringMeasureInfo = EngineAPI.INxMeasureInfo & { conditionalColoring?: ConditionalColoring };

function interpolate(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

export function lerp(a: string, b: string, amount: number) {
  if (!a.startsWith('#') || !b.startsWith('#')) {
    return 'none';
  }
  const from = parseInt(a.slice(1, 7), 16);
  const to = parseInt(b.slice(1, 7), 16);
  const ar = (from & 0xff0000) >> 16;
  const ag = (from & 0x00ff00) >> 8;
  const ab = from & 0x0000ff;
  const br = (to & 0xff0000) >> 16;
  const bg = (to & 0x00ff00) >> 8;
  const bb = to & 0x0000ff;
  const rr = interpolate(ar, br, amount);
  const rg = interpolate(ag, bg, amount);
  const rb = interpolate(ab, bb, amount);

  // 6 because it's a hex
  return `#${((rr << 16) + (rg << 8) + (rb | 0)).toString(16).padStart(6, '0').slice(-6)}`;
}

function getAutoMinMax(lmts: Array<Limit>, val: number) {
  let limits = lmts.map((l: Limit) => l.value);

  let range;
  let delta = 0;

  limits = limits.sort((a, b) => a - b);
  const nanLimits = limits.some((l) => Number.isNaN(+l));

  // eslint-disable-next-line no-nested-ternary
  const value = !Number.isNaN(+val) ? val : !Number.isNaN(+limits[0]) ? limits[0] : 0.5;

  if (limits.length === 0 || nanLimits) {
    if (value === 0) {
      delta = 0;
    } else {
      delta = value * 0.5;
    }
  } else if (limits.length === 1) {
    range = limits[0] - value;

    if (range === 0 || Number.isNaN(+range)) {
      if (value === 0) {
        delta = 0.5;
      } else {
        delta = Math.abs(value * 0.5);
      }
    } else if (range > 0) {
      // limit on right side of value
      return {
        min: value - Math.abs(value) * 0.5,
        max: limits[0] + 2 * range,
      };
    } else {
      return {
        min: limits[0] + 2 * range,
        max: value + Math.abs(value) * 0.5,
      };
    }
  } else {
    // 2 or more limits
    range = limits[limits.length - 1] - limits[0];
    range = range > 0 ? range : 1;
    return {
      min: Math.min(value, limits[0]) - range / 2,
      max: Math.max(value, limits[limits.length - 1]) + range / 2,
    };
  }

  return {
    min: value - delta,
    max: value + delta,
  };
}

function shouldBlend(segmentInfo: Segments, colorIndex: number) {
  if (segmentInfo.limits.length === 0) {
    return false;
  }

  let returnBoolean;

  if (colorIndex === 0) {
    // first color
    returnBoolean = segmentInfo.limits[colorIndex].gradient;
  } else if (colorIndex === segmentInfo.limits.length) {
    returnBoolean = segmentInfo.limits[colorIndex - 1].gradient;
  } else {
    returnBoolean = segmentInfo.limits[colorIndex].gradient || segmentInfo.limits[colorIndex - 1].gradient;
  }

  return returnBoolean;
}

export function getConditionalColor(paletteIndex: number, value: number, column: Column): PaletteColor {
  if (!shouldBlend(column.conditionalColoring.segments, paletteIndex)) {
    return column.conditionalColoring.segments.paletteColors[paletteIndex];
  }

  const { paletteColors } = column.conditionalColoring.segments;
  const { limits } = column.conditionalColoring.segments;
  const { min, max } = getAutoMinMax(limits, value);
  const segmentLimits = limits.map((l) => {
    const limitNormal = max === min ? 0.5 : (l.value - min) / (max - min);
    return { ...l, normal: limitNormal };
  });
  const mag = max - min;
  let t = 1.0;
  let color = 'none';

  const normal = (value - min) / mag;
  const lowerLimit = paletteIndex > 0 ? segmentLimits[paletteIndex - 1] : { normal: 0, value: 0, gradient: false };
  const upperLimit = segmentLimits[paletteIndex]
    ? segmentLimits[paletteIndex]
    : { normal: 1, value: 0, gradient: false };
  const prevColor = paletteColors[paletteIndex - (paletteIndex > 0 ? 1 : 0)];
  const nextColor = paletteColors[paletteIndex + (paletteIndex < paletteColors.length - 1 ? 1 : 0)];
  const normValueInLimits = (normal - lowerLimit.normal) / (upperLimit.normal - lowerLimit.normal);
  if (lowerLimit && lowerLimit.gradient && upperLimit && upperLimit.gradient) {
    // triple gradient
    if (normal - lowerLimit.value < upperLimit.value - normal) {
      // closer to the lower limit
      color = prevColor.color;
      t = 0.5 - normValueInLimits;
    } else {
      color = nextColor.color;
      t = normValueInLimits - 0.5;
    }
  } else if (lowerLimit && lowerLimit.gradient) {
    color = prevColor.color;
    t = 1 - (0.5 + normValueInLimits / 2);
  } else if (upperLimit && upperLimit.gradient) {
    color = nextColor.color;
    t = normValueInLimits / 2;
  } else {
    t = normal;
  }

  return {
    ...paletteColors[paletteIndex],
    color: lerp(paletteColors[paletteIndex].color, color, t),
  };
}

export function getIndicator(column: Column, tableCell: TableCell): PaletteColor | undefined {
  if (column.conditionalColoring && tableCell.qNum && column.conditionalColoring.segments.limits.length > 0) {
    let index = 0;
    const cl = column.conditionalColoring.segments.limits.length;
    while (index < cl && tableCell.qNum > column.conditionalColoring.segments.limits[index].value) {
      index++;
    }
    return getConditionalColor(index, tableCell.qNum, column);
  }
  return undefined;
}
