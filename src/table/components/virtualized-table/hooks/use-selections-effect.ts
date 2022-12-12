import { stardust } from '@nebula.js/stardust';
import { useEffect } from 'react';
import { ExtendedSelectionAPI, Row } from '../../../../types';
import { SelectionActions } from '../../../constants';
import { TableContext, useContextSelector } from '../../../context';
import { addSelectionListeners } from '../../../utils/selections-utils';

export default function useSelectionsEffect(selectionsAPI: ExtendedSelectionAPI, rowsInPage: Row[]) {
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

  useEffect(() => {
    selectionDispatch({ type: SelectionActions.UPDATE_PAGE_ROWS, payload: { pageRows: rowsInPage } });
  }, [selectionDispatch, rowsInPage]);

  useEffect(() => {
    return addSelectionListeners({
      api: selectionsAPI,
      selectionDispatch,
      setShouldRefocus: () => {}, // TODO No focus support
      keyboard: { enabled: false } as stardust.Keyboard, // TODO No keyboard navigation support
      tableWrapperRef: { current: undefined }, // TODO No focus support
    });
  }, [selectionsAPI, selectionDispatch]);
}
