import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { Column, TableLayout } from '../../../types';
import useFieldSelection from '../use-field-selection';
import TestWithProviders from '../../../__test__/test-with-providers';

describe('useFieldSelection()', () => {
  let column: Column;
  let appMock: EngineAPI.IApp;
  let layoutMock: TableLayout;

  const wrapper = ({ children }: any) => (
    <TestWithProviders app={appMock} layout={layoutMock}>
      {children}
    </TestWithProviders>
  );
  const getFieldSelectionResult = () => renderHook(() => useFieldSelection(column), { wrapper });
  const setMockLayout = (qStateCounts: EngineAPI.INxStateCounts, qFallbackTitle: string = 'dim#01') => {
    layoutMock = { qHyperCube: { qDimensionInfo: [{ qStateCounts, qFallbackTitle }] } } as TableLayout;
  };
  beforeEach(() => {
    column = {
      isDim: true,
      fieldId: 'dim#01',
      label: 'dim#01',
    } as Column;
    appMock = {
      getField: jest.fn().mockResolvedValue(null),
    } as unknown as EngineAPI.IApp;
    setMockLayout({ qOption: 1, qAlternative: 1, qDeselected: 1 } as EngineAPI.INxStateCounts);
  });

  it('should return default state', () => {
    const {
      result: { current: output },
    } = getFieldSelectionResult();

    expect(output).toMatchObject({
      fieldInstance: null,
      selectionActionsEnabledStatus: {
        canSelectAll: false,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: false,
      },
      resetSelectionActionsEnabledStatus: expect.any(Function),
      updateSelectionActionsEnabledStatus: expect.any(Function),
    });
  });

  describe('enabledStates', () => {
    const triggerHook = () => {
      const { result } = getFieldSelectionResult();
      act(() => result.current.updateSelectionActionsEnabledStatus());
      return result.current.selectionActionsEnabledStatus;
    };

    it('should return if it could not find dim after calling `updateSelectionActionsEnabledStatus` with anything', () => {
      setMockLayout({ qOption: 1, qAlternative: 1, qDeselected: 1 } as EngineAPI.INxStateCounts, 'randomDim');
      expect(triggerHook()).toMatchObject({
        canSelectAll: false,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: false,
      });
    });

    it('`canSelectAll` and `canSelectPossible` and should be true after calling `updateSelectionActionsEnabledStatus` with `qOptions`', async () => {
      setMockLayout({ qOption: 1 } as EngineAPI.INxStateCounts);
      await waitFor(() => {
        expect(triggerHook()).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: true,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it('`canSelectAll`, `canSelectAlternative` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qAlternative`', async () => {
      await waitFor(() => {
        setMockLayout({ qAlternative: 1 } as EngineAPI.INxStateCounts);
        expect(triggerHook()).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: true,
          canSelectExcluded: true,
        });
      });
    });

    it('`canSelectAll` should be true after calling `updateSelectionActionsEnabledStatus` with `qDeselected`', async () => {
      await waitFor(() => {
        setMockLayout({ qDeselected: 1 } as EngineAPI.INxStateCounts);
        expect(triggerHook()).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it('`canClearSelections` should be true after calling `updateSelectionActionsEnabledStatus` with `qSelected`', async () => {
      await waitFor(() => {
        setMockLayout({ qSelected: 1 } as EngineAPI.INxStateCounts);
        expect(triggerHook()).toMatchObject({
          canSelectAll: false,
          canClearSelections: true,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it('`canSelectAll` and `canSelectPossible` should be true after calling `updateSelectionActionsEnabledStatus` with `qOption`', async () => {
      await waitFor(() => {
        setMockLayout({ qOption: 1 } as EngineAPI.INxStateCounts);
        expect(triggerHook()).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: true,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it('`canSelectAll`, `canSelectAlternative` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qAlternative`', async () => {
      await waitFor(() => {
        setMockLayout({ qAlternative: 1 } as EngineAPI.INxStateCounts);
        expect(triggerHook()).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: true,
          canSelectExcluded: true,
        });
      });
    });

    it('`canSelectAll` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qExcluded`', async () => {
      await waitFor(() => {
        setMockLayout({ qExcluded: 1 } as EngineAPI.INxStateCounts);
        expect(triggerHook()).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: true,
        });
      });
    });

    it('shoud reset state after calling `resetSelectionActionsEnabledStatus`', async () => {
      setMockLayout({ qExcluded: 1 } as EngineAPI.INxStateCounts);
      const { result } = getFieldSelectionResult();
      act(() => result.current.updateSelectionActionsEnabledStatus());
      await waitFor(() => {
        expect(result.current.selectionActionsEnabledStatus).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: true,
        });
      });

      act(() => result.current.resetSelectionActionsEnabledStatus());

      await waitFor(() => {
        expect(result.current.selectionActionsEnabledStatus).toMatchObject({
          canSelectAll: false,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });
  });
});
