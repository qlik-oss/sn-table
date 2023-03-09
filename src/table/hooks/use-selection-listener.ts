import { stardust } from '@nebula.js/stardust';
import { useEffect } from 'react';
import { ExtendedSelectionAPI } from '../../types';
import { SelectionActions } from '../constants';
import { SelectionDispatch } from '../types';

interface UseSelectionListenerProps {
  selectionsAPI: ExtendedSelectionAPI;
  selectionDispatch: SelectionDispatch;
  setShouldRefocus(): void;
  keyboard: stardust.Keyboard;
  tableWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  tableContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const useSelectionListener = ({
  selectionsAPI,
  selectionDispatch,
  setShouldRefocus,
  keyboard,
  tableWrapperRef,
  tableContainerRef,
}: UseSelectionListenerProps) => {
  useEffect(() => {
    const resetSelections = () => {
      selectionDispatch({ type: SelectionActions.RESET });
    };
    const clearSelections = () => {
      selectionDispatch({ type: SelectionActions.CLEAR });
    };
    const resetSelectionsAndSetupRefocus = () => {
      tableContainerRef?.current?.scrollTo(0, 0);
      if (tableWrapperRef.current?.contains(document.activeElement)) {
        // if there is a focus in the chart,
        // set shouldRefocus so that you should either
        // focus or just set the tabstop, after data has reloaded.
        setShouldRefocus();
      } else if (keyboard.enabled) {
        // if there is no focus on the chart,
        // make sure you blur the table
        // and focus the entire chart (table's parent element)
        // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
        keyboard.blur?.(true);
      }
      resetSelections();
    };

    selectionsAPI.on('deactivated', resetSelections);
    selectionsAPI.on('canceled', resetSelections);
    selectionsAPI.on('confirmed', resetSelectionsAndSetupRefocus);
    selectionsAPI.on('cleared', clearSelections);
    // Return function called on unmount
    return () => {
      selectionsAPI.removeListener('deactivated', resetSelections);
      selectionsAPI.removeListener('canceled', resetSelections);
      selectionsAPI.removeListener('confirmed', resetSelectionsAndSetupRefocus);
      selectionsAPI.removeListener('cleared', clearSelections);
    };
  }, [selectionsAPI, keyboard, selectionDispatch, setShouldRefocus, tableContainerRef, tableWrapperRef]);
};

export default useSelectionListener;
