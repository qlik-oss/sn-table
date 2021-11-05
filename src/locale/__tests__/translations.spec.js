import registerLocale from '../src/index';
// eslint-disable-next-line import/no-unresolved
import all from '../all.json';

describe('translations', () => {
  describe('registerLocale', () => {
    let translator;
    beforeEach(() => {
      translator = {
        get: (t) => t === 'SNTable.Accessibility.RowsAndColumns' && 'SNTable.Accessibility.RowsAndColumns',
        add: sinon.spy(),
      };
    });

    it('Should not add anything when translator is not passed', () => {
      registerLocale();
      expect(translator.add).to.not.have.been.called;
    });

    it('Should not add anything when get is undefined', () => {
      translator.get = undefined;
      registerLocale(translator);
      expect(translator.add).to.not.have.been.called;
    });

    it('Should early return when translation is different from id', () => {
      translator.get = () => 'somexTranslation';
      registerLocale(translator);
      expect(translator.add).to.not.have.been.called;
    });

    it('Should call add for every key', () => {
      registerLocale(translator);
      expect(translator.add).to.have.callCount(Object.keys(all).length);
    });
  });
});
