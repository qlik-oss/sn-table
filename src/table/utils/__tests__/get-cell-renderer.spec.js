import getCellRenderer from '../get-cell-renderer';
import * as withSelections from '../../components/withSelections';
import * as withColumnStyling from '../../components/withColumnStyling';
import * as withStyling from '../../components/withStyling';

describe('render', () => {
  describe('getCellRenderer', () => {
    let selectionsEnabled;
    let hasColumnStyling;

    beforeEach(() => {
      selectionsEnabled = false;
      hasColumnStyling = false;
      jest.spyOn(withSelections, 'default').mockImplementation(() => jest.fn());
      jest.spyOn(withColumnStyling, 'default').mockImplementation(() => jest.fn());
      jest.spyOn(withStyling, 'default').mockImplementation(() => jest.fn());
    });

    afterEach(() => jest.clearAllMocks());

    it('should call withStyling when selectionsEnabled and hasColumnStyling is false', () => {
      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).toHaveBeenCalledTimes(1);
      expect(withSelections.default).not.toHaveBeenCalled();
      expect(withColumnStyling.default).not.toHaveBeenCalled();
    });
    it('should call withStyling and withSelections when selectionsEnabled is true and hasColumnStyling is false', () => {
      selectionsEnabled = true;

      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).toHaveBeenCalledTimes(1);
      expect(withSelections.default).toHaveBeenCalledTimes(1);
      expect(withColumnStyling.default).not.toHaveBeenCalled();
    });
    it('should call withStyling and withColumnStyling when selectionsEnabled is false and hasColumnStyling is true', () => {
      hasColumnStyling = true;

      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).toHaveBeenCalledTimes(1);
      expect(withColumnStyling.default).toHaveBeenCalledTimes(1);
      expect(withSelections.default).not.toHaveBeenCalled();
    });
    it('should call all with-functions when both selectionsEnabled and hasColumnStyling are true', () => {
      selectionsEnabled = true;
      hasColumnStyling = true;

      getCellRenderer(hasColumnStyling, selectionsEnabled);
      expect(withStyling.default).toHaveBeenCalledTimes(1);
      expect(withColumnStyling.default).toHaveBeenCalledTimes(1);
      expect(withSelections.default).toHaveBeenCalledTimes(1);
    });
  });
});
