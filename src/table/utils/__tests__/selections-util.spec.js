import { expect } from 'chai';
import sinon from 'sinon';
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
      selectionDispatch = sinon.spy();
      setShouldRefocus = sinon.spy();
      api = {
        on: sinon.spy(),
        removeListener: sinon.spy(),
      };
      keyboard = { enabled: true, active: false, blur: sinon.spy() };
      containsActiveElement = true;
      tableWrapperRef = {
        current: {
          contains: () => containsActiveElement,
        },
      };
    });

    afterEach(() => {
      sinon.verifyAndRestore();
      sinon.resetHistory();
    });

    it('should call api.on and api removeListener for all listeners', () => {
      addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef })();
      listenerNames.forEach((name) => {
        expect(api.on).to.have.been.calledWith(name);
        expect(api.removeListener).to.have.been.calledWith(name);
      });
    });
    it('should not call call api.on nor api.removeListener when no api', () => {
      api = undefined;

      const destroyFn = addSelectionListeners({ api, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
      // Not a great check, but this would crash if the this case worked incorrectly
      expect(destroyFn).to.be.a('function');
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
        expect(selectionDispatch).to.have.been.calledWith({ type: 'reset' });
      });
      // only for confirm events
      expect(setShouldRefocus).to.have.been.calledOnce;
      expect(keyboard.blur).to.not.have.been.called;
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
      expect(setShouldRefocus).to.not.have.been.called;
      expect(keyboard.blur).to.have.been.calledOnce;
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
      expect(setShouldRefocus).to.not.have.been.called;
      expect(keyboard.blur).to.not.have.been.called;
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
      expect(newState).to.eql({ ...state, rows: expectedRows });
    });

    it('should return state updated when the app is not in selection modal state  when action.type is reset', () => {
      action.type = 'reset';
      const newState = reducer(state, action);
      expect(newState).to.eql({ ...state, rows: [], colIdx: -1 });
    });

    it('should return state updated with rows when action.type is clear', () => {
      action.type = 'clear';
      const newState = reducer(state, action);
      expect(newState).to.eql({ ...state, rows: [] });
    });

    it('should return state unchanged when the app is in selection modal state and action.type is reset', () => {
      action.type = 'reset';
      state.api.isModal = () => true;
      const newState = reducer(state, action);
      expect(newState).to.equal(state);
    });

    it('should return state updated with isEnabled when action.type is set-enabled', () => {
      action = { type: 'set-enabled', payload: { isEnabled: true } };
      reducer(state, action);
      const newState = reducer(state, action);
      expect(newState).to.eql({ ...state, isEnabled: true });
    });

    it('should return error when incorrect action type', () => {
      try {
        reducer(state, action);
      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
  });

  describe('handleAnnounceSelectionStatus', () => {
    let announce;
    let rowsLength;
    let isAddition;

    beforeEach(() => {
      announce = sinon.spy();
      rowsLength = 1;
      isAddition = true;
    });

    afterEach(() => {
      sinon.verifyAndRestore();
      sinon.resetHistory();
    });

    it('should announce selected value and one selected value when rowsLength is 1 and isAddition is true', () => {
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).to.have.been.calledOnceWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce selected value and two selected values when rowsLength is 2 and isAddition is true', () => {
      rowsLength = 2;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).to.have.been.calledOnceWith({
        keys: ['SNTable.SelectionLabel.SelectedValue', ['SNTable.SelectionLabel.SelectedValues', rowsLength]],
      });
    });

    it('should announce deselected value and one selected value when rowsLength is 1 and isAddition is false', () => {
      isAddition = false;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).to.have.been.calledOnceWith({
        keys: ['SNTable.SelectionLabel.DeselectedValue', 'SNTable.SelectionLabel.OneSelectedValue'],
      });
    });

    it('should announce deselected value and two selected values when rowsLength is 2 and isAddition is false', () => {
      rowsLength = 2;
      isAddition = false;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition: false });

      expect(announce).to.have.been.calledOnceWith({
        keys: ['SNTable.SelectionLabel.DeselectedValue', ['SNTable.SelectionLabel.SelectedValues', rowsLength]],
      });
    });

    it('should announce deselected value and exited selection mode when you have deselected the last value', () => {
      rowsLength = 0;
      isAddition = false;
      handleAnnounceSelectionStatus({ announce, rowsLength, isAddition });

      expect(announce).to.have.been.calledOnceWith({ keys: 'SNTable.SelectionLabel.ExitedSelectionMode' });
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
      expect(selectedRows).to.eql([{ qElemNumber, rowIdx }]);
    });
    it('should return array with only the last clicked item metaKey cm is pressed', () => {
      evt.metaKey = true;

      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      expect(selectedRows).to.eql([{ qElemNumber, rowIdx }]);
    });
    it('should return array with selected item removed if it already was in selectedRows', () => {
      qElemNumber = 1;
      rowIdx = 1;

      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      expect(selectedRows).to.eql([]);
    });
    it('should return array with selected item added if it was not in selectedRows before', () => {
      selectedRows = getSelectedRows({ selectedRows, qElemNumber, rowIdx, evt });
      expect(selectedRows).to.eql([
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
          begin: sinon.spy(),
          select: sinon.spy(),
          cancel: sinon.spy(),
        },
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 };
      selectionDispatch = sinon.spy();
      announce = sinon.spy();
    });

    it('should call begin, selectionDispatch and selectHyperCubeCells when no previous selections and also announce it to the user', () => {
      const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];
      const payload = { colIdx: cell.colIdx, rows: [{ qElemNumber: cell.qElemNumber, rowIdx: cell.rowIdx }] };

      selectCell({ selectionState, cell, selectionDispatch, evt: event, announce });
      expect(selectionState.api.begin).to.have.been.calledOnce;
      expect(selectionState.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selectionDispatch).to.have.been.calledWith({ type: 'select', payload });
      expect(selectionState.api.cancel).to.not.have.been.called;
      expect(announce).to.have.been.calledOnce;
    });
    it('should not call begin and call cancel when same qElemNumber (resulting in empty selectedCells)', () => {
      selectionState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selectionState.colIdx = 1;

      selectCell({ selectionState, cell, selectionDispatch, evt: event, announce });
      expect(selectionState.api.begin).to.not.have.been.called;
      expect(selectionState.api.cancel).to.have.been.calledOnce;
      expect(selectionDispatch).to.not.have.been.called;
      expect(selectionState.api.select).to.not.have.been.called;
      expect(announce).to.have.been.calledOnce;
    });
    it('should return early when excluded columns', () => {
      selectionState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selectionState.colIdx = 1;
      cell.colIdx = 2;

      selectCell({ selectionState, cell, selectionDispatch, evt: event, announce });
      expect(selectionState.api.begin).to.not.have.been.called;
      expect(selectionState.api.cancel).to.not.have.been.called;
      expect(selectionDispatch).to.not.have.been.called;
      expect(selectionState.api.select).to.not.have.been.called;
      expect(announce).to.not.have.been.called;
    });
  });
});
