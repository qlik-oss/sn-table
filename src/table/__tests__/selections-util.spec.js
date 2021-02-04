import { addSelectionListeners, getSelectionClass, reducer, selectCell } from '../selections-utils';

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
      const payload = { colIdx: cell.colIdx, rows: [{ qElemNumber: 1, rowIdx: 1 }] };
      const event = { ctrlKey: false, metaKey: false };

      selectCell(cell, selState, selDispatch, event);
      expect(selState.api.begin).to.have.been.called;
      expect(selState.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selDispatch).to.have.been.calledWith({ type: 'select', payload });
    });
    it('should not call begin, remove from selected.rows and call cancel when same qElemNumber', () => {
      selState.rows = [{ qElemNumber: 1, rowIdx: 1 }];
      selState.colIdx = 1;
      alreadyActive = true;
      const event = { ctrlKey: false, metaKey: false };

      selectCell(cell, selState, selDispatch, event);
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
        rows: [
          { qElemNumber: 2, rowIdx: 2 },
          { qElemNumber: 1, rowIdx: 1 },
        ],
      };
      const event = { ctrlKey: false, metaKey: false };

      selectCell(cell, selState, selDispatch, event);
      expect(selState.api.begin).to.not.have.been.called;
      expect(selState.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selDispatch).to.have.been.calledWith({ type: 'select', payload });
    });
    it('should not call begin, ctrl/command keyboard to add to selected and call selectHyperCubeCells when selecting new qElemNumber', () => {
      selState.rows = [{ qElemNumber: 2, rowIdx: 2 }];
      selState.colIdx = 1;
      alreadyActive = true;
      const params = ['/qHyperCubeDef', [1], [cell.colIdx]];
      const payload = {
        colIdx: cell.colIdx,
        rows: [{ qElemNumber: 1, rowIdx: 1 }],
      };
      const event = { ctrlKey: true, metaKey: true };

      selectCell(cell, selState, selDispatch, event);
      expect(selState.api.begin).to.not.have.been.called;
      expect(selState.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selDispatch).to.have.been.calledWith({ type: 'select', payload });
    });
  });
});
