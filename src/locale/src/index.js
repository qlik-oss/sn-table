// eslint-disable-next-line import/no-unresolved
import all from '../all.json';

export default function registerLocale(translator) {
  if (translator && translator.get && translator.add) {
    const t = 'SNTable.Accessibility.RowsAndColumns';
    const g = translator.get(t);

    // if the translated string is different from its id,
    // the translations are assumed to already exist for the current locale
    if (g !== t) {
      return;
    }

    Object.keys(all).forEach((key) => {
      translator.add(all[key]);
    });
  }
}
