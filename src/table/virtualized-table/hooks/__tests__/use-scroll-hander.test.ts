import { renderHook } from '@testing-library/react';
import { VariableSizeList } from 'react-window';
import { BodyRef } from '../../types';
import useScrollHandler from '../use-scroll-handler';

describe('useScrollHandler', () => {
  let headerRef: React.RefObject<VariableSizeList<any>>;
  let bodyRef: React.RefObject<BodyRef>;
  let totalsRef: React.RefObject<VariableSizeList<any>>;
  let listInstance: VariableSizeList;
  let listTotalsInstance: VariableSizeList;
  let refHandler: BodyRef;

  beforeEach(() => {
    listInstance = { scrollTo: () => {} } as unknown as VariableSizeList;
    listTotalsInstance = { scrollTo: () => {} } as unknown as VariableSizeList;
    refHandler = { interpolatedScrollTo: () => {}, resizeCells: () => {} } as BodyRef;

    headerRef = { current: listInstance };
    totalsRef = { current: listTotalsInstance };
    bodyRef = { current: refHandler };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should scroll body, header and totals', () => {
    const headerScrollToSpy = jest.spyOn(listInstance, 'scrollTo');
    const totalsScrollToSpy = jest.spyOn(listTotalsInstance, 'scrollTo');
    const bodyScrollToSpy = jest.spyOn(refHandler, 'interpolatedScrollTo');

    const { result } = renderHook(() => useScrollHandler(headerRef, totalsRef, bodyRef));

    const event = {
      currentTarget: { scrollLeft: 1, scrollTop: 5, scrollHeight: 20, clientHeight: 10 },
    } as unknown as React.SyntheticEvent;

    result.current(event);

    expect(headerScrollToSpy).toHaveBeenCalledWith(event.currentTarget.scrollLeft);
    expect(totalsScrollToSpy).toHaveBeenCalledWith(event.currentTarget.scrollLeft);
    expect(bodyScrollToSpy).toHaveBeenCalledWith(0.5, event.currentTarget.scrollLeft);
  });
});
