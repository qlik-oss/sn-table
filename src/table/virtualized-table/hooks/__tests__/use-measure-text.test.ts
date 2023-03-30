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

      expect(result.current.estimateLineCount({ text: '12345', maxWidth: 5 })).toBe(1);
    });

    test('should get line count for two lines of text', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount({ text: '123456', maxWidth: 3 })).toBe(2);
    });

    test('should get line count for three lines of text', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount({ text: '123456789', maxWidth: 3 })).toBe(3);
    });

    test('should get limited line count when actual line count exceeds max line count', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount({ text: '1234567', maxWidth: 2 })).toBe(3);
      expect(result.current.estimateLineCount({ text: '123456789ABCDEF', maxWidth: 2 })).toBe(3);
    });

    test('should handle empty strings', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount({ text: '', maxWidth: 5 })).toBe(1);
    });

    test('should handle too short max width', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount({ text: '1', maxWidth: 0.5 })).toBe(1);
      expect(result.current.estimateLineCount({ text: '12', maxWidth: 0.5 })).toBe(3);
      expect(result.current.estimateLineCount({ text: '123', maxWidth: 0.5 })).toBe(3);
    });

    test('should get line count when text is shorten then max width', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount({ text: '1', maxWidth: 5 })).toBe(1);
    });

    test('should not line break numeric cells', () => {
      const { result } = renderHook(() => useMeasureText('13px', 'font'));

      expect(result.current.estimateLineCount({ text: '123', maxWidth: 1, isNumeric: true })).toBe(1);
    });
  });
});
