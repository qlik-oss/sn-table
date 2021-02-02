import { addSelectionListeners, getSelectionClass, reducer, selectCell } from '../selections-utils';

describe('selections-utils', () => {
  describe('addSelectionListeners', () => {
    let api;
    let selDispatch;

    it('should call api.on and api removeListener for all listeners', () => {
      const listenerNames = ['deactivated', 'canceled', 'confirmed', 'cleared'];
      api = {
        on: sinon.spy(),
        removeListener: sinon.spy(),
      };
      selDispatch = () => {};

      addSelectionListeners(api, selDispatch)();
      listenerNames.forEach((name) => {
        expect(api.on).to.have.been.calledWith(name);
        expect(api.removeListener).to.have.been.calledWith(name);
      });
    });
    it('should call api.on with the same callback for all listener names, that calls selDispatch', () => {
      const callbacks = [];
      api = {
        on: (name, cb) => {
          callbacks.push(cb);
        },
        removeListener: () => {},
      };
      selDispatch = sinon.spy();

      addSelectionListeners(api, selDispatch);
      callbacks.forEach((cb) => {
        cb();
        expect(selDispatch).to.have.been.calledWith({ type: 'reset' });
      });
    });
  });

  describe('getSelectionClass', () => {
    let selState;
    let cell;

    beforeEach(() => {
      selState = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }] };
      cell = { qElemNumber: 1, colIdx: 1 };
    });

    it('should return selected when selected', () => {
      const selectionClass = getSelectionClass(cell, selState);
      expect(selectionClass).to.equal('selected');
    });
    it('should return excluded when other column', () => {
      cell.qElemNumber = 2;
      cell.colIdx = 2;

      const selectionClass = getSelectionClass(cell, selState);
      expect(selectionClass).to.equal('excluded');
    });
    it('should return excluded when other column that happens to have the same qElemNumber', () => {
      cell.colIdx = 2;

      const selectionClass = getSelectionClass(cell, selState);
      expect(selectionClass).to.equal('excluded');
    });
    it('should return possible when active and available to select', () => {
      cell.qElemNumber = 2;

      const selectionClass = getSelectionClass(cell, selState);
      expect(selectionClass).to.equal('possible');
    });
    it('should return possible when no active selections', () => {
      selState = { rows: [] };

      const selectionClass = getSelectionClass(cell, selState);
      expect(selectionClass).to.equal('possible');
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
      };
      action = {
        type: '',
      };
    });

    it('should return state updated with rows and colIdx when action.type is select', () => {
      const newRow = { qElemNumber: 2, rowIdx: 2 };
      action = { type: 'select', payload: { colIdx: 1, newRows: [...state.rows, newRow] } };
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

    it('should return error when incorrect action type', () => {
      try {
        reducer(state, action);
      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
  });

  describe('selectCell', () => {
    let selState;
    let cell;
    let alreadyActive;
    let selDispatch;

    beforeEach(() => {
      alreadyActive = false;
      selState = {
        rows: [],
        colIdx: -1,
        api: {
          isActive: () => alreadyActive,
          begin: sinon.spy(),
          select: sinon.spy(),
          cancel: sinon.spy(),
        },
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 };
      selDispatch = sinon.spy();
    });

    it('should call begin, add to selected and call selectHyperCubeCells when no previous selections empty', () => {
      const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];
      const payload = { colIdx: cell.colIdx, newRows: [{ qElemNumber: 1, rowIdx: 1 }] };

      selectCell(cell, selState, selDispatch);
      expect(selState.api.begin).to.have.been.called;
      expect(selState.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selDispatch).to.have.been.calledWith({ type: 'select', payload });
    });
    it('should not call begin, remove from selected.rows and call cancel when same qElemNumber', () => {
      selState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selState.colIdx = 1;
      alreadyActive = true;

      selectCell(cell, selState, selDispatch);
      expect(selState.api.begin).to.not.have.been.called;
      expect(selState.api.cancel).to.have.been.calledOnce;
      expect(selDispatch).to.not.have.been.called;
    });
    it('should not call begin, add to selected and call selectHyperCubeCells when selecting new qElemNumber', () => {
      selState.rows = [{ qElemNumber: 2, rowIdx: 2 }];
      selState.colIdx = 1;
      alreadyActive = true;
      const params = ['/qHyperCubeDef', [2, 1], [cell.colIdx]];
      const payload = {
        colIdx: cell.colIdx,
        newRows: [
          { qElemNumber: 2, rowIdx: 2 },
          { qElemNumber: 1, rowIdx: 1 },
        ],
      };

      selectCell(cell, selState, selDispatch);
      expect(selState.api.begin).to.not.have.been.called;
      expect(selState.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selDispatch).to.have.been.calledWith({ type: 'select', payload });
    });
  });
});
