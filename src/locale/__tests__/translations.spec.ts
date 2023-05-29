import registerLocale from '../src/index';
import all from '../all.json';
import { ExtendedTranslator } from '../../types';

describe('translations', () => {
  describe('registerLocale', () => {
    let translator: ExtendedTranslator;
    beforeEach(() => {
      translator = {
        language: jest.fn(),
        get: () => 'SNTable.Accessibility.RowsAndColumns',
        add: jest.fn(),
      };
    });

    it('Should call add for every key', () => {
      registerLocale(translator);
      expect(translator.add).toHaveBeenCalledTimes(Object.keys(all).length);
    });

    it('Should early return when translation is different from id', () => {
      translator.get = () => 'someTranslation';
      registerLocale(translator);
      expect(translator.add).not.toHaveBeenCalled();
    });
  });
});
