import { addSelectionListeners, reducer, handleAnnounceSelectionStatus, getSelectedRows } from '../selections-utils';

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
    let cell;

    beforeEach(() => {
      state = {
        rows: { 1: 1 },
        colIdx: 1,
        api: {
          isModal: () => false,
          begin: jest.fn(),
          select: jest.fn(),
          cancel: jest.fn(),
        },
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 };
      action = {
        type: 'select',
        payload: {
          evt: {},
          announce: jest.fn(),
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

    it('should return state updated when the app is not in selection modal state  when action.type is reset', () => {
      action.type = 'reset';
      const newState = reducer(state, action);
      expect(newState).toEqual({ ...state, rows: {}, colIdx: -1 });
    });

    it('should return state updated with rows when action.type is clear', () => {
      action.type = 'clear';
      const newState = reducer(state, action);
      expect(newState).toEqual({ ...state, rows: {} });
    });

    it('should return state unchanged when the app is in selection modal state and action.type is reset', () => {
      action.type = 'reset';
      state.api.isModal = () => true;
      const newState = reducer(state, action);
      expect(newState).toEqual(state);
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

    it('should announce deselected value and exited selection mode when you have deselected the last value', () => {
      rowsLength = 0;
      isAddition = false;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).toHaveBeenCalledWith({ keys: 'SNTable.SelectionLabel.ExitedSelectionMode' });
    });
  });

  describe('getSelectedRows', () => {
    let selectedRows;
    let cell;
    let evt;

    beforeEach(() => {
      selectedRows = { 1: 1 };
      cell = {
        qElemNumber: 0,
        rowIdx: 0,
      };
      evt = {};
    });

    it('should return array with only the last clicked item when ctrlKey is pressed', () => {
      evt.ctrlKey = true;

      const updatedSelectedRows = getSelectedRows({ selectedRows, cell, evt });
      expect(updatedSelectedRows).toEqual({ [cell.qElemNumber]: cell.rowIdx });
    });

    it('should return array with only the last clicked item metaKey cm is pressed', () => {
      evt.metaKey = true;

      const updatedSelectedRows = getSelectedRows({ selectedRows, cell, evt });
      expect(updatedSelectedRows).toEqual({ [cell.qElemNumber]: cell.rowIdx });
    });

    it('should return array with selected item removed if it already was in selectedRows', () => {
      cell.qElemNumber = 1;
      cell.rowIdx = 1;

      const updatedSelectedRows = getSelectedRows({ selectedRows, cell, evt });
      expect(updatedSelectedRows).toEqual({});
    });

    it('should return array with selected item added if it was not in selectedRows before', () => {
      const updatedSelectedRows = getSelectedRows({ selectedRows, cell, evt });
      expect(updatedSelectedRows).toEqual({ 1: 1, [cell.qElemNumber]: cell.rowIdx });
    });
  });
});
