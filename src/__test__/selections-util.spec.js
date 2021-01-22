import { getSelectionStyle, selectCell } from '../selections-utils';

describe('selections-utils', () => {
  describe('getSelectionStyle', () => {
    let selected;
    let cell;

    beforeEach(() => {
      selected = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }] };
      cell = { qElemNumber: 1, colIdx: 1 };
    });

    it('should return green background and selected class name when selected', () => {
      const { style, identifyerClass } = getSelectionStyle(selected, cell);
      expect(style.backgroundColor).to.equal('#009845');
      expect(identifyerClass).to.equal('selected');
    });
    it('should return grey background and excluded class name when not available to select', () => {
      cell.qElemNumber = 2;
      cell.colIdx = 2;

      const { style, identifyerClass } = getSelectionStyle(selected, cell);
      expect(style.backgroundColor).to.equal('#e8e8e8');
      expect(identifyerClass).to.equal('excluded');
    });
    it('should return grey background and excluded class name when other column that happens to have the same qElemNumber', () => {
      cell.colIdx = 2;

      const { style, identifyerClass } = getSelectionStyle(selected, cell);
      expect(style.backgroundColor).to.equal('#e8e8e8');
      expect(identifyerClass).to.equal('excluded');
    });
    it('should return no style and possible class name when available to select', () => {
      cell.qElemNumber = 2;

      const { style, identifyerClass } = getSelectionStyle(selected, cell);
      expect(style).to.equal(undefined);
      expect(identifyerClass).to.equal('possible');
    });
    it('should return no style and possible class name when no active selections', () => {
      selected = { rows: [] };

      const { style, identifyerClass } = getSelectionStyle(selected, cell);
      expect(style).to.equal(undefined);
      expect(identifyerClass).to.equal('possible');
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
