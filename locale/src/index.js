import all from '../all.json';

export default function registerLocale(translator) {
  if (translator && translator.get && translator.add) {
    const t = 'SNTable.Accessibility.RowsAndColumns';
    const g = translator.get(t);

    // if the translated string is different from its id,
    // we assume the translations already exist for current locale
    if (g !== t) {
      return;
    }

    Object.keys(all).forEach((key) => {
      translator.add(all[key]);
    });
  }
}
