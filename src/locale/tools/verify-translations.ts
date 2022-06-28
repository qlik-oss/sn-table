// eslint-disable-next-line @typescript-eslint/no-var-requires
const all = require('../all.json');

const languages = [
  'en-US',
  'it-IT',
  'zh-CN',
  'zh-TW',
  'ko-KR',
  'de-DE',
  'sv-SE',
  'es-ES',
  'pt-BR',
  'ja-JP',
  'fr-FR',
  'nl-NL',
  'tr-TR',
  'pl-PL',
  'ru-RU',
];

Object.keys(all).forEach((key) => {
  const supportLanguagesForString = Object.keys(all[key].locale);
  // en-US must exist
  if (supportLanguagesForString.indexOf('en-US') === -1)
    throw new Error(`String '${all[key].id}' is missing value for 'en-US'`);

  for (let i = 0; i < languages.length; i++) {
    if (supportLanguagesForString.indexOf(languages[i]) === -1)
      // eslint-disable-next-line no-console
      console.warn(`String '${all[key].id}' is missing value for '${languages[i]}'`);
  }
});
