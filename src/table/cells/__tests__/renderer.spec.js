import getCellRenderer from '../renderer';
import withSelections from '../selections';

describe.only('render', () => {
  describe('getCellRenderer', () => {
    const sandbox = sinon.createSandbox();
    let column;
    let selectionsEnabled;
    const selectionsWrappper = { withSelections };

    beforeEach(() => {
      column = {};
      selectionsEnabled = false;
      sandbox.replace(selectionsWrappper, 'withSelections', () => console.log('yay'));
    });

    afterEach(() => {
      sandbox.verifyAndRestore();
    });

    it('should call api.on and api removeListener for all listeners', () => {
      selectionsEnabled = true;
      getCellRenderer(column, selectionsEnabled);
    });
  });
});
