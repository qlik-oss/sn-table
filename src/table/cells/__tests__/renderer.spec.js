import TableCell from '@material-ui/core/TableCell';
import getCellRenderer from '../renderer';
import selections from '../selections';

describe('render', () => {
  describe('getCellRenderer', () => {
    const sandbox = sinon.createSandbox();
    let column;
    let selectionsEnabled;

    beforeEach(() => {
      column = {};
      selectionsEnabled = false;
      sandbox.replace(selections, 'withSelections', sandbox.spy());
    });

    afterEach(() => {
      sandbox.verifyAndRestore();
    });

    it('should return table cell when selectionsEnabled is false', () => {
      expect(getCellRenderer(column, selectionsEnabled)).to.equal(TableCell);
    });
    it('should return table cell when selectionsEnabled is false', () => {
      selectionsEnabled = true;

      getCellRenderer(column, selectionsEnabled);
      expect(selections.withSelections).to.have.been.calledOnce;
    });
  });
});
