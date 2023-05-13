import { stardust } from '@nebula.js/stardust';

import registerLocale from '../src/index';
import all from '../all.json';

describe('translations', () => {
  describe('registerLocale', () => {
    let translator: stardust.Translator;
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
