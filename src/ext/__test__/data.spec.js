import { indexAdded, indexRemoved, min, getDescription } from '../data';

describe('data', () => {
  const mockFlags = {
    PS_18291_TABLE_EXPLORATION: true,
  };
  const env = {
    translator: {
      get: jest.fn(),
    },
    flags: {
      isEnabled: (flag) => mockFlags[flag],
    },
  };
  let array;
  let index;

  describe('indexAdded', () => {
    it('should add index in the end of array', () => {
      array = [0, 1];
      index = 2;

      indexAdded(array, index);
      expect(array).toEqual([0, 1, 2]);
    });

    it('should add index in the end of array and increment elements that are >= index', () => {
      array = [1, 0, 2];
      index = 1;

      indexAdded(array, index);
      expect(array).toEqual([2, 0, 3, 1]);
    });
  });

  describe('indexRemoved', () => {
    it('should remove index from the array', () => {
      array = [0, 2, 1];
      index = 2;

      indexRemoved(array, index);
      expect(array).toEqual([0, 1]);
    });

    it('should remove index the array and decrement', () => {
      array = [1, 2, 0, 3];
      index = 2;

      indexRemoved(array, index);
      expect(array).toEqual([1, 0, 2]);
    });
  });

  describe('min', () => {
    it('should return 0 when > 0', () => {
      expect(min(3)).toBe(0);
    });

    it('should return 1 when not > 0', () => {
      expect(min(0)).toBe(1);
    });
  });

  describe('description', () => {
    it('should call translator', () => {
      getDescription(env);
      expect(env.translator.get).toHaveBeenCalledWith('Visualizations.Descriptions.Column');
    });
  });
});
