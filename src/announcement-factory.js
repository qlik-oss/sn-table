export default function announcementFactory(rootElement, translator) {
  let hasJunkChar = 0;

  /**
   * this resulted function could recive a 2 dimentional array like:
   * { keys: ['some string key', ['some other string key', [arg1, arg2, ...]]] }
   * and it will get the proper translated string for you
   */
  return ({ keys, shouldBeAtomic = true, politeness = 'polite' }) => {
    const stringKeys = Array.isArray(keys) ? keys : [keys];
    let notation = '';

    stringKeys.forEach((key) => {
      if (Array.isArray(key)) {
        const [actualKey, ...rest] = key;
        notation += ' ' + translator.get(actualKey, ...rest);
      } else notation += ' ' + translator.get(key);
    });

    if (hasJunkChar % 2) notation += ` ­`;
    hasJunkChar++;

    const announceElement = rootElement.querySelector('#sn-table-announcer');
    announceElement.innerHTML = notation;
    announceElement.setAttribute('aria-atomic', shouldBeAtomic);
    announceElement.setAttribute('aria-alive', politeness);
  };
}
