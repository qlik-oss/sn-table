import { getSelectionClass, selectCell } from '../selections-utils';

describe('selections-utils', () => {
  describe('getSelectionStyle', () => {
    let selected;
    let cell;

    beforeEach(() => {
      selected = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }] };
      cell = { qElemNumber: 1, colIdx: 1 };
    });

    it('should return selected when selected', () => {
      const selectionClass = getSelectionClass(selected, cell);
      expect(selectionClass).to.equal('selected');
    });
    it('should return excluded when other column', () => {
      cell.qElemNumber = 2;
      cell.colIdx = 2;

      const selectionClass = getSelectionClass(selected, cell);
      expect(selectionClass).to.equal('excluded');
    });
    it('should return excluded when other column that happens to have the same qElemNumber', () => {
      cell.colIdx = 2;

      const selectionClass = getSelectionClass(selected, cell);
      expect(selectionClass).to.equal('excluded');
    });
    it('should return possible when active and available to select', () => {
      cell.qElemNumber = 2;

      const selectionClass = getSelectionClass(selected, cell);
      expect(selectionClass).to.equal('possible');
    });
    it('should return possible when no active selections', () => {
      selected = { rows: [] };

      const selectionClass = getSelectionClass(selected, cell);
      expect(selectionClass).to.equal('possible');
    });
  });

  describe('selectCell', () => {
    let selections;
    let cell;
    let alreadyActive;

    beforeEach(() => {
      alreadyActive = false;
      selections = {
        selected: { rows: [] },
        setSelected: sinon.spy(),
        api: {
          isActive: () => alreadyActive,
          begin: sinon.spy(),
          select: sinon.spy(),
          cancel: sinon.spy(),
        },
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 };
    });

    it('should not call begin, remove from selected.rows and call cancel when same qElemNumber', () => {
      selections.selected = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }] };
      alreadyActive = true;

      selectCell(selections, cell);
      expect(selections.api.begin).to.not.have.been.called;
      expect(selections.api.cancel).to.have.been.calledOnce;
      expect(selections.setSelected).to.have.been.calledWith({ rows: [] });
    });
    it('should call begin, add to selected and call selectHyperCubeCells when selected empty', () => {
      const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];

      selectCell(selections, cell);
      expect(selections.api.begin).to.have.been.called;
      expect(selections.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selections.setSelected).to.have.been.calledWith({
        colIdx: cell.colIdx,
        rows: [{ qElemNumber: 1, rowIdx: 1 }],
      });
    });
    it('should not call begin, add to selected and call selectHyperCubeCells when selecting new qElemNumber', () => {
      selections.selected = { colIdx: 1, rows: [{ qElemNumber: 2, rowIdx: 2 }] };
      alreadyActive = true;
      const params = ['/qHyperCubeDef', [2, 1], [cell.colIdx]];

      selectCell(selections, cell);
      expect(selections.api.begin).to.not.have.been.called;
      expect(selections.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selections.setSelected).to.have.been.calledWith({
        colIdx: cell.colIdx,
        rows: [
          { qElemNumber: 2, rowIdx: 2 },
          { qElemNumber: 1, rowIdx: 1 },
        ],
      });
    });
  });
});
