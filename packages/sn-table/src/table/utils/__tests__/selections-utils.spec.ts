import { createCell, createPageRows } from "../../../__test__/generate-test-data";
import { Announce, Cell, ExtendedSelectionAPI, Row } from "../../../types";
import { KeyCodes, SelectionActions, SelectionStates } from "../../constants";
import {
  ClearAction,
  ResetAction,
  SelectAction,
  SelectMouseDownAction,
  SelectMouseUpAction,
  SelectMultiAddAction,
  SelectMultiEndAction,
  SelectionState,
  UpdatePageRowsAction,
} from "../../types";
import {
  announceSelectionStatus,
  getCellSelectionState,
  getMultiSelectedRows,
  getSelectedRows,
  reducer,
} from "../selections-utils";

describe("selections-utils", () => {
  describe("reducer", () => {
    let state: SelectionState;
    let cell: Cell;

    beforeEach(() => {
      state = {
        pageRows: [] as Row[],
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

    describe("select", () => {
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

      it("should call begin, select and announce when type is select and no previous selections", () => {
        state.rows = {};
        state.colIdx = -1;
        const params = ["/qHyperCubeDef", [cell.rowIdx], [cell.colIdx]];

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: { [cell.qElemNumber]: cell.rowIdx }, colIdx: cell.colIdx });
        expect(state.api?.begin).toHaveBeenCalledTimes(1);
        expect(state.api?.select).toHaveBeenCalledWith({ method: "selectHyperCubeCells", params });
        expect(state.api?.cancel).not.toHaveBeenCalled();
        expect(action.payload.announce).toHaveBeenCalledTimes(1);
      });

      it("should not call begin but call cancel and announce when same qElemNumber (resulting in empty selectedCells)", () => {
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: {}, colIdx: -1 });
        expect(state.api?.begin).not.toHaveBeenCalled();
        expect(state.api?.select).not.toHaveBeenCalled();
        expect(state.api?.cancel).toHaveBeenCalledWith();
        expect(action.payload.announce).toHaveBeenCalledTimes(1);
      });

      it("should return early when excluded columns", () => {
        cell.selectionColIdx = 2;

        const newState = reducer(state, action);
        expect(newState).toBe(state);

        expect(state.api?.begin).not.toHaveBeenCalled();
        expect(state.api?.cancel).not.toHaveBeenCalled();
        expect(state.api?.select).not.toHaveBeenCalled();
        expect(action.payload.announce).not.toHaveBeenCalled();
      });
    });

    describe("select multiple", () => {
      const mouseupOutsideCallback = () => {};
      let evt: React.KeyboardEvent | React.MouseEvent;
      let announce: jest.Mock<any, any>;

      beforeEach(() => {
        state.pageRows = createPageRows(4, 1);
        state.firstCell = undefined;
        evt = { shiftKey: false, key: KeyCodes.DOWN } as React.KeyboardEvent;
        announce = jest.fn();
      });

      afterEach(() => jest.clearAllMocks());

      it("should return state unchanged, when type is selectMultiStart and mouseupOutsideCallback is undefined", () => {
        const action = { type: SelectionActions.SELECT_MOUSE_DOWN, payload: { cell } } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toBe(state);
      });

      it("should return state unchanged, when type is selectMultiStart, state.colIdx > 0 and not cell.colIdx", () => {
        state.colIdx = 2;
        const action = {
          type: SelectionActions.SELECT_MOUSE_DOWN,
          payload: { cell, mouseupOutsideCallback },
        } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toBe(state);
      });

      it("should return state with firstCell and mouseupOutsideCallback, when type is selectMultiStart and state.colIdx === cell.colIdx", () => {
        const action = {
          type: SelectionActions.SELECT_MOUSE_DOWN,
          payload: { cell, mouseupOutsideCallback },
        } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, firstCell: cell, mouseupOutsideCallback });
      });

      it("should return state with firstCell and mouseupOutsideCallback, when type is selectMultiStart and state.colIdx === -1", () => {
        state.colIdx = -1;
        const action = {
          type: SelectionActions.SELECT_MOUSE_DOWN,
          payload: { cell, mouseupOutsideCallback },
        } as SelectMouseDownAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, firstCell: cell, mouseupOutsideCallback });
      });

      it("should return state with current cell added and reset isSelectMultiValues and firstCell, when isSelectMultiValues is undefined and firstCell is payload.cell", () => {
        cell = createCell(2, 1);
        state.firstCell = cell;
        evt = { shiftKey: false } as React.MouseEvent;
        const action = {
          type: SelectionActions.SELECT_MOUSE_UP,
          payload: { evt, announce, cell },
        } as SelectMouseUpAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({
          ...state,
          rows: { "1": 1, "2": 2 },
          isSelectMultiValues: false,
          firstCell: undefined,
        });
      });

      it("should return state with unchanged rows but reset isSelectMultiValues and firstCell, when firstCell is not payload.cell", () => {
        state.firstCell = createCell(2, 1);
        evt = { shiftKey: false } as React.MouseEvent;
        const action = {
          type: SelectionActions.SELECT_MOUSE_UP,
          payload: { evt, announce, cell },
        } as SelectMouseUpAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({
          ...state,
          isSelectMultiValues: false,
          firstCell: undefined,
        });
      });

      it("should return state unchanged, when type is selectMultiAdd, firstCell is undefined and isShiftArrow returns false", () => {
        state.rows = {};
        state.colIdx = -1;
        const action = {
          type: SelectionActions.SELECT_MULTI_ADD,
          payload: { cell, announce, evt },
        } as SelectMultiAddAction;
        const newState = reducer(state, action);
        expect(newState).toBe(state);
      });

      it("should call begin, announce and return state with added rows, when type is selectMultiAdd isSelectMultiValues is true and colIdx is -1", () => {
        state.rows = {};
        state.colIdx = -1;
        state.isSelectMultiValues = true;
        state.firstCell = createCell(2, 1);
        const action = {
          type: SelectionActions.SELECT_MULTI_ADD,
          payload: { cell, announce, evt },
        } as SelectMultiAddAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, colIdx: cell.colIdx, rows: { "1": 1, "2": 2 } });
        expect(state.api?.begin).toHaveBeenCalledTimes(1);
        expect(announce).toHaveBeenCalledTimes(1);
      });

      it("should call not call begin, but announce return state with added rows, when type is selectMultiAdd, isSelectMultiValues is true and colIdx is not -1", () => {
        state.isSelectMultiValues = true;
        state.firstCell = createCell(2, 1);
        const action = {
          type: SelectionActions.SELECT_MULTI_ADD,
          payload: { cell, announce, evt },
        } as SelectMultiAddAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, colIdx: cell.colIdx, rows: { "1": 1, "2": 2 } });
        expect(state.api?.begin).toHaveBeenCalledTimes(0);
        expect(announce).toHaveBeenCalledTimes(1);
      });

      it("should call select when type is selectMultiEnd, isSelectMultiValues is true and return isSelectMultiValues to be false", () => {
        const action = { type: SelectionActions.SELECT_MULTI_END } as SelectMultiEndAction;
        state.isSelectMultiValues = true;
        const params = ["/qHyperCubeDef", [cell.rowIdx], [cell.colIdx]];

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, isSelectMultiValues: false });
        expect(state.api?.select).toHaveBeenCalledWith({ method: "selectHyperCubeCells", params });
      });

      it("should not call select when type is selectMultiEnd but isSelectMultiValues is false", () => {
        const action = { type: SelectionActions.SELECT_MULTI_END } as SelectMultiEndAction;
        state.isSelectMultiValues = false;

        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, isSelectMultiValues: false });
        expect(state.api?.select).not.toHaveBeenCalled();
      });
    });

    describe("other", () => {
      it("should return state updated when the app is not in selection modal state when action.type is reset", () => {
        const action = { type: SelectionActions.RESET } as ResetAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: {}, colIdx: -1 });
      });

      it("should return state updated with rows when action.type is clear", () => {
        const action = { type: SelectionActions.CLEAR } as ClearAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, rows: {} });
      });

      it("should return state unchanged when the app is in selection modal state and action.type is reset", () => {
        const action = { type: SelectionActions.RESET } as ResetAction;
        (state.api as ExtendedSelectionAPI).isModal = () => true;
        const newState = reducer(state, action);
        expect(newState).toBe(state);
      });

      it("should return state updated with pageRows when action.type is updatePageRows", () => {
        const pageRows = [{} as unknown as Row];
        const action = { type: SelectionActions.UPDATE_PAGE_ROWS, payload: { pageRows } } as UpdatePageRowsAction;
        const newState = reducer(state, action);
        expect(newState).toEqual({ ...state, pageRows });
      });
    });
  });

  describe("handleAnnounceSelectionStatus", () => {
    let announce: Announce;
    let oldRows: Record<string, number>;
    let newRows: Record<string, number>;

    beforeEach(() => {
      announce = jest.fn();
      oldRows = { "1": 1 };
      newRows = { "1": 1 };
    });

    afterEach(() => jest.clearAllMocks());

    it("should announce selected value and one selected value when oldRows.length === newRows.length === 1", () => {
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ["SNTable.SelectionLabel.SelectedValue", "SNTable.SelectionLabel.OneSelectedValue"],
      });
    });

    it("should announce selected value and two selected values when one row is added, 1->2", () => {
      newRows = { "1": 1, "2": 2 };
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ["SNTable.SelectionLabel.SelectedValue", ["SNTable.SelectionLabel.SelectedValues", "2"]],
      });
    });

    it("should announce deselected value and one selected value when one row is removed, 2->1", () => {
      oldRows = { "1": 1, "2": 2 };
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ["SNTable.SelectionLabel.DeselectedValue", "SNTable.SelectionLabel.OneSelectedValue"],
      });
    });

    it("should announce deselected value and two selected values when one row is removed, 3->2", () => {
      oldRows = { "1": 1, "2": 2, "3": 3 };
      newRows = { "1": 1, "2": 2 };
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({
        keys: ["SNTable.SelectionLabel.DeselectedValue", ["SNTable.SelectionLabel.SelectedValues", "2"]],
      });
    });

    it("should announce deselected value and exited selection mode when you have deselected the last value", () => {
      newRows = {};
      announceSelectionStatus(announce, oldRows, newRows);

      expect(announce).toHaveBeenCalledWith({ keys: ["SNTable.SelectionLabel.ExitedSelectionMode"] });
    });
  });

  describe("getSelectedRows", () => {
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

    it("should return array with only the last clicked item when ctrlKey is pressed", () => {
      evt.ctrlKey = true;

      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({ [cell.qElemNumber]: cell.rowIdx });
    });

    it("should return array with only the last clicked item metaKey cm is pressed", () => {
      evt.metaKey = true;

      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({ [cell.qElemNumber]: cell.rowIdx });
    });

    it("should return array with selected item removed if it already was in selectedRows", () => {
      cell.qElemNumber = 1;
      cell.rowIdx = 1;

      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({});
    });
    it("should return array with selected item added if it was not in selectedRows before", () => {
      const updatedSelectedRows = getSelectedRows(selectedRows, cell, evt);
      expect(updatedSelectedRows).toEqual({ 1: 1, [cell.qElemNumber]: cell.rowIdx });
    });
  });

  describe("getMultiSelectedRows", () => {
    let pageRows: Row[];
    let selectedRows: Record<string, number>;
    let cell: Cell;
    let evt: React.KeyboardEvent;
    let firstCell: Cell | undefined;

    beforeEach(() => {
      pageRows = createPageRows(3);
      selectedRows = { "2": 2 };
      cell = createCell(1);
      evt = {} as React.KeyboardEvent;
      firstCell = undefined;
    });

    it("should add the current cell and the next cell to selectedRows when press shift and arrow down key", () => {
      evt.shiftKey = true;
      evt.key = KeyCodes.DOWN;

      const updatedSelectedRows = getMultiSelectedRows(pageRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toEqual({
        ...selectedRows,
        [cell.qElemNumber]: cell.rowIdx,
        "1": 1,
      });
    });

    it("should add the current cell and the next cell to selectedRows when press shift and arrow up key", () => {
      evt.shiftKey = true;
      evt.key = KeyCodes.UP;

      const updatedSelectedRows = getMultiSelectedRows(pageRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toEqual({
        ...selectedRows,
        [cell.qElemNumber]: cell.rowIdx,
        "0": 0,
      });
    });

    it("should return selectedRows unchanged when not shift+arrow but firstCell is undefined", () => {
      const updatedSelectedRows = getMultiSelectedRows(pageRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toBe(selectedRows);
    });

    it("should return rows updated with all rows between firstCell and cell", () => {
      firstCell = createCell(3);
      const updatedSelectedRows = getMultiSelectedRows(pageRows, selectedRows, cell, evt, firstCell);
      expect(updatedSelectedRows).toEqual({ "1": 1, "2": 2, "3": 3 });
    });
  });

  describe("getCellSelectionState", () => {
    let isModal: boolean;
    let cell: Cell;
    let selectionState: SelectionState;

    beforeEach(() => {
      isModal = true;
      cell = {
        qElemNumber: 1,
        selectionColIdx: 1,
      } as Cell;

      selectionState = {
        pageRows: createPageRows(4),
        colIdx: 1,
        rows: { 1: 1 },
        api: {
          isModal: () => isModal,
        } as ExtendedSelectionAPI,
        isSelectMultiValues: false,
      };
    });

    afterEach(() => jest.clearAllMocks());

    it("should return selected when selected", () => {
      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.SELECTED);
    });

    it("should return possible when row is not selected", () => {
      cell.qElemNumber = 2;

      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.POSSIBLE);
    });

    it("should return excluded when colIdx is not in selectionState", () => {
      cell.selectionColIdx = 2;

      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.EXCLUDED);
    });

    it("should return inactive when when isModal is false", () => {
      selectionState.colIdx = -1;
      selectionState.rows = {};
      isModal = false;

      const cellState = getCellSelectionState(cell, selectionState);
      expect(cellState).toEqual(SelectionStates.INACTIVE);
    });
  });
});
