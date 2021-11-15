import { expect } from 'chai';
import announcementFactory from '../announcement-factory';

describe('announcement-factory', () => {
  let rootElement;
  let translator;
  let junkCharIdx;
  let announcer;
  let announcerElement01;
  let announcerElement02;
  let previousAnnouncementElement;

  beforeEach(() => {
    announcerElement01 = global.document.createElement('div');
    announcerElement01.setAttribute('id', '#sn-table-announcer--01');
    announcerElement02 = global.document.createElement('div');
    announcerElement02.setAttribute('id', '#sn-table-announcer--02');

    rootElement = {
      querySelector: (query) => {
        if (query === '#sn-table-announcer--01') return announcerElement01;
        else if (query === '#sn-table-announcer--02') return announcerElement02;
        else return announcerElement01;
      },
    };
    translator = { get: (key) => key };
    junkCharIdx = 0;
    previousAnnouncementElement = null;
  });

  it('should render a simple key', () => {
    announcer = announcementFactory(rootElement, translator);
    const key = 'SOME_SIMPLE_KEY';
    announcer({ keys: key });

    expect(announcerElement01.innerHTML).to.be.equal(key);
  });

  it('should render live element with proper attributes', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = 'SOME_SIMPLE_KEY';
    announcer({ keys, shouldBeAtomic: true, politeness: 'assertive' });

    expect(announcerElement01.innerHTML).to.be.equal('SOME_SIMPLE_KEY');
    expect(announcerElement01).to.have.attr('aria-atomic', 'true');
    expect(announcerElement01).to.have.attr('aria-live', 'assertive');
  });

  it('should render multiple keys', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['key#01', 'key#02'];
    announcer({ keys });

    expect(announcerElement01.innerHTML).to.be.equal(keys.join(' '));
  });

  it('should render multiple keys with arguments', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['key#01', ['key#02', 1, 2]];
    announcer({ keys });

    expect(announcerElement01.innerHTML).to.be.equal('key#01 key#02');
  });

  it('should render the junk char in odd function run iterations', () => {
    junkCharIdx = 1;
    announcer = announcementFactory(rootElement, translator, junkCharIdx);
    const keys = 'key#01';
    announcer({ keys });

    expect(announcerElement01.innerHTML).to.be.equal('key#01 ­'); // extra space for the junk char
  });

  it('should be able to handle the cuncurrent announcement', () => {
    previousAnnouncementElement = 'first-announcer-element';
    announcer = announcementFactory(rootElement, translator, 0, previousAnnouncementElement);
    announcer({ keys: ['key#01'] });

    expect(announcerElement02.innerHTML).to.be.equal('key#01');
  });
});
