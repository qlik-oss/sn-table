import { expect } from 'chai';
import announcementFactory from '../announcement-factory';

describe('announcement-factory', () => {
  let rootElement;
  let translator;
  let junkCharIdx;
  let announcer;
  let announcerElement;

  beforeEach(() => {
    announcerElement = global.document.createElement('div');
    announcerElement.setAttribute('id', '#sn-table-announcer');

    rootElement = { querySelector: () => announcerElement };
    translator = { get: (key) => key };
    junkCharIdx = 0;
  });

  it('should render a simple key', () => {
    announcer = announcementFactory(rootElement, translator);
    const key = 'SOME_SIMPLE_KEY';
    announcer({ keys: key });

    expect(announcerElement.innerHTML).to.be.equal(key);
  });

  it('should render live element with proper attributes', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = 'SOME_SIMPLE_KEY';
    announcer({ keys, shouldBeAtomic: true, politeness: 'assertive' });

    expect(announcerElement.innerHTML).to.be.equal('SOME_SIMPLE_KEY');
    expect(announcerElement).to.have.attr('aria-atomic', 'true');
    expect(announcerElement).to.have.attr('aria-live', 'assertive');
  });

  it('should render multiple keys', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['key#01', 'key#02'];
    announcer({ keys });

    expect(announcerElement.innerHTML).to.be.equal(keys.join(' '));
  });

  it('should render multiple keys with arguments', () => {
    announcer = announcementFactory(rootElement, translator);
    const keys = ['key#01', ['key#02', 1, 2]];
    announcer({ keys });

    expect(announcerElement.innerHTML).to.be.equal('key#01 key#02');
  });

  it('should render the junk char in odd function run iterations', () => {
    junkCharIdx = 1;
    announcer = announcementFactory(rootElement, translator, junkCharIdx);
    const keys = 'key#01';
    announcer({ keys });

    expect(announcerElement.innerHTML).to.be.equal('key#01 ­');
  });
});
