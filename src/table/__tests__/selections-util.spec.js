import {
  addSelectionListeners,
  getSelectedRows,
  reducer,
  selectCell,
  confirmSelections,
  cancelSelections,
} from '../selections-utils';

describe('selections-utils', () => {
  describe('addSelectionListeners', () => {
    const listenerNames = ['deactivated', 'canceled', 'confirmed', 'cleared'];
    let api;
    let selDispatch;

    beforeEach(() => {
      selDispatch = () => {};
      api = {
        on: sinon.spy(),
        removeListener: sinon.spy(),
      };
    });

    it('should call api.on and api removeListener for all listeners', () => {
      addSelectionListeners(api, selDispatch)();
      listenerNames.forEach((name) => {
        expect(api.on).to.have.been.calledWith(name);
        expect(api.removeListener).to.have.been.calledWith(name);
      });
    });
    it('should not call call api.on nor api.removeListener when no api', () => {
      api = undefined;

      const destroyFn = addSelectionListeners(api, selDispatch);
      // Not a great check, but this would crash if the this case worked incorrectly
      expect(destroyFn).to.be.a('function');
    });
    it('should call api.on with the same callback for all listener names, that calls selDispatch', () => {
      const callbacks = [];
      selDispatch = sinon.spy();
      api = {
        on: (name, cb) => {
          callbacks.push(cb);
        },
        removeListener: () => {},
      };

      addSelectionListeners(api, selDispatch);
      callbacks.forEach((cb) => {
        cb();
        expect(selDispatch).to.have.been.calledWith({ type: 'reset' });
      });
    });
  });

  describe('reducer', () => {
    let state;
    let action;

    beforeEach(() => {
      state = {
        rows: [{ qElemNumber: 1, rowIdx: 1 }],
        colIdx: 1,
        api: {},
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

    it('should return state updated with rows and colIdx reset when action.type is reset', () => {
      action.type = 'reset';
      const newState = reducer(state, action);
      expect(newState).to.eql({ ...state, rows: [], colIdx: -1 });
    });

    it('should return state unchanged when rows and colIdx are already reset and action.type is reset', () => {
      state.rows = [];
      state.colIdx = -1;
      action.type = 'reset';
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

      selectedRows = getSelectedRows(selectedRows, qElemNumber, rowIdx, evt);
      expect(selectedRows).to.eql([{ qElemNumber, rowIdx }]);
    });
    it('should return array with only the last clicked item metaKey cm is pressed', () => {
      evt.metaKey = true;

      selectedRows = getSelectedRows(selectedRows, qElemNumber, rowIdx, evt);
      expect(selectedRows).to.eql([{ qElemNumber, rowIdx }]);
    });
    it('should return array with selected item removed if it already was in selectedRows', () => {
      qElemNumber = 1;
      rowIdx = 1;

      selectedRows = getSelectedRows(selectedRows, qElemNumber, rowIdx, evt);
      expect(selectedRows).to.eql([]);
    });
    it('should return array with selected item added if it was not in selectedRows before', () => {
      selectedRows = getSelectedRows(selectedRows, qElemNumber, rowIdx, evt);
      expect(selectedRows).to.eql([
        { qElemNumber: 1, rowIdx: 1 },
        { qElemNumber, rowIdx },
      ]);
    });
  });

  describe('selectCell', () => {
    const event = {};
    let selState;
    let cell;
    let selDispatch;

    beforeEach(() => {
      selState = {
        rows: [],
        colIdx: -1,
        api: {
          begin: sinon.spy(),
          select: sinon.spy(),
          cancel: sinon.spy(),
        },
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 };
      selDispatch = sinon.spy();
    });

    it('should call begin, selDispatch and selectHyperCubeCells when no previous selections', () => {
      const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];
      const payload = { colIdx: cell.colIdx, rows: [{ qElemNumber: cell.qElemNumber, rowIdx: cell.rowIdx }] };

      selectCell(cell, selState, selDispatch, event);
      expect(selState.api.begin).to.have.been.calledOnce;
      expect(selState.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selDispatch).to.have.been.calledWith({ type: 'select', payload });
      expect(selState.api.cancel).to.not.have.been.called;
    });
    it('should not call begin and call cancel when same qElemNumber (resulting in empty selectedCells)', () => {
      selState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selState.colIdx = 1;

      selectCell(cell, selState, selDispatch, event);
      expect(selState.api.begin).to.not.have.been.called;
      expect(selState.api.cancel).to.have.been.calledOnce;
      expect(selDispatch).to.not.have.been.called;
      expect(selState.api.select).to.not.have.been.called;
    });
    it('should return early when excluded columns', () => {
      selState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selState.colIdx = 1;
      cell.colIdx = 2;

      selectCell(cell, selState, selDispatch, event);
      expect(selState.api.begin).to.not.have.been.called;
      expect(selState.api.cancel).to.not.have.been.called;
      expect(selDispatch).to.not.have.been.called;
      expect(selState.api.select).to.not.have.been.called;
    });
  });

  describe('confirmSelections', () => {
    const selState = {
      api: {
        confirm: sinon.spy(),
      },
    };
    it('should cancel selection', () => {
      confirmSelections(selState);

      expect(selState.api.confirm).to.have.been.called;
    });
  });

  describe('cancelSelections', () => {
    const selState = {
      api: {
        cancel: sinon.spy(),
      },
    };
    it('should cancel selection', () => {
      cancelSelections(selState);

      expect(selState.api.cancel).to.have.been.called;
    });
  });
});
