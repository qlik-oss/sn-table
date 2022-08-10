import { resolveToRGBAorRGB, isDarkColor, isTransparentColor, removeOpacity } from '../color-utils';

describe('color-utils', () => {
  describe('resolveToRGBAorRGB', () => {
    let color = '#fff';

    it('should resolve a hex color to rgb', () => {
      let result = resolveToRGBAorRGB(color);
      expect(result).toBe('rgb(255,255,255)');

      color = '#4f4f4f';

      result = resolveToRGBAorRGB(color);
      expect(result).toBe('rgb(79,79,79)');

      color = '#3f4g5p';

      result = resolveToRGBAorRGB(color);
      expect(result).toBe('none');
    });
    it('should resolve a hex color term to rgba', () => {
      color = '#00000000';

      let result = resolveToRGBAorRGB(color);
      expect(result).toBe('rgba(0,0,0,0)');

      color = '#3240';

      result = resolveToRGBAorRGB(color);
      expect(result).toBe('rgba(51,34,68,0)');

      color = '#11111100';

      result = resolveToRGBAorRGB(color);
      expect(result).toBe('rgba(17,17,17,0)');
    });
    it('should resolve a color term to rgb', () => {
      color = 'red';

      const result = resolveToRGBAorRGB(color);
      expect(result).toBe('rgb(255,0,0)');
    });
    it('should return to rgba when color is the transparent term', () => {
      color = 'transparent';

      const result = resolveToRGBAorRGB(color);
      expect(result).toBe('rgba(255,255,255,0)');
    });
    it('should return none when invalid color', () => {
      const result = resolveToRGBAorRGB('invalid');
      expect(result).toBe('none');
    });
  });

  describe('isDarkColor', () => {
    let color = 'black';

    it('should be true when the the color term is a dark color', () => {
      const result = isDarkColor(color);
      expect(result).toBe(true);
    });
    it('should be false when the color term is a light color', () => {
      color = 'white';

      const result = isDarkColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the color is transparent', () => {
      color = 'transparent';

      const result = isDarkColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the color is inherit', () => {
      color = 'inherit';

      const result = isDarkColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the color is undefined', () => {
      color = 'undefined';

      const result = isDarkColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the color is a light color in hex code', () => {
      color = '#ffffff';

      const result = isDarkColor(color);
      expect(result).toBe(false);
    });
    it('should be true when the color is a dark color in hex code', () => {
      color = '#000000';

      const result = isDarkColor(color);
      expect(result).toBe(true);
    });
    it('should be false when the color is a light color in rgb', () => {
      color = 'rgba(255, 255, 255)';

      const result = isDarkColor(color);
      expect(result).toBe(false);
    });

    it('should be false when the color is a light color in rgba - case 2', () => {
      color = 'rgba(0, 0, 0, 0.1)';

      const result = isDarkColor(color);
      expect(result).toBe(true);
    });
    it('should be true when the color is a dark color in rgb', () => {
      color = 'rgb(0, 0, 0)';

      const result = isDarkColor(color);
      expect(result).toBe(true);
    });
    it('should be true when the color is a dark color in rgba', () => {
      color = 'rgba(0, 0, 0, 0.9)';

      const result = isDarkColor(color);
      expect(result).toBe(true);
    });
    it('should be true when the color is a transparent color in rgba', () => {
      color = 'rgba(0, 0, 0, 0)';

      const result = isDarkColor(color);
      expect(result).toBe(true);
    });
  });

  describe('isTransparentColor', () => {
    it('should be false when the the color is a color term', () => {
      const color = 'black';
      const result = isTransparentColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the the color is opaque in rgba', () => {
      const color = 'rgba(0, 0, 0, 0.9)';

      const result = isTransparentColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the the color is opaque in rgb', () => {
      const color = 'rgb(0, 0, 0)';

      const result = isTransparentColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the the color is opaque in hex', () => {
      const color = '#000000';

      const result = isTransparentColor(color);
      expect(result).toBe(false);
    });

    it('should be false when color is undefined', () => {
      const result = isTransparentColor(undefined);
      expect(result).toBe(false);
    });
    it('should be true when the color is transparent in rgba', () => {
      const color = 'rgba(0, 0, 0, 0)';

      const result = isTransparentColor(color);
      expect(result).toBe(true);
    });
    it('should be true when the color is transparent in hex', () => {
      const color = '#00000000';

      const result = isTransparentColor(color);
      expect(result).toBe(true);
    });
    it('should be true when the color is transparent', () => {
      const color = 'transparent';

      const result = isTransparentColor(color);
      expect(result).toBe(true);
    });
  });

  describe('removeOpacity', () => {
    it('should remove the opacity from a color', () => {
      const color = 'rgba(0, 0, 0, 0.9)';

      const result = removeOpacity(color);
      expect(result).toBe('rgb(0,0,0)');
    });
    it('should remove the opacity from a transparent color term', () => {
      const color = 'transparent';

      const result = removeOpacity(color);
      expect(result).toBe('rgb(255,255,255)');
    });
    it('should remove the opacity from a transparent color in hex', () => {
      const color = '#00000000';

      const result = removeOpacity(color);
      expect(result).toBe('rgb(0,0,0)');
    });
    it('should return undefined when color is undefined', () => {
      const result = removeOpacity(undefined);
      expect(result).toBe(undefined);
    });
  });
});
