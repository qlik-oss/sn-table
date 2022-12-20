import { renderHook } from '@testing-library/react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import useScrollHandler from '../use-scroll-handler';

describe('useScrollHandler', () => {
  let headerRef: React.RefObject<VariableSizeList<any>>;
  let bodyRef: React.RefObject<VariableSizeGrid<any>>;
  let totalsRef: React.RefObject<VariableSizeList<any>>;
  let innerForwardRef: React.RefObject<HTMLDivElement>;
  let totalHeight: number;
  let shrinkBodyHeightBy: number;
  let setTotalHeight: React.Dispatch<React.SetStateAction<number>>;
  let listInstance: VariableSizeList;
  let listTotalsInstance: VariableSizeList;
  let gridInstance: VariableSizeGrid;

  beforeEach(() => {
    listInstance = { scrollTo: () => {} } as unknown as VariableSizeList;
    listTotalsInstance = { scrollTo: () => {} } as unknown as VariableSizeList;
    gridInstance = { scrollTo: () => {} } as unknown as VariableSizeGrid;

    headerRef = { current: listInstance };
    totalsRef = { current: listTotalsInstance };
    bodyRef = { current: gridInstance };

    innerForwardRef = {
      current: { clientHeight: 250 } as unknown as HTMLDivElement,
    };

    totalHeight = 250;

    shrinkBodyHeightBy = 10;

    setTotalHeight = jest.fn(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should scroll body and header', () => {
    const headerScrollToSpy = jest.spyOn(listInstance, 'scrollTo');
    const totalsScrollToSpy = jest.spyOn(listTotalsInstance, 'scrollTo');
    const bodyScrollToSpy = jest.spyOn(gridInstance, 'scrollTo');

    const { result } = renderHook(() =>
      useScrollHandler(headerRef, totalsRef, bodyRef, innerForwardRef, totalHeight, shrinkBodyHeightBy, setTotalHeight)
    );

    const event = {
      currentTarget: { scrollLeft: 1, scrollTop: 2 },
    } as unknown as React.SyntheticEvent;

    result.current(event);

    expect(headerScrollToSpy).toHaveBeenCalledWith(event.currentTarget.scrollLeft);
    expect(totalsScrollToSpy).toHaveBeenCalledWith(event.currentTarget.scrollLeft);
    expect(bodyScrollToSpy).toHaveBeenCalledWith({
      ...event.currentTarget,
    });
  });

  test('should keep full size container in sync with the height calculation in react-window is doing ', () => {
    innerForwardRef = {
      current: { clientHeight: 500 } as unknown as HTMLDivElement,
    };

    const { result } = renderHook(() =>
      useScrollHandler(headerRef, totalsRef, bodyRef, innerForwardRef, totalHeight, shrinkBodyHeightBy, setTotalHeight)
    );

    const event = {
      currentTarget: { scrollLeft: 1, scrollTop: 2 },
    } as unknown as React.SyntheticEvent;

    result.current(event);

    expect(setTotalHeight).toHaveBeenCalledWith((innerForwardRef.current?.clientHeight as number) + shrinkBodyHeightBy);
  });
});
