import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Column, TableLayout } from '../../../types';
import useFieldSelection from '../use-field-selection';
import TestWithProviders from '../../../__test__/test-with-providers';

describe('useFieldSelection()', () => {
  let column: Column;
  let appMock: EngineAPI.IApp;

  const wrapper = ({ children }: any) => <TestWithProviders app={appMock}>{children}</TestWithProviders>;
  const getFieldSelectionResult = () => renderHook(() => useFieldSelection(column), { wrapper });

  beforeEach(() => {
    column = {
      isDim: true,
      isMasterItem: false,
      fieldId: 'dim#01',
      label: 'dim#01',
    } as Column;
    appMock = {
      getField: jest.fn().mockResolvedValue(null),
    } as unknown as EngineAPI.IApp;
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
    const triggerHook = (qStateCounts: EngineAPI.INxStateCounts, qFallbackTitle: string = 'dim#01') => {
      const { result } = getFieldSelectionResult();
      const mockLayout = {
        qHyperCube: { qDimensionInfo: [{ qFallbackTitle, qStateCounts }] },
      } as TableLayout;
      act(() => result.current.updateSelectionActionsEnabledStatus(mockLayout));
      return result.current.selectionActionsEnabledStatus;
    };

    it('should return if it could not find dim after calling `updateSelectionActionsEnabledStatus` with anything', () => {
      const state = { qOption: 1, qAlternative: 1, qDeselected: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state, 'someRandomDim')).toMatchObject({
        canSelectAll: false,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: false,
      });
    });

    it('`canSelectAll` and `canSelectPossible` and should be true after calling `updateSelectionActionsEnabledStatus` with `qOptions`', () => {
      const state = { qOption: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state)).toMatchObject({
        canSelectAll: true,
        canClearSelections: false,
        canSelectPossible: true,
        canSelectAlternative: false,
        canSelectExcluded: false,
      });
    });

    it('`canSelectAll`, `canSelectAlternative` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qAlternative`', () => {
      const state = { qAlternative: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state)).toMatchObject({
        canSelectAll: true,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: true,
        canSelectExcluded: true,
      });
    });

    it('`canSelectAll` should be true after calling `updateSelectionActionsEnabledStatus` with `qDeselected`', () => {
      const state = { qDeselected: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state)).toMatchObject({
        canSelectAll: true,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: false,
      });
    });

    it('`canClearSelections` should be true after calling `updateSelectionActionsEnabledStatus` with `qSelected`', () => {
      const state = { qSelected: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state)).toMatchObject({
        canSelectAll: false,
        canClearSelections: true,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: false,
      });
    });

    it('`canSelectAll` and `canSelectPossible` should be true after calling `updateSelectionActionsEnabledStatus` with `qOption`', () => {
      const state = { qOption: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state)).toMatchObject({
        canSelectAll: true,
        canClearSelections: false,
        canSelectPossible: true,
        canSelectAlternative: false,
        canSelectExcluded: false,
      });
    });

    it('`canSelectAll`, `canSelectAlternative` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qAlternative`', () => {
      const state = { qAlternative: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state)).toMatchObject({
        canSelectAll: true,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: true,
        canSelectExcluded: true,
      });
    });

    it('`canSelectAll` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qExcluded`', () => {
      const state = { qExcluded: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state)).toMatchObject({
        canSelectAll: true,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: true,
      });
    });

    it('shoud reset state after calling `resetSelectionActionsEnabledStatus`', () => {
      const { result } = getFieldSelectionResult();
      const mockLayout = {
        qHyperCube: {
          qDimensionInfo: [{ qFallbackTitle: 'dim#01', qStateCounts: { qExcluded: 1 } }],
        },
      } as TableLayout;
      act(() => result.current.updateSelectionActionsEnabledStatus(mockLayout));
      expect(result.current.selectionActionsEnabledStatus).toMatchObject({
        canSelectAll: true,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: true,
      });

      act(() => result.current.resetSelectionActionsEnabledStatus());
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
