import {
  addSelectionListeners,
  reducer,
  handleAnnounceSelectionStatus,
  getSelectedRows,
  selectCell,
} from '../selections-utils';

describe('selections-utils', () => {
  describe('addSelectionListeners', () => {
    const listenerNames = ['deactivated', 'canceled', 'confirmed', 'cleared'];
    let api;
    let selectionDispatch;
    let setShouldRefocus;
    let keyboard;
    let containsActiveElement;
    let tableWrapperRef;

    beforeEach(() => {
      selectionDispatch = jest.fn();
      setShouldRefocus = jest.fn();
      api = {
        on: jest.fn(),
        removeListener: jest.fn(),
      };
      keyboard = { enabled: true, active: false, blur: jest.fn() };
      containsActiveElement = true;
      tableWrapperRef = {
        current: {
          contains: () => containsActiveElement,
        },
      };
    });

    afterEach(() => jest.clearAllMocks());

    it('should call api.on and api removeListener for all listeners', () => {
      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef })();

      listenerNames.forEach((name, index) => {
        expect(api.on).toHaveBeenNthCalledWith(index + 1, name, expect.anything());
      });
    });
    it('should not call call api.on nor api.removeListener when no api', () => {
      api = undefined;

      const destroyFn = addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      // Not a great check, but this would crash if the this case worked incorrectly
      expect(destroyFn).toBeInstanceOf(Function);
    });
    it('should call api.on with the same callback for all listener names, that calls selectionDispatch', () => {
      const callbacks = [];
      api = {
        on: (name, cb) => {
          callbacks.push(cb);
        },
        removeListener: () => {},
      };

      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      callbacks.forEach((cb) => {
        cb();
        expect(selectionDispatch).toHaveBeenCalledWith({ type: 'reset' });
      });
      // only for confirm events
      expect(setShouldRefocus).toHaveBeenCalledTimes(1);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });
    it('should call keyboard blur when confirmed callback is called, keyboard.enabled is true and tableWrapperRef does not contain activeElement', () => {
      containsActiveElement = false;
      let confirmCallback;
      api = {
        on: (name, cb) => {
          name === 'confirmed' && (confirmCallback = cb);
        },
        removeListener: () => {},
      };

      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      confirmCallback();
      expect(setShouldRefocus).not.toHaveBeenCalled();
      expect(keyboard.blur).toHaveBeenCalledTimes(1);
    });

    it('should not call keyboard blur when confirmed callback is called, keyboard.enabled is undefined and tableWrapperRef does not contain activeElement', () => {
      containsActiveElement = false;
      keyboard.enabled = undefined;
      let confirmCallback;
      api = {
        on: (name, cb) => {
          name === 'confirmed' && (confirmCallback = cb);
        },
        removeListener: () => {},
      };

      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      confirmCallback();
      expect(setShouldRefocus).not.toHaveBeenCalled();
      expect(keyboard.blur).not.toHaveBeenCalled();
    });
  });

  describe('reducer', () => {
    let state;
    let action;

    beforeEach(() => {
      state = {
        rows: [{ qElemNumber: 1, rowIdx: 1 }],
        colIdx: 1,
        api: {
          isModal: () => false,
        },
        isEnabled: false,
      };
      action = {
        type: '',
      };
    });

    it('should return state updated with rows and colIdx when action.type is select', () => {
      const newRow = { qElemNumber: 2, rowIdx: 2 };
      action = { type: 'select', payload: { colIdx: 1, rows: [...state.rows, newRow] } };
      const expectedRows = [...state.rows, newRow];

      const newState = reducer(state, action);
      expect(newState).toEqual({ ...state, rows: expectedRows });
    });

    it('should return state updated when the app is not in selection modal state  when action.type is reset', () => {
      action.type = 'reset';
      const newState = reducer(state, action);
      expect(newState).toEqual({ ...state, rows: [], colIdx: -1 });
    });

    it('should return state updated with rows when action.type is clear', () => {
      action.type = 'clear';
      const newState = reducer(state, action);
      expect(newState).toEqual({ ...state, rows: [] });
    });

    it('should return state unchanged when the app is in selection modal state and action.type is reset', () => {
      action.type = 'reset';
      state.api.isModal = () => true;
      const newState = reducer(state, action);
      expect(newState).toEqual(state);
    });

    it('should return state updated with isEnabled when action.type is set-enabled', () => {
      action = { type: 'set-enabled', payload: { isEnabled: true } };
      reducer(state, action);
      const newState = reducer(state, action);
      expect(newState).toEqual({ ...state, isEnabled: true });
    });

    it('should return error when incorrect action type', () => {
      try {
        reducer(state, action);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('handleAnnounceSelectionStatus', () => {
    let announce;
    let rowsLength;
    let isAddition;

    beforeEach(() => {
      announce = jest.fn();
      rowsLength = 1;
      isAddition = true;
    });

    afterEach(() => jest.clearAllMocks());

    it('should announce selected value and one selected value when rowsLength is 1 and isAddition is true', () => {
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce selected value and two selected values when rowsLength is 2 and isAddition is true', () => {
      rowsLength = 2;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', ['SNTable.SelectionLabel.SelectedValues', rowsLength]],
      });
    });

    it('should announce deselected value and one selected value when rowsLength is 1 and isAddition is false', () => {
      isAddition = false;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.DeselectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce deselected value and two selected values when rowsLength is 2 and isAddition is false', () => {
      rowsLength = 2;
      isAddition = false;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition: false });

      expect(announce).toHaveBeenCalledWith({
        keys: ['SNTable.SelectionLabel.DeselectedValue', ['SNTable.SelectionLabel.SelectedValues', rowsLength]],
      });
    });

    it('should announce deselected value and exited selection mode when we have deselected the last value', () => {
      rowsLength = 0;
      isAddition = false;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).toHaveBeenCalledWith({ keys: 'SNTable.SelectionLabel.ExitedSelectionMode' });
    });
  });

  describe('getSelectedRows', () => {
    let selectedRows;
    let qElemNumber;
    let rowIdx;
    let evt;

    beforeEach(() => {
      selectedRows = [{ qElemNumber: 1, rowIdx: 1 }];
      qElemNumber = 0;
      rowIdx = 0;
      evt = {};
    });

    it('should return array with only the last clicked item when ctrlKey is pressed', () => {
      evt.ctrlKey = true;

      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      expect(selectedRows).toEqual([{ qElemNumber, rowIdx }]);
    });
    it('should return array with only the last clicked item metaKey cm is pressed', () => {
      evt.metaKey = true;

      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      expect(selectedRows).toEqual([{ qElemNumber, rowIdx }]);
    });
    it('should return array with selected item removed if it already was in selectedRows', () => {
      qElemNumber = 1;
      rowIdx = 1;

      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      expect(selectedRows).toEqual([]);
    });
    it('should return array with selected item added if it was not in selectedRows before', () => {
      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      expect(selectedRows).toEqual([
        { qElemNumber: 1, rowIdx: 1 },
        { qElemNumber, rowIdx },
      ]);
    });
  });

  describe('selectCell', () => {
    const event = {};
    let selectionState;
    let cell;
    let selectionDispatch;
    let announce;

    beforeEach(() => {
      selectionState = {
        rows: [],
        colIdx: -1,
        api: {
          begin: jest.fn(),
          select: jest.fn(),
          cancel: jest.fn(),
        },
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 };
      selectionDispatch = jest.fn();
      announce = jest.fn();
    });

    it('should call begin, selectionDispatch and selectHyperCubeCells when no previous selections and also announce it to the user', () => {
      const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];
      const payload = { colIdx: cell.colIdx, rows: [{ qElemNumber: cell.qElemNumber, rowIdx: cell.rowIdx }] };

      selectCell({ selectionState, cell, selectionDispatch, evt: event, announce });
      expect(selectionState.api.begin).toHaveBeenCalledTimes(1);
      expect(selectionState.api.select).toHaveBeenCalledWith({ method: 'selectHyperCubeCells', params });
      expect(selectionDispatch).toHaveBeenCalledWith({ type: 'select', payload });
      expect(selectionState.api.cancel).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledTimes(1);
    });
    it('should not call begin and call cancel when same qElemNumber (resulting in empty selectedCells)', () => {
      selectionState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selectionState.colIdx = 1;

      selectCell({ selectionState, cell, selectionDispatch, evt: event, announce });
      expect(selectionState.api.begin).not.toHaveBeenCalled();
      expect(selectionState.api.cancel).toHaveBeenCalledTimes(1);
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(selectionState.api.select).not.toHaveBeenCalled();
      expect(announce).toHaveBeenCalledTimes(1);
    });
    it('should return early when excluded columns', () => {
      selectionState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selectionState.colIdx = 1;
      cell.colIdx = 2;

      selectCell({ selectionState, cell, selectionDispatch, evt: event, announce });
      expect(selectionState.api.begin).not.toHaveBeenCalled();
      expect(selectionState.api.cancel).not.toHaveBeenCalled();
      expect(selectionDispatch).not.toHaveBeenCalled();
      expect(selectionState.api.select).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });
  });
});
