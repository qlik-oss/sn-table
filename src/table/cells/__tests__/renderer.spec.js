import getCellRenderer from '../renderer';
import * as withSelections from '../withSelections';
import * as withColumnStyling from '../withColumnStyling';
import * as withStyling from '../withStyling';

describe('render', () => {
  describe('getCellRenderer', () => {
    const sandbox = sinon.createSandbox();
    let selectionsEnabled;
    let hasColumnStyling;

    beforeEach(() => {
      selectionsEnabled = false;
      hasColumnStyling = false;
      sandbox.replace(withSelections, 'default', sandbox.spy());
      sandbox.replace(withColumnStyling, 'default', sandbox.spy());
      sandbox.replace(withStyling, 'default', sandbox.spy());
    });

    afterEach(() => {
      sandbox.verifyAndRestore();
    });

    it('should call withStyling when selectionsEnabled and hasColumnStyling is false', () => {
      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).to.have.been.calledOnce;
      expect(withSelections.default).to.not.have.been.called;
      expect(withColumnStyling.default).to.not.have.been.called;
    });
    it('should call withStyling and withSelections when selectionsEnabled is true and hasColumnStyling is false', () => {
      selectionsEnabled = true;

      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).to.have.been.calledOnce;
      expect(withSelections.default).to.have.been.calledOnce;
      expect(withColumnStyling.default).to.not.have.been.called;
    });
    it('should call withStyling and withColumnStyling when selectionsEnabled is false and hasColumnStyling is true', () => {
      hasColumnStyling = true;

      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).to.have.been.calledOnce;
      expect(withColumnStyling.default).to.have.been.calledOnce;
      expect(withSelections.default).to.not.have.been.called;
    });
    it('should call all with-functions when both selectionsEnabled and hasColumnStyling are true', () => {
      selectionsEnabled = true;
      hasColumnStyling = true;

      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).to.have.been.calledOnce;
      expect(withColumnStyling.default).to.have.been.calledOnce;
      expect(withSelections.default).to.have.been.calledOnce;
    });
  });
});
