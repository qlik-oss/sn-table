import all from '../all.json';

export default function autoRegister(translator) {
  if (translator && translator.get && translator.add) {
    const t = '';
    const g = translator.get(t);
    // if translated string is different from its id
    // assume translations already exists for current locale
    if (g !== t) {
      return;
    }

    Object.keys(all).forEach((key) => {
      translator.add(all[key]);
    });
  }
}
