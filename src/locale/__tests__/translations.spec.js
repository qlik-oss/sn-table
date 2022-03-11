import registerLocale from '../src/index';
// eslint-disable-next-line import/no-unresolved
import all from '../all.json';

describe('translations', () => {
  describe('registerLocale', () => {
    let translator;
    beforeEach(() => {
      translator = {
        get: (t) => t === 'SNTable.Accessibility.RowsAndColumns' && 'SNTable.Accessibility.RowsAndColumns',
        add: jest.fn(),
      };
    });

    it('Should not add anything when translator is not passed', () => {
      registerLocale();
      expect(translator.add).not.toHaveBeenCalled();
    });

    it('Should not add anything when get is undefined', () => {
      translator.get = undefined;
      registerLocale(translator);
      expect(translator.add).not.toHaveBeenCalled();
    });

    it('Should early return when translation is different from id', () => {
      translator.get = () => 'someTranslation';
      registerLocale(translator);
      expect(translator.add).not.toHaveBeenCalled();
    });

    it('Should call add for every key', () => {
      registerLocale(translator);
      expect(translator.add).toHaveBeenCalledTimes(Object.keys(all).length);
    });
  });
});
