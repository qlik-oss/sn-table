import { getSelectionClasses, selectCell } from '../selections-factory';

describe('selections-factory', () => {
  // describe('initSelections', () => {
  //   it('should return selections object with correct properties', () => {
  //     const selections = initSelections();

  //     expect(Object.keys(selections).length).to.be(5);
  //     expect(selections.api).to.be.an('object');
  //     expect(selections.getCellStyle).to.be.a('function');
  //     expect(selections.selectCell).to.be.a('function');
  //     expect(selections.selected).to.be.an('array');
  //     expect(selections.setSelected).to.be.a('function');
  //   });

  //   it('should set selected when running setSelected', () => {
  //     const someSelection = [{ qElemNumber: 0, rowIdx: 0, colIdx: 0 }];

  //     const selections = initSelections();
  //     selections.setSelected(someSelection);
  //     expect(selections.selected).to.equal(someSelection);
  //   });
  // });

  describe('getSelectionClasses', () => {
    let selected;
    let cell;

    beforeEach(() => {
      selected = { colIdx: 1, rows: [{ qElemNumber: 1, rowIdx: 1 }] };
      cell = { qElemNumber: 1, colIdx: 1 };
    });

    it('should return green background when selected', () => {
      const classes = getSelectionClasses(selected, cell);
      expect(classes).to.equal('sn-table-selected');
    });
    it('should return grey background when not available to select', () => {
      cell.qElemNumber = 2;
      cell.colIdx = 2;

      const classes = getSelectionClasses(selected, cell);
      expect(classes).to.equal('sn-table-excluded');
    });
    it('should return grey background when other column that happens to have the same qElemNumber', () => {
      cell.colIdx = 2;

      const classes = getSelectionClasses(selected, cell);
      expect(classes).to.equal('sn-table-excluded');
    });
    it('should return empty when available to select', () => {
      cell.qElemNumber = 2;

      const classes = getSelectionClasses(selected, cell);
      expect(classes).to.equal('');
    });
    it('should return empty when no active selections', () => {
      selected = { rows: [] };

      const classes = getSelectionClasses(selected, cell);
      expect(classes).to.eql('');
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
