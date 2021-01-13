import { getCellStyle, selectCell } from '../selections-factory';

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

  describe('getCellStyle', () => {
    const greenColor = { 'background-color': '#009845' };
    const greyColor = { 'background-color': '#e8e8e8' };
    let selected;
    let cell;

    beforeEach(() => {
      selected = [{ qElemNumber: 1, colIdx: 1, rowIdx: 1 }];
      cell = { qElemNumber: 1, colIdx: 1 };
    });

    it('should return green background when selected', () => {
      const style = getCellStyle(selected, cell, true);
      expect(style).to.eql(greenColor);
    });
    it('should return grey background when not available to select', () => {
      cell.qElemNumber = 2;
      cell.colIdx = 2;

      const style = getCellStyle(selected, cell, true);
      expect(style).to.eql(greyColor);
    });
    it('should return grey background when measure that happens to have the same qElemNumber', () => {
      cell.colIdx = 2;

      const style = getCellStyle(selected, cell, false);
      expect(style).to.eql(greyColor);
    });
    it('should return empty when available to select', () => {
      cell.qElemNumber = 2;

      const style = getCellStyle(selected, cell, true);
      expect(style).to.eql({});
    });
    it('should return empty when measure and no active selections', () => {
      selected = [];

      const style = getCellStyle(selected, cell, false);
      expect(style).to.eql({});
    });
  });

  describe('selectCell', () => {
    let selections;
    let cell;
    let alreadyActive;

    beforeEach(() => {
      alreadyActive = false;
      selections = {
        selected: [],
        setSelected: sinon.spy(),
        api: {
          isActive: () => alreadyActive,
          begin: sinon.spy(),
          select: sinon.spy(),
        },
      };
      cell = { qElemNumber: 1, colIdx: 1, rowIdx: 1 };
    });

    it('should return early when no api', () => {
      selections.api = null;

      selectCell(selections, cell);
      expect(selections.setSelected).to.not.have.been.called;
    });
    it('should return early when wrong columns', () => {
      selections.selected = [{ qElemNumber: 2, colIdx: 2, rowIdx: 1 }];

      selectCell(selections, cell);
      expect(selections.setSelected).to.not.have.been.called;
    });
    it('should not call begin, remove from selected and call resetMadeSelections when same qElemNumber', () => {
      selections.selected = [{ qElemNumber: 1, colIdx: 1, rowIdx: 1 }];
      alreadyActive = true;

      selectCell(selections, cell);
      expect(selections.api.begin).to.not.have.been.called;
      expect(selections.api.select).to.have.been.calledWith({ method: 'resetMadeSelections', params: [] });
      expect(selections.setSelected).to.have.been.calledWith([]);
    });
    it('should call begin, add to selected and call selectHyperCubeCells when selected empty', () => {
      const params = ['/qHyperCubeDef', [cell.rowIdx], [cell.colIdx]];

      selectCell(selections, cell);
      expect(selections.api.begin).to.have.been.called;
      expect(selections.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
      expect(selections.setSelected).to.have.been.calledWith([cell]);
    });

    it('should not call begin, add to selected and call selectHyperCubeCells when selecting new qElemNumber', () => {
      selections.selected = [{ qElemNumber: 2, colIdx: 1, rowIdx: 2 }];
      alreadyActive = true;
      const params = ['/qHyperCubeDef', [2, 1], [cell.colIdx]];

      selectCell(selections, cell);
      expect(selections.api.begin).to.not.have.been.called;
      expect(selections.api.select).to.have.been.calledWith({ method: 'selectHyperCubeCells', params });
    });
  });
});
