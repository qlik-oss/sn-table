import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { useContextSelector } from '../index';
import TestWithProviders from '../../../__test__/test-with-providers';
import { TableContext } from '../TableContext';
import { PageInfo } from '../../../types';
import { Selector } from '../useContextSelector';
import { ContextValue } from '../../types';

type HookWrapperProps = { children: JSX.Element };

const TestComponent = (): JSX.Element => {
  const pageInfo = useContextSelector(TableContext, (value) => value.pageInfo);
  return <div>{pageInfo?.page}</div>;
};

describe('useContextSelector', () => {
  let wrapper: ({ children }: HookWrapperProps) => JSX.Element;
  let pageInfo: PageInfo;

  beforeEach(() => {
    pageInfo = {
      page: 0,
      rowsPerPage: 100,
      rowsPerPageOptions: [],
    };

    wrapper = ({ children }: HookWrapperProps) => <TestWithProviders pageInfo={pageInfo}>{children}</TestWithProviders>;
  });

  test('should resolve state immediately', () => {
    const { result } = renderHook(() => useContextSelector(TableContext, (value) => value.pageInfo), { wrapper });

    expect(result.current?.page).toEqual(0);
  });

  test('should resolve updated state', async () => {
    const { result, rerender } = renderHook(
      (props: Selector<ContextValue, PageInfo | undefined>) => useContextSelector(TableContext, props),
      {
        initialProps: (value) => value.pageInfo,
        wrapper,
      }
    );

    expect(result.current?.page).toEqual(0);

    pageInfo = { ...pageInfo, page: 1 };
    rerender((value) => value.pageInfo);

    expect(result.current?.page).toEqual(1);
  });

  test('should work as part of a component', () => {
    const { rerender } = render(
      <TestWithProviders pageInfo={pageInfo}>
        <TestComponent />
      </TestWithProviders>
    );

    expect(screen.getByText('0')).toBeVisible();

    pageInfo = { ...pageInfo, page: 1 };
    rerender(
      <TestWithProviders pageInfo={pageInfo}>
        <TestComponent />
      </TestWithProviders>
    );

    expect(screen.getByText('1')).toBeVisible();
  });
});
