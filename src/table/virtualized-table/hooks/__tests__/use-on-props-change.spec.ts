import { renderHook } from '@testing-library/react';
import useOnPropsChange from '../use-on-props-change';

type RenderHookProps = [() => void, unknown[]];

describe('useOnPropsChange', () => {
  test('should run callback function when a reference dependency changes', () => {
    const callback = jest.fn();
    const fakeLayout = { qHyperCube: { qSize: { qcy: 1 } } };

    const { rerender } = renderHook((props: RenderHookProps) => useOnPropsChange(...props), {
      initialProps: [callback, [fakeLayout]],
    });

    expect(callback).not.toHaveBeenCalled();

    rerender([callback, [{ ...fakeLayout }]]);

    expect(callback).toHaveBeenCalled();
  });

  test('should run callback function when a primitive dependency changes', () => {
    const callback = jest.fn();
    const { rerender } = renderHook((props: RenderHookProps) => useOnPropsChange(...props), {
      initialProps: [callback, [1]],
    });

    expect(callback).not.toHaveBeenCalled();

    rerender([callback, [2]]);

    expect(callback).toHaveBeenCalled();
  });

  test('should not run callback function when a reference dependency does not change changes', () => {
    const callback = jest.fn();
    const fakeLayout = { qHyperCube: { qSize: { qcy: 1 } } };

    const { rerender } = renderHook((props: RenderHookProps) => useOnPropsChange(...props), {
      initialProps: [callback, [fakeLayout]],
    });

    expect(callback).not.toHaveBeenCalled();

    rerender([callback, [fakeLayout]]);

    expect(callback).not.toHaveBeenCalled();
  });

  test('should not run callback function when a primitive dependency does not change changes', () => {
    const callback = jest.fn();

    const { rerender } = renderHook((props: RenderHookProps) => useOnPropsChange(...props), {
      initialProps: [callback, [1]],
    });

    expect(callback).not.toHaveBeenCalled();

    rerender([callback, [1]]);

    expect(callback).not.toHaveBeenCalled();
  });
});
