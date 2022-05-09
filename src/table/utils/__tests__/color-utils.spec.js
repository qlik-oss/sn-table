import { isDarkColor } from '../color-utils';

describe('color-utils', () => {
  describe('isDarkColor', () => {
    let color = 'black';

    it('should be false when the color is a color term', () => {
      const result = isDarkColor(color);
      expect(result).toBe(false);
    });
    it('should be false when the color is another color term', () => {
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
});
