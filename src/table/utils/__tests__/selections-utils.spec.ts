import { stardust } from '@nebula.js/stardust';
import {
  addSelectionListeners,
  reducer,
  announceSelectionStatus,
  getSelectedRows,
  getCellSelectionState,
  getMultiSelectedRows,
} from '../selections-utils';
import { Cell, ExtendedSelectionAPI, Announce, Row } from '../../../types';
import {
  SelectionState,
  SelectMultiEndAction,
  SelectAction,
  ResetAction,
  ClearAction,
  UpdateAllRowsAction,
  SelectMouseDownAction,
  SelectMultiAddAction,
} from '../../types';
import { SelectionStates, SelectionActions, KeyCodes } from '../../constants';
import { createCell, createAllRows } from '../../../__test__/generate-test-data';

describe('selections-utils', () => {
  describe('addSelectionListeners', () => {
    const listenerNames = ['deactivated', 'canceled', 'confirmed', 'cleared'];
    let api: ExtendedSelectionAPI;
    let selectionDispatch: jest.Mock<any, any>;
    let setShouldRefocus: jest.Mock<any, any>;
    let keyboard: stardust.Keyboard;
    let containsActiveElement: boolean;
    let tableWrapperRef: React.MutableRefObject<HTMLDivElement>;

    beforeEach(() => {
      selectionDispatch = jest.fn();
      setShouldRefocus = jest.fn();
      api = {
        on: jest.fn(),
        removeListener: jest.fn(),
      } as unknown as ExtendedSelectionAPI;
      keyboard = { enabled: true, active: false, blur: jest.fn(), focus: jest.fn(), focusSelection: jest.fn() };

      containsActiveElement = true;
      tableWrapperRef = {
        current: {
          contains: () => containsActiveElement,
        },
      } as unknown as React.MutableRefObject<HTMLDivElement>;
    });

    afterEach(() => jest.clearAllMocks());

    it('should call api.on and api removeListener for all listeners', () => {
      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef })?.();

      listenerNames.forEach((name, index) => {
        expect(api.on).toHaveBeenNthCalledWith(index + 1, name, expect.anything());
      });
    });
    it('should call api.on with the same callback for all listener names, that calls selectionDispatch', () => {
      const callbacks: Array<() => void> = [];
      api = {
        on: (_: string, cb: () => void) => {
          callbacks.push(cb);
        },
        removeListener: () => null,
      } as unknown as ExtendedSelectionAPI;

      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      callbacks.forEach((cb) => {
        cb();
        expect(selectionDispatch).toHaveBeenCalledWith({ type: SelectionActions.RESET });
      });
      // only for confirm events
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });
    it('should call keyboard blur when confirmed callback is called, keyboard.enabled is true and tableWrapperRef does not contain activeElement', () => {
      containsActiveElement = false;
      let confirmCallback: () => void;
      api = {
        on: (name: string, cb: () => void) => {
          if (name === 'confirmed') confirmCallback = cb;
        },
        removeListener: () => null,
      } as unknown as ExtendedSelectionAPI;

      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      // @ts-ignore ts does not understand that this has been assigned in the api.on() call
      confirmCallback();
      expect(setShouldRefocus).not.toHaveBeenCalled();
      expect(keyboard.blur).toHaveBeenCalledTimes(1);
    });

    it('should not call keyboard blur when confirmed callback is called, keyboard.enabled is undefined and tableWrapperRef does not contain activeElement', () => {
      containsActiveElement = false;
      keyboard.enabled = false;
      let confirmCallback;
      api = {
        on: (name: string, cb: () => void) => {
          name === 'confirmed' && (confirmCallback = cb);
        },
        removeListener: () => null,
      } as unknown as ExtendedSelectionAPI;

      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      // @ts-ignore ts does not understand that this has been assigned in the api.on() call
      confirmCallback();
      expect(setShouldRefocus).not.toHaveBeenCalled();
      expect(keyboard.blur).not.toHaveBeenCalled();
    });
  });

  describe('reducer', () => {
    let state: SelectionState;
    let cell: Cell;

    beforeEach(() => {
      state = {
        allRows: [] as Row[],
        rows: { 1: 1 },
        colIdx: 1,
        api: {
          isModal: () => false,
          begin: jest.fn(),
          select: jest.fn(),
          cancel: jest.fn(),
        } as unknown as ExtendedSelectionAPI,
        isSelectMultiValues: false,
      };
      cell = createCell(1, 1);
    });

    afterEach(() => jest.clearAllMocks());

    describe('select', () => {
      let action: SelectAction;
      let announce: jest.Mock<any, any>;

      beforeEach(() => {
        announce = jest.fn();
        action = {
          type: SelectionActions.SELECT,
          payload: {
            evt: {
              shiftKey: false,
            } as React.KeyboardEvent,
            announce,
            cell,
          },
        };
      });

      afterEach(() => jest.clearAllMocks());

      it('should call begin, select and announce when type is select and no previous selections', () => {
        state.rows = {};
        state.colIdx = -1;
        const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: { [cell.qElemNumber]: cell.rowIdx }, colIdx: cell.colIdx });
        expect(state.api.begin).toHaveBeenCalledTimes(1);
        expect(state.api.select).toHaveBeenCalledWith({ method: 'selectHyperCubeCells', params });
        expect(state.api.cancel).not.toHaveBeenCalled();
        expect(action.payload.announce).toHaveBeenCalledTimes(1);
      });

      it('should not call begin but call cancel and announce when same qElemNumber (resulting in empty selectedCells)', () => {
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: {}, colIdx: -1 });
        expect(state.api.begin).not.toHaveBeenCalled();
        expect(state.api.select).not.toHaveBeenCalled();
        expect(state.api.cancel).toHaveBeenCalledWith();
        expect(action.payload.announce).toHaveBeenCalledTimes(1);
      });

      it('should return early when excluded columns', () => {
        cell.colIdx = 2;

        const newState = reducer(state, action);
        expect(newState).toBe(state);

        expect(state.api.begin).not.toHaveBeenCalled();
        expect(state.api.cancel).not.toHaveBeenCalled();
        expect(state.api.select).not.toHaveBeenCalled();
        expect(action.payload.announce).not.toHaveBeenCalled();
      });
    });

    describe('select multiple', () => {
      const mouseupOutsideCallback = () => {};
      let evt: React.KeyboardEvent;
      let announce: jest.Mock<any, any>;

      beforeEach(() => {
        state.allRows = createAllRows(4, 1);
        evt = { shiftKey: false, key: KeyCodes.DOWN } as React.KeyboardEvent;
        announce = jest.fn();
      });

      afterEach(() => jest.clearAllMocks());

      it('should return state unchanged, when type is selectMultiStart and mouseupOutsideCallback is undefined', () => {
        const action = { type: SelectionActions.SELECT_MOUSE_DOWN, payload: { cell } } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toEqual(state);
      });

      it('should return state unchanged, when type is selectMultiStart, state.colIdx > 0 and not cell.colIdx', () => {
        state.colIdx = 2;
        const action = {
          type: SelectionActions.SELECT_MOUSE_DOWN,
          payload: { cell, mouseupOutsideCallback },
        } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toEqual(state);
      });

      it('should return state with firstCell and mouseupOutsideCallback, when type is selectMultiStart and state.colIdx === cell.colIdx', () => {
        const action = {
          type: SelectionActions.SELECT_MOUSE_DOWN,
          payload: { cell, mouseupOutsideCallback },
        } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, firstCell: cell, mouseupOutsideCallback });
      });

      it('should return state with firstCell and mouseupOutsideCallback, when type is selectMultiStart and state.colIdx === -1', () => {
        state.colIdx = -1;
        const action = {
          type: SelectionActions.SELECT_MOUSE_DOWN,
          payload: { cell, mouseupOutsideCallback },
        } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, firstCell: cell, mouseupOutsideCallback });
      });

      it('should return state unchanged, when type is selectMultiAdd, firstCell is undefined and isShiftArrow returns false', () => {
        state.rows = {};
        state.colIdx = -1;
        const action = {
          type: SelectionActions.SELECT_MULTI_ADD,
          payload: { cell, announce, evt },
        } as SelectMultiAddAction;
        const newState = reducer(state, action);
        expect(newState).toEqual(state);
      });

      it('should call begin, announce and return state with added rows, when type is selectMultiAdd isSelectMultiValues is true and colIdx is -1', () => {
        state.rows = {};
        state.colIdx = -1;
        state.isSelectMultiValues = true;
        state.firstCell = createCell(2, 1);
        const action = {
          type: SelectionActions.SELECT_MULTI_ADD,
          payload: { cell, announce, evt },
        } as SelectMultiAddAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, colIdx: cell.colIdx, rows: { '1': 1, '2': 2 } });
        expect(state.api.begin).toHaveBeenCalledTimes(1);
        expect(announce).toHaveBeenCalledTimes(1);
      });

      it('should call not call begin, but announce return state with added rows, when type is selectMultiAdd, isSelectMultiValues is true and colIdx is not -1', () => {
        state.isSelectMultiValues = true;
        state.firstCell = createCell(2, 1);
        const action = {
          type: SelectionActions.SELECT_MULTI_ADD,
          payload: { cell, announce, evt },
        } as SelectMultiAddAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, colIdx: cell.colIdx, rows: { '1': 1, '2': 2 } });
        expect(state.api.begin).toHaveBeenCalledTimes(0);
        expect(announce).toHaveBeenCalledTimes(1);
      });

      it('should call select when type is selectMultiEnd, isSelectMultiValues is true and return isSelectMultiValues to be false', () => {
        const action = { type: SelectionActions.SELECT_MULTI_END } as SelectMultiEndAction;
        state.isSelectMultiValues = true;
        const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, isSelectMultiValues: false });
        expect(state.api.select).toHaveBeenCalledWith({ method: 'selectHyperCubeCells', params });
      });

      it('should not call select when type is selectMultiEnd but isSelectMultiValues is false', () => {
        const action = { type: SelectionActions.SELECT_MULTI_END } as SelectMultiEndAction;
        state.isSelectMultiValues = false;

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, isSelectMultiValues: false });
        expect(state.api.select).not.toHaveBeenCalled();
      });
    });

    describe('other', () => {
      it('should return state updated when the app is not in selection modal state when action.type is reset', () => {
        const action = { type: SelectionActions.RESET } as ResetAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: {}, colIdx: -1 });
      });

      it('should return state updated with rows when action.type is clear', () => {
        const action = { type: SelectionActions.CLEAR } as ClearAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: {} });
      });

      it('should return state unchanged when the app is in selection modal state and action.type is reset', () => {
        const action = { type: SelectionActions.RESET } as ResetAction;
        state.api.isModal = () => true;
        const newState = reducer(state, action);
        expect(newState).toEqual(state);
      });

      it('should return state updated with allRows when action.type is updateAllRows', () => {
        const allRows = [{} as unknown as Row];
        const action = { type: SelectionActions.UPDATE_ALL_ROWS, payload: { allRows } } as UpdateAllRowsAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, allRows });
      });
    });
  });

  describe('handleAnnounceSelectionStatus', () => {
    let announce: Announce;
    let oldRows: Record<string, number>;
    let newRows: Record<string, number>;

    beforeEach(() => {
      announce = jest.fn();
      oldRows = { '1': 1 };
      newRows = { '1': 1 };
    });

    afterEach(() => jest.clearAllMocks());

    it('should announce selected value and one selected value when oldRows.length === newRows.length === 1', () => {
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce selected value and two selected values when one row is added, 1->2', () => {
      newRows = { '1': 1, '2': 2 };
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', ['SNTable.SelectionLabel.SelectedValues', '2']],
      });
    });

    it('should announce deselected value and one selected value when one row is removed, 2->1', () => {
      oldRows = { '1': 1, '2': 2 };
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.DeselectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce deselected value and two selected values when one row is removed, 3->2', () => {
      oldRows = { '1': 1, '2': 2, '3': 3 };
      newRows = { '1': 1, '2': 2 };
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.DeselectedValue', ['SNTable.SelectionLabel.SelectedValues', '2']],
      });
    });

    it('should announce deselected value and exited selection mode when you have deselected the last value', () => {
      newRows = {};
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({ keys: ['SNTable.SelectionLabel.ExitedSelectionMode'] });
    });
  });

  describe('getSelectedRows', () => {
    let selectedRows: Record<string, number>;
    let cell: Cell;
    let evt: React.KeyboardEvent;

    beforeEach(() => {
      selectedRows = { 1: 1 };
      cell = {
        qElemNumber: 0,
        rowIdx: 0,
      } as Cell;
      evt = {} as React.KeyboardEvent;
    });

    it('should return array with only the last clicked item when ctrlKey is pressed', () => {
      evt.ctrlKey = true;

      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({ [cell.qElemNumber]: cell.rowIdx });
    });

    it('should return array with only the last clicked item metaKey cm is pressed', () => {
      evt.metaKey = true;

      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({ [cell.qElemNumber]: cell.rowIdx });
    });

    it('should return array with selected item removed if it already was in selectedRows', () => {
      cell.qElemNumber = 1;
      cell.rowIdx = 1;

      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({});
    });
    it('should return array with selected item added if it was not in selectedRows before', () => {
      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({ 1: 1, [cell.qElemNumber]: cell.rowIdx });
    });
  });

  describe('getMultiSelectedRows', () => {
    let allRows: Row[];
    let selectedRows: Record<string, number>;
    let cell: Cell;
    let evt: React.KeyboardEvent;
    let firstCell: Cell | undefined;

    beforeEach(() => {
      allRows = createAllRows(3);
      selectedRows = { '2': 2 };
      cell = createCell(1);
      evt = {} as React.KeyboardEvent;
      firstCell = undefined;
    });

    it('should add the current cell and the next cell to selectedRows when press shift and arrow down key', () => {
      evt.shiftKey = true;
      evt.key = KeyCodes.DOWN;

      const updatedSelectedRows = getMultiSelectedRows(allRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toEqual({
        ...selectedRows,
        [cell.qElemNumber]: cell.rowIdx,
        '1': 1,
      });
    });

    it('should add the current cell and the next cell to selectedRows when press shift and arrow up key', () => {
      evt.shiftKey = true;
      evt.key = KeyCodes.UP;

      const updatedSelectedRows = getMultiSelectedRows(allRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toEqual({
        ...selectedRows,
        [cell.qElemNumber]: cell.rowIdx,
        '0': 0,
      });
    });

    it('should return selectedRows unchanged when not shift+arrow but firstCell is undefined', () => {
      const updatedSelectedRows = getMultiSelectedRows(allRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toEqual(selectedRows);
    });

    it('should return rows updated with all rows between firstCell and cell', () => {
      firstCell = createCell(3);
      const updatedSelectedRows = getMultiSelectedRows(allRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toEqual({ '1': 1, '2': 2, '3': 3 });
    });
  });

  describe('getCellSelectionState', () => {
    let isModal: boolean;
    let cell: Cell;
    let selectionState: SelectionState;

    beforeEach(() => {
      isModal = true;
      cell = {
        qElemNumber: 1,
        colIdx: 1,
      } as Cell;

      selectionState = {
        allRows: createAllRows(4),
        colIdx: 1,
        rows: { 1: 1 },
        api: {
          isModal: () => isModal,
        } as ExtendedSelectionAPI,
        isSelectMultiValues: false,
      };
    });

    afterEach(() => jest.clearAllMocks());

    it('should return selected when selected', () => {
      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.SELECTED);
    });

    it('should return possible when row is not selected', () => {
      cell.qElemNumber = 2;

      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.POSSIBLE);
    });

    it('should return excluded when colIdx is not in selectionState', () => {
      cell.colIdx = 2;

      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.EXCLUDED);
    });

    it('should return inactive when when isModal is false', () => {
      selectionState.colIdx = -1;
      selectionState.rows = {};
      isModal = false;

      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.INACTIVE);
    });
  });
});
