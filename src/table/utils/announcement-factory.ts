import { Translator, AnnouncementArgs } from '../../types';

/**
 * Enum for announcement elements
 * @readonly
 * @enum {string}
 */
const announcerElements = {
  first: 'first-announcer-element',
  second: 'second-announcer-element',
};

/**
 * creates the function for announcement
 *
 * @param {Element} rootElement root element for getting the live aria from it
 * @param {Translator} translator translator object
 * @param {?string} prevAnnounceEl for test reasons
 *
 * @returns {function} announce function
 */
export default function announcementFactory(rootElement: Element, translator: Translator, prevAnnounceEl?: string) {
  let previousAnnouncementElement = prevAnnounceEl || null;

  /**
   * the announce function
   *
   * @param {Object} announcementArgs configuration object for announcement
   * @param {string|Array<string|Array<string|number>} announcementArgs.keys translation keys, that could be a string (single key), an array of strings (for concatenating multiple keys), or a 2-dimensional array with arguments for translations, e.g. `{ keys: ['some string key', ['some other string key', arg1, arg2, ...]] }`
   * @param {boolean=} announcementArgs.shouldBeAtomic defines the live element should be atomic or not
   * @param {('polite'|'assertive'|'off')=} announcementArgs.politeness the assertive level of the live element
   */
  return ({ keys, shouldBeAtomic = true, politeness = 'polite' }: AnnouncementArgs) => {
    const stringKeys = Array.isArray(keys) ? keys : [keys];

    const notation = stringKeys
      .map((key) => {
        if (Array.isArray(key)) {
          const [actualKey, ...rest] = key;
          return translator.get(actualKey, rest);
        }
        return translator.get(key);
      })
      .join(' ');

    const announceElement01 = rootElement.querySelector('#sn-table-announcer--01');
    const announceElement02 = rootElement.querySelector('#sn-table-announcer--02');

    let announceElement;

    if (previousAnnouncementElement === announcerElements.first) {
      announceElement = announceElement02;
      previousAnnouncementElement = announcerElements.second;
    } else {
      announceElement = announceElement01;
      previousAnnouncementElement = announcerElements.first;
    }

    if (announceElement) {
      announceElement.innerHTML = announceElement.innerHTML.endsWith(` ­`) ? notation : `${notation} ­`;

      announceElement.setAttribute('aria-atomic', shouldBeAtomic.toString());
      announceElement.setAttribute('aria-live', politeness);
    }
  };
}
