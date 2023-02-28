import { renderHook } from '@testing-library/react';
import useMeasureText from '../use-measure-text';

describe('useMeasureText', () => {
  describe('estimateWidth', () => {
    test('should estimate width', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateWidth(2)).toBe(2);
    });
  });

  describe('measureText', () => {
    test('should measure width', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.measureText('some string')).toBe(11);
    });
  });
});
