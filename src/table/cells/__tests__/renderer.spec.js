import TableCell from '@material-ui/core/TableCell';
import getCellRenderer from '../renderer';
import * as withSelections from '../selections';

describe('render', () => {
  describe('getCellRenderer', () => {
    const sandbox = sinon.createSandbox();
    let column;
    let selectionsEnabled;

    beforeEach(() => {
      column = {};
      selectionsEnabled = false;
      sandbox.replace(withSelections, 'default', sandbox.spy());
    });

    afterEach(() => {
      sandbox.verifyAndRestore();
    });

    it('should return TablCell when selectionsEnabled is false', () => {
      expect(getCellRenderer(column, selectionsEnabled)).to.equal(TableCell);
    });
    it('should call withSelections when selectionsEnabled is true', () => {
      selectionsEnabled = true;

      getCellRenderer(column, selectionsEnabled);
      expect(withSelections.default).to.have.been.calledOnce;
    });
  });
});
