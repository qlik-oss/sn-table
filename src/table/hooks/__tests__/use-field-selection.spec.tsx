import { act, renderHook, waitFor } from "@testing-library/react";
import React, { ReactNode } from "react";
import TestWithProviders from "../../../__test__/test-with-providers";
import { Column, TableLayout } from "../../../types";
import useFieldSelection from "../use-field-selection";

describe("useFieldSelection()", () => {
  let column: Column;
  let appMock: EngineAPI.IApp;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestWithProviders app={appMock}>{children}</TestWithProviders>
  );
  const getFieldSelectionResult = () => renderHook(() => useFieldSelection(column, true), { wrapper });

  beforeEach(() => {
    column = {
      isDim: true,
      fieldId: "dim#01",
      label: "dim#01",
    } as Column;
    appMock = {
      getField: jest.fn().mockResolvedValue(null),
      createSessionObject: jest.fn().mockResolvedValue({}),
    } as unknown as EngineAPI.IApp;
  });

  it("should return default state", () => {
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

  describe("enabledStates", () => {
    const triggerHook = (qStateCounts: EngineAPI.INxStateCounts, qFallbackTitle = "dim#01") => {
      const { result } = getFieldSelectionResult();
      const mockLayout = {
        qHyperCube: { qDimensionInfo: [{ qFallbackTitle, qStateCounts }] },
      } as TableLayout;
      act(() => result.current.updateSelectionActionsEnabledStatus(mockLayout));
      return result.current.selectionActionsEnabledStatus;
    };

    it("should return if it could not find dim after calling `updateSelectionActionsEnabledStatus` with anything", () => {
      const state = { qOption: 1, qAlternative: 1, qDeselected: 1 } as EngineAPI.INxStateCounts;
      expect(triggerHook(state, "someRandomDim")).toMatchObject({
        canSelectAll: false,
        canClearSelections: false,
        canSelectPossible: false,
        canSelectAlternative: false,
        canSelectExcluded: false,
      });
      expect(appMock.getField).toHaveBeenCalled();
    });

    it("should create session object when master dimension", async () => {
      const state = { qOption: 1 } as EngineAPI.INxStateCounts;
      column.qLibraryId = "fakeLibraryId";
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: true,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
      expect(appMock.createSessionObject).toHaveBeenCalled();
    });

    it("`canSelectAll` and `canSelectPossible` and should be true after calling `updateSelectionActionsEnabledStatus` with `qOptions`", async () => {
      const state = { qOption: 1 } as EngineAPI.INxStateCounts;
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: true,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it("`canSelectAll`, `canSelectAlternative` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qAlternative`", async () => {
      const state = { qAlternative: 1 } as EngineAPI.INxStateCounts;
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: true,
          canSelectExcluded: true,
        });
      });
    });

    it("`canSelectAll` should be true after calling `updateSelectionActionsEnabledStatus` with `qDeselected`", async () => {
      const state = { qDeselected: 1 } as EngineAPI.INxStateCounts;
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it("`canClearSelections` should be true after calling `updateSelectionActionsEnabledStatus` with `qSelected`", async () => {
      const state = { qSelected: 1 } as EngineAPI.INxStateCounts;
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: false,
          canClearSelections: true,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it("`canSelectAll` and `canSelectPossible` should be true after calling `updateSelectionActionsEnabledStatus` with `qOption`", async () => {
      const state = { qOption: 1 } as EngineAPI.INxStateCounts;
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: true,
          canSelectAlternative: false,
          canSelectExcluded: false,
        });
      });
    });

    it("`canSelectAll`, `canSelectAlternative` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qAlternative`2", async () => {
      const state = { qAlternative: 1 } as EngineAPI.INxStateCounts;
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: true,
          canSelectExcluded: true,
        });
      });
    });

    it("`canSelectAll` and `canSelectExcluded` should be true after calling `updateSelectionActionsEnabledStatus` with `qExcluded`", async () => {
      const state = { qExcluded: 1 } as EngineAPI.INxStateCounts;
      await waitFor(() => {
        expect(triggerHook(state)).toMatchObject({
          canSelectAll: true,
          canClearSelections: false,
          canSelectPossible: false,
          canSelectAlternative: false,
          canSelectExcluded: true,
        });
      });
    });

    it("should reset state after calling `resetSelectionActionsEnabledStatus`", async () => {
      const { result } = getFieldSelectionResult();
      const mockLayout = {
        qHyperCube: {
          qDimensionInfo: [{ qFallbackTitle: "dim#01", qStateCounts: { qExcluded: 1 } }],
        },
      } as TableLayout;
      act(() => result.current.updateSelectionActionsEnabledStatus(mockLayout));

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
