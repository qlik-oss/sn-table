import { getIndicator, lerp, getConditionalColor } from '../conditional-colors';

describe('conditional-coloring', () => {
  it('lerps', () => {
    let result = lerp('#ff0000', '#00ff00', 0.5);
    expect(result).toBe('#7f7f00');

    result = lerp('#0f0000', '#00ff00', 0.5);
    expect(result).toBe('#077f00');
  });

  it('gets gradient color', () => {
    const segment = {
      limits: [
        { gradient: true, value: 100, normal: 1 },
        { gradient: true, value: 200, normal: 1 },
      ],
      paletteColors: [
        { color: '#FF0000', icon: 'S', index: 7 },
        { color: '#00FF00', icon: 'S', index: 7 },
        { color: '#0000FF', icon: 'S', index: 7 },
      ],
    };
    const column = {
      conditionalColoring: { segments: segment },
      qMin: 0,
      qMax: 300,
    };
    let color = getConditionalColor(0, 50, column);
    expect(color.color).toBe('#bf3f00');

    color = getConditionalColor(1, 150, column);
    expect(color.color).toBe('#00ff00');

    color = getConditionalColor(2, 250, column);
    expect(color.color).toBe('#003fbf');
  });

  it('gets non color', () => {
    const segment = {
      limits: [
        { gradient: false, value: 100, normal: 1 },
        { gradient: false, value: 200, normal: 1 },
      ],
      paletteColors: [
        { color: '#FF0000', icon: 'S', index: 7 },
        { color: '#00FF00', icon: 'S', index: 7 },
        { color: '#0000FF', icon: 'S', index: 7 },
      ],
    };
    const column = {
      conditionalColoring: { segments: segment },
      qMin: 0,
      qMax: 300,
    };
    // let bounds = getLimitBounds(0, column);
    let color = getConditionalColor(0, 50, column);
    expect(color.color).toBe('#FF0000');

    color = getConditionalColor(1, 150, column);
    expect(color.color).toBe('#00FF00');

    color = getConditionalColor(2, 250, column);
    expect(color.color).toBe('#0000FF');
  });
});
