import addEventListeners from '../event-listeners';

describe('event-listeners', () => {
  describe('addEventListeners', () => {
    let alreadyActive = true;
    const onFunctions = {};
    let el;
    let selectionsApi;
    let remover;

    beforeEach(() => {
      el = {
        addEventListener: (type, onFn) => {
          onFunctions[type] = onFn;
        },
        removeEventListener: sinon.spy(),
      };
      selectionsApi = {
        isActive: () => alreadyActive,
        confirm: sinon.spy(),
      };
      remover = addEventListeners(el, selectionsApi);
    });

    it('should add eventlisteners for mousedown and mouseup', () => {
      expect(onFunctions.mousedown).to.be.a('function');
      expect(onFunctions.mouseup).to.be.a('function');
    });
    it('should return function that removes event listeners', () => {
      remover();
      expect(el.removeEventListener).to.have.been.calledWith('mousedown');
      expect(el.removeEventListener).to.have.been.calledWith('mouseup');
    });

    describe('onMouseDown', () => {
      let e;

      beforeEach(() => {
        alreadyActive = true;
        e = {
          target: {
            clientWidth: 1000,
            className: 'excluded',
          },
          offsetX: 500,
          stopPropagation: sinon.spy(),
        };
      });

      it('should not call stopPropagation nor confirm when selections are not active', () => {
        alreadyActive = false;

        onFunctions.mousedown(e);
        onFunctions.mouseup(e);
        expect(e.stopPropagation).to.not.have.been.called;
        expect(selectionsApi.confirm).to.not.have.been.called;
      });
      it('should not call stopPropagation nor confirm when clicking selectable cell', () => {
        e.target.className = 'possible';

        onFunctions.mousedown(e);
        onFunctions.mouseup(e);
        expect(e.stopPropagation).to.not.have.been.called;
        expect(selectionsApi.confirm).to.not.have.been.called;
      });
      it('should not call stopPropagation nor confirm when clicking on scrollbar (scrollbarDown = true)', () => {
        e.offsetX = 1100;

        onFunctions.mousedown(e);
        onFunctions.mouseup(e);
        expect(e.stopPropagation).to.not.have.been.called;
        expect(selectionsApi.confirm).to.not.have.been.called;
      });
      it('should call stopPropagation and confirm when selections are active and clicking on non-selectable element', () => {
        onFunctions.mousedown(e);
        onFunctions.mouseup(e);
        expect(e.stopPropagation).to.have.been.calledOnce;
        expect(selectionsApi.confirm).to.have.been.calledOnce;
      });
    });
  });
});
