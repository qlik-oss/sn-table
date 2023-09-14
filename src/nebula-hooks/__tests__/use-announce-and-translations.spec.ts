import { Announce, ExtendedTranslator } from '../../types';
import { announcementFactory } from '../use-announce-and-translations';

describe('announcementFactory', () => {
  let rootElement: HTMLElement;
  let translator: ExtendedTranslator;
  let announcer: Announce;
  let announcerElement01: HTMLElement;
  let announcerElement02: HTMLElement;
  let previousAnnouncementElement: string;
  let junkChar: string;

  beforeEach(() => {
    announcerElement01 = global.document.createElement('div');
    announcerElement01.setAttribute('class', '.sn-table-announcer-1');
    announcerElement02 = global.document.createElement('div');
    announcerElement02.setAttribute('class', '.sn-table-announcer-2');

    rootElement = {
      querySelector: (query: string) => {
        if (query === '.sn-table-announcer-1') return announcerElement01;
        if (query === '.sn-table-announcer-2') return announcerElement02;
        return announcerElement01;
      },
    } as HTMLElement;
    translator = { get: (key) => key } as ExtendedTranslator;
    previousAnnouncementElement = '';
    junkChar = ' ­';
  });

  it('should render a simple key', () => {
    announcer = announcementFactory(rootElement, translator);
    const key = ['SOME_SIMPLE_KEY'];
    announcer({ keys: key });

    expect(announcerElement01.innerHTML).toBe(`${key}${junkChar}`);
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should render live element with proper attributes', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['SOME_SIMPLE_KEY'];
    announcer({ keys, shouldBeAtomic: true, politeness: 'assertive' });

    expect(announcerElement01.innerHTML).toBe(`${keys}${junkChar}`);
    expect(announcerElement01.getAttribute('aria-atomic')).toBe('true');
    expect(announcerElement01.getAttribute('aria-live')).toBe('assertive');
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should render multiple keys', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['key#01', 'key#02'];
    announcer({ keys });

    expect(announcerElement01.innerHTML).toBe(`${keys.join(' ')}${junkChar}`);
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should render multiple keys with arguments', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['key#01', ['key#02', '1', '2']];
    announcer({ keys });

    expect(announcerElement01.innerHTML).toBe(`key#01 key#02${junkChar}`);
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should render the junk char in odd function run iterations', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['key#01'];
    announcer({ keys });

    expect(announcerElement01.innerHTML).toBe(`${keys[0]}${junkChar}`); // extra space for the junk char
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should be able to handle the concurrent announcement', () => {
    const keys = ['key#01'];
    previousAnnouncementElement = 'first-announcer-element';
    announcer = announcementFactory(rootElement, translator, previousAnnouncementElement);
    announcer({ keys });

    expect(announcerElement02.innerHTML).toBe(`${keys[0]}${junkChar}`);
  });

  it('should remove junkChar if the current announce element has it', () => {
    const keys = ['key#01'];
    announcerElement01.innerHTML = `${keys[0]}${junkChar}`;
    announcer = announcementFactory(rootElement, translator);
    announcer({ keys });

    expect(announcerElement01.innerHTML).toBe(keys[0]);
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });
});
