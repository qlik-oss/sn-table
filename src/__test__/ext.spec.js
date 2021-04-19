import { expect } from 'chai';
import ext, { indexAdded, indexRemoved, min, getDescription } from '../ext';

describe('ext', () => {
  const env = {
    translator: {
      get: sinon.spy(),
    },
  };
  let array;
  let index;

  describe('definition', () => {
    const { definition } = ext(env);

    describe('dimension/measure properties', () => {
      const dimensionItems = definition.items.data.items.dimensions.items;

      describe('visibilityCondition.isExpression', () => {
        let val;

        beforeEach(() => {
          val = 'someExpresison';
        });

        it('should return true for valid expression', () => {
          const isExpression = dimensionItems.visibilityCondition.isExpression(val);
          expect(isExpression).to.be.true;
        });

        it('should return false for non string', () => {
          val = 1;

          const isExpression = dimensionItems.visibilityCondition.isExpression(val);
          expect(isExpression).to.be.false;
        });

        it('should return false for string only containing white space', () => {
          val = ' ';

          const isExpression = dimensionItems.visibilityCondition.isExpression(val);
          expect(isExpression).to.be.false;
        });
      });

      describe('textAlign.show', () => {
        let data;

        beforeEach(() => {
          data = {
            qDef: {
              textAlign: {
                auto: false,
              },
            },
          };
        });

        it('should return true when auto is false', () => {
          const show = dimensionItems.textAlign.show(data);
          expect(show).to.be.true;
        });

        it('should return false when auto is true', () => {
          data.qDef.textAlign.auto = true;

          const show = dimensionItems.textAlign.show(data);
          expect(show).to.be.false;
        });

        it('should return false when textAlign is undefined', () => {
          data.qDef.textAlign = undefined;
          const show = dimensionItems.textAlign.show(data);
          expect(show).to.be.false;
        });
      });
    });

    describe('styling', () => {
      const stylingItems = definition.items.settings.items.presentation.items[0].items[0].items.chart.items;

      describe('headerFontSize/fontSize.change', () => {
        let data;

        beforeEach(() => {
          data = {
            header: {
              fontSize: 14,
            },
            content: {
              fontSize: 14,
            },
          };
        });

        it('should not change size when in allowed value', () => {
          stylingItems.headerFontSize.change(data);
          stylingItems.fontSize.change(data);
          expect(data.header.fontSize).to.equal(14);
          expect(data.content.fontSize).to.equal(14);
        });

        it('should change size to 5 when less than 5', () => {
          data.header.fontSize = 3;
          data.content.fontSize = 3;

          stylingItems.headerFontSize.change(data);
          stylingItems.fontSize.change(data);
          expect(data.header.fontSize).to.equal(5);
          expect(data.content.fontSize).to.equal(5);
        });

        it('should change size to 300 when more than 300', () => {
          data.header.fontSize = 350;
          data.content.fontSize = 350;

          stylingItems.headerFontSize.change(data);
          stylingItems.fontSize.change(data);
          expect(data.header.fontSize).to.equal(300);
          expect(data.content.fontSize).to.equal(300);
        });
      });

      describe('hoverColor/hoverFontColor.show', () => {
        let data;

        beforeEach(() => {
          data = {
            content: {
              hoverEffect: true,
            },
          };
        });

        it('should return true when hoverEffect is true', () => {
          expect(stylingItems.hoverColor.show(data)).to.be.true;
        });

        it('should return true when hoverEffect is true', () => {
          data.content.hoverEffect = false;

          expect(stylingItems.hoverColor.show(data)).to.be.false;
        });
      });
    });
  });

  describe('indexAdded', () => {
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
  });

  describe('min', () => {
    it('should return 0 when > 0', () => {
      expect(min(3)).to.equal(0);
    });

    it('should return 1 when not > 0', () => {
      expect(min(0)).to.equal(1);
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
