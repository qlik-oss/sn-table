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

  describe('estimateLineCount', () => {
    test('should get line count for a single line of text', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount('12345', 5, false)).toBe(1);
    });

    test('should get line count for two lines of text', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount('123456', 3, false)).toBe(2);
    });

    test('should get line count for three lines of text', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount('123456789', 3, false)).toBe(3);
    });

    test('should get limited line count when actual line count exceeds max line count', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount('1234567', 2, false)).toBe(3);
    });

    test('should handle empty strings', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount('', 5, false)).toBe(1);
    });

    test('should handle too short max width', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount('1', 0.5, false)).toBe(2);
      expect(result.current.estimateLineCount('12', 0.5, false)).toBe(3);
      expect(result.current.estimateLineCount('123', 0.5, false)).toBe(3);
    });
  });
});
