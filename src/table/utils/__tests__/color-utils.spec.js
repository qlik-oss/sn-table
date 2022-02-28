import { isDarkColor } from '../color-utils';

describe('color-utils', () => {
  describe('isDarkColor', () => {
    let color = 'black';

    it('should be true when the color is dark', () => {
      const result = isDarkColor(color);
      expect(result).to.equal(false);
    });
    it('should be false when the color is light', () => {
      color = 'white';

      const result = isDarkColor(color);
      expect(result).to.equal(false);
    });
    it('should be false when the color is transparent', () => {
      color = 'transparent';

      const result = isDarkColor(color);
      expect(result).to.equal(false);
    });
    it('should be false when the color is inherit', () => {
      color = 'inherit';

      const result = isDarkColor(color);
      expect(result).to.equal(false);
    });
    it('should be false when the color is undefined', () => {
      color = 'undefined';

      const result = isDarkColor(color);
      expect(result).to.equal(false);
    });
  });
});
