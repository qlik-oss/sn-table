import { stardust } from '@nebula.js/stardust';
import {
  addSelectionListeners,
  reducer,
  handleAnnounceSelectionStatus,
  getSelectedRows,
  getCellSelectionState,
  SelectionStates,
  SelectionActions,
  SelectMultiValuesAction,
  SelectAction,
  ResetAction,
  ClearAction,
} from '../selections-utils';
import { Cell, SelectionState, ExtendedSelectionAPI, Announce, ContextValue } from '../../../types';

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
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 } as Cell;
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

      it('should call begin and announce but not select when type is select and isSelectMultiValues is true', () => {
        state.rows = {};
        state.colIdx = -1;
        action.payload = {
          evt: {
            shiftKey: true,
            key: 'DownArrow',
          } as React.KeyboardEvent,
          announce,
          cell,
        };

        const newState = reducer(state, action);
        expect(newState).toEqual({
          ...state,
          rows: { [cell.qElemNumber]: cell.rowIdx, [cell.prevQElemNumber as number]: cell.rowIdx - 1 },
          colIdx: cell.colIdx,
          isSelectMultiValues: true,
        });
        expect(state.api.begin).toHaveBeenCalledTimes(1);
        expect(state.api.select).not.toHaveBeenCalled();
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

    describe('other', () => {
      it('should call select when type is selectMultiValues, isSelectMultiValues is true and return isSelectMultiValues to be false', () => {
        const action = { type: SelectionActions.SELECT_MULTI_VALUES } as SelectMultiValuesAction;
        state.isSelectMultiValues = true;
        const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, isSelectMultiValues: false });
        expect(state.api.select).toHaveBeenCalledWith({ method: 'selectHyperCubeCells', params });
      });

      it('should not call select when type is selectMultiValues but isSelectMultiValues is false', () => {
        const action = { type: SelectionActions.SELECT_MULTI_VALUES } as SelectMultiValuesAction;
        state.isSelectMultiValues = false;

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, isSelectMultiValues: false });
        expect(state.api.select).not.toHaveBeenCalled();
      });

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
    });
  });

  describe('handleAnnounceSelectionStatus', () => {
    let announce: Announce;
    let rowsLength: number;
    let isAddition: boolean;

    beforeEach(() => {
      announce = jest.fn();
      rowsLength = 1;
      isAddition = true;
    });

    afterEach(() => jest.clearAllMocks());

    it('should announce selected value and one selected value when rowsLength is 1 and isAddition is true', () => {
      handleAnnounceSelectionStatus(announce, rowsLength, isAddition);

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce selected value and two selected values when rowsLength is 2 and isAddition is true', () => {
      rowsLength = 2;
      handleAnnounceSelectionStatus(announce, rowsLength, isAddition);

      expect(announce).toHaveBeenCalledWith({
        keys: [
          'SNTable.SelectionLabel.SelectedValue',
          ['SNTable.SelectionLabel.SelectedValues', rowsLength.toString()],
        ],
      });
    });

    it('should announce deselected value and one selected value when rowsLength is 1 and isAddition is false', () => {
      isAddition = false;
      handleAnnounceSelectionStatus(announce, rowsLength, isAddition);

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.DeselectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce deselected value and two selected values when rowsLength is 2 and isAddition is false', () => {
      rowsLength = 2;
      isAddition = false;
      handleAnnounceSelectionStatus(announce, rowsLength, isAddition);

      expect(announce).toHaveBeenCalledWith({
        keys: [
          'SNTable.SelectionLabel.DeselectedValue',
          ['SNTable.SelectionLabel.SelectedValues', rowsLength.toString()],
        ],
      });
    });

    it('should announce deselected value and exited selection mode when you have deselected the last value', () => {
      rowsLength = 0;
      isAddition = false;
      handleAnnounceSelectionStatus(announce, rowsLength, isAddition);

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

    it('should add the current cell and the next cell to selectedRows when press shift and arrow down key', () => {
      evt.shiftKey = true;
      evt.key = 'ArrowDown';
      cell.nextQElemNumber = 2;

      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({ 1: 1, [cell.qElemNumber]: cell.rowIdx, [cell.nextQElemNumber]: 1 });
    });
  });

  describe('getCellSelectionState', () => {
    let isModal: boolean;
    let cell: Cell;
    let value: ContextValue;

    beforeEach(() => {
      isModal = true;
      cell = {
        qElemNumber: 1,
        colIdx: 1,
      } as Cell;
      value = {
        selectionState: {
          colIdx: 1,
          rows: { 1: 1 },
          api: {
            isModal: () => isModal,
          } as ExtendedSelectionAPI,
          isSelectMultiValues: false,
        },
      } as unknown as ContextValue;
    });

    afterEach(() => jest.clearAllMocks());

    it('should return selected when selected', () => {
      const cellState = getCellSelectionState(cell, value);
      expect(cellState).toEqual(SelectionStates.SELECTED);
    });

    it('should return possible when row is not selected', () => {
      cell.qElemNumber = 2;

      const cellState = getCellSelectionState(cell, value);
      expect(cellState).toEqual(SelectionStates.POSSIBLE);
    });

    it('should return excluded when colIdx is not in selectionState', () => {
      cell.colIdx = 2;

      const cellState = getCellSelectionState(cell, value);
      expect(cellState).toEqual(SelectionStates.EXCLUDED);
    });

    it('should return inactive when when isModal is false', () => {
      value.selectionState.colIdx = -1;
      value.selectionState.rows = {};
      isModal = false;

      const cellState = getCellSelectionState(cell, value);
      expect(cellState).toEqual(SelectionStates.INACTIVE);
    });
  });
});
