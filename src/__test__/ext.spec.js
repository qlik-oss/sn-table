import ext, { indexAdded, indexRemoved, min, getDescription } from '../ext';

describe('ext', () => {
  const env = {
    translator: {
      get: sinon.spy(),
    },
  };

  describe('indexAdded', () => {
    let array;
    let index;

    it('should add index in the end of array', () => {
      array = [0, 1];
      index = 2;

      indexAdded(array, index);
      expect(array).to.eql([0, 1, 2]);
    });

    it('should add index in the end of array and increment elements that are >= index', () => {
      array = [1, 0, 2];
      index = 1;

      indexAdded(array, index);
      expect(array).to.eql([2, 0, 3, 1]);
    });
  });

  describe('indexRemoved', () => {
    let array;
    let index;

    it('should remove index from the array', () => {
      array = [0, 2, 1];
      index = 2;

      indexRemoved(array, index);
      expect(array).to.eql([0, 1]);
    });

    it('should remove index the array and decrement', () => {
      array = [1, 2, 0, 3];
      index = 2;

      indexRemoved(array, index);
      expect(array).to.eql([1, 0, 2]);
    });

    describe('min', () => {
      it('should return 0 when > 0', () => {
        expect(min(3)).to.equal(0);
      });

      it('should return 1 when not > 0', () => {
        expect(min(0)).to.equal(1);
      });
    });
  });

  describe('description', () => {
    it('should call translator', () => {
      getDescription(env);
      expect(env.translator.get).to.have.been.calledWith('Visualizations.Descriptions.Column');
    });
  });

  describe('data', () => {
    const { data } = ext(env);
    let hcHandler;

    beforeEach(() => {
      hcHandler = {
        hcProperties: {
          qColumnOrder: [0, 1],
          columnWidths: [1, 1],
        },
        getDimensions: () => [{}],
        getMeasures: () => [{}],
      };
    });

    describe('measure', () => {
      const { measures } = data;

      describe('add', () => {
        it('should update columnWidths', () => {
          measures.add(null, null, hcHandler);
          expect(hcHandler.hcProperties.columnWidths).to.eql([1, 1, -1]);
        });
      });

      describe('remove', () => {
        it('should update columnWidths', () => {
          measures.remove(null, null, hcHandler, 1);
          expect(hcHandler.hcProperties.columnWidths).to.eql([1]);
        });
      });

      describe('dimensions', () => {
        const { dimensions } = data;

        describe('add', () => {
          it('should update columnWidths', () => {
            dimensions.add(null, null, hcHandler);
            expect(hcHandler.hcProperties.columnWidths).to.eql([-1, 1, 1]);
          });
        });

        describe('remove', () => {
          it('should update columnWidths', () => {
            dimensions.remove(null, null, hcHandler, 1);
            expect(hcHandler.hcProperties.columnWidths).to.eql([1]);
          });
        });
      });
    });
  });
});
