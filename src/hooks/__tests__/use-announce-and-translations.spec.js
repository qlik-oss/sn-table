import { announcementFactory } from '../use-announce-and-translations';

describe('announcement-factory', () => {
  let rootElement;
  let translator;
  let announcer;
  let announcerElement01;
  let announcerElement02;
  let previousAnnouncementElement;
  let junkChar;

  beforeEach(() => {
    announcerElement01 = global.document.createElement('div');
    announcerElement01.setAttribute('id', '#sn-table-announcer--01');
    announcerElement02 = global.document.createElement('div');
    announcerElement02.setAttribute('id', '#sn-table-announcer--02');

    rootElement = {
      querySelector: (query) => {
        if (query === '#sn-table-announcer--01') return announcerElement01;
        if (query === '#sn-table-announcer--02') return announcerElement02;
        return announcerElement01;
      },
    };
    translator = { get: (key) => key };
    previousAnnouncementElement = null;
    junkChar = ' ­';
  });

  it('should render a simple key', () => {
    announcer = announcementFactory(rootElement, translator);
    const key = 'SOME_SIMPLE_KEY';
    announcer({ keys: key });

    expect(announcerElement01.innerHTML).toBe(`${key}${junkChar}`);
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should render live element with proper attributes', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = 'SOME_SIMPLE_KEY';
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
    const keys = ['key#01', ['key#02', 1, 2]];
    announcer({ keys });

    expect(announcerElement01.innerHTML).toBe(`key#01 key#02${junkChar}`);
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should render the junk char in odd function run iterations', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = 'key#01';
    announcer({ keys });

    expect(announcerElement01.innerHTML).toBe(`${keys}${junkChar}`); // extra space for the junk char
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });

  it('should be able to handle the concurrent announcement', () => {
    previousAnnouncementElement = 'first-announcer-element';
    announcer = announcementFactory(rootElement, translator, previousAnnouncementElement);
    announcer({ keys: ['key#01'] });

    expect(announcerElement02.innerHTML).toBe(`key#01${junkChar}`);
  });

  it('should remove junkChar if the current announce element has it', () => {
    const keys = 'key#01';
    announcerElement01.innerHTML = `${keys}${junkChar}`;
    announcer = announcementFactory(rootElement, translator);
    announcer({ keys });

    expect(announcerElement01.innerHTML).toBe(keys);
    expect(announcerElement02.innerHTML).toHaveLength(0);
  });
});
