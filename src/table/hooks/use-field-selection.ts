import { useState, useEffect } from 'react';
import { useContextSelector, TableContext } from '../context';
import { Column, TableLayout } from '../../types';

const SELECTION_ACTIONS_ENABLED_DEFAULT_STATUS: Record<string, boolean> = {
  canSelectAll: false,
  canClearSelections: false,
  canSelectPossible: false,
  canSelectAlternative: false,
  canSelectExcluded: false,
};

export interface UseFieldSelectionOutput {
  fieldInstance: EngineAPI.IField | null;
  selectionActionsEnabledStatus: Record<string, boolean>;
  resetSelectionActionsEnabledStatus: () => void;
  updateSelectionActionsEnabledStatus: (layout: TableLayout) => void;
}

export const checkStateCountByKey = <T>(keys: (keyof T)[], obj: T): boolean => {
  return keys.some((key) => obj[key] > 0);
};

const useFieldSelection = (column: Column): UseFieldSelectionOutput => {
  const isMenuVisible = column.isDim && !column.isMasterItem;
  const { app } = useContextSelector(TableContext, (value) => value.baseProps);
  const [fieldInstance, setFieldInstance] = useState<EngineAPI.IField | null>(null);
  const [selectionActionsEnabledStatus, setSelectionActionsEnabledStatus] = useState(
    SELECTION_ACTIONS_ENABLED_DEFAULT_STATUS
  );

  useEffect(() => {
    if (!app || !column || !isMenuVisible) return;
    app.getField(column.fieldId).then(setFieldInstance);
  }, [app, column, isMenuVisible]);

  const resetSelectionActionsEnabledStatus = () =>
    setSelectionActionsEnabledStatus(SELECTION_ACTIONS_ENABLED_DEFAULT_STATUS);
  const updateSelectionActionsEnabledStatus = (layout: TableLayout) => {
    const dimInfo = layout.qHyperCube.qDimensionInfo.find((dim) => dim.qFallbackTitle === column.label);
    if (!dimInfo) return;
    setSelectionActionsEnabledStatus({
      canSelectAll: checkStateCountByKey(['qOption', 'qAlternative', 'qExcluded', 'qDeselected'], dimInfo.qStateCounts),
      canClearSelections: checkStateCountByKey(['qSelected'], dimInfo.qStateCounts),
      canSelectPossible: checkStateCountByKey(['qOption'], dimInfo.qStateCounts),
      canSelectAlternative: checkStateCountByKey(['qAlternative'], dimInfo.qStateCounts),
      canSelectExcluded: checkStateCountByKey(['qAlternative', 'qExcluded'], dimInfo.qStateCounts),
    });
  };

  return {
    fieldInstance,
    selectionActionsEnabledStatus,
    resetSelectionActionsEnabledStatus,
    updateSelectionActionsEnabledStatus,
  };
};

export default useFieldSelection;
