import handleScroll from '../handle-scroll';

describe('handle-scroll', () => {
  let evt;
  let tableSection;

  beforeEach(() => {
    evt = {
      stopPropagation: sinon.spy(),
      preventDefault: sinon.spy(),
      deltaX: -1,
    };
    tableSection = {
      current: {
        scrollWidth: 2327,
        offsetWidth: 958,
        scrollLeft: 0,
      },
    };
  });

  it('should run preventDefault when scroll to leftmost place', () => {
    handleScroll(evt, tableSection);
    expect(evt.stopPropagation).have.been.calledOnce;
    expect(evt.preventDefault).have.been.calledOnce;
  });

  it('should not run preventDefault when not scroll to leftmost place', () => {
    tableSection.current.scrollLeft = 1369;
    handleScroll(evt, tableSection);
    expect(evt.stopPropagation).have.been.calledOnce;
    expect(evt.preventDefault).not.have.been.called;
  });
});
