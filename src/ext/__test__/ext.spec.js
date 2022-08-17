import ext from '..';

describe('ext', () => {
  const env = {
    translator: {
      get: jest.fn(),
    },
  };

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
          expect(isExpression).toBe(true);
        });

        it('should return false for non string', () => {
          val = 1;

          const isExpression = dimensionItems.visibilityCondition.isExpression(val);
          expect(isExpression).toBe(false);
        });

        it('should return false for string only containing white space', () => {
          val = ' ';

          const isExpression = dimensionItems.visibilityCondition.isExpression(val);
          expect(isExpression).toBe(false);
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
          expect(show).toBe(true);
        });

        it('should return false when auto is true', () => {
          data.qDef.textAlign.auto = true;

          const show = dimensionItems.textAlign.show(data);
          expect(show).toBe(false);
        });

        it('should return false when textAlign is undefined', () => {
          data.qDef.textAlign = undefined;
          const show = dimensionItems.textAlign.show(data);
          expect(show).toBe(false);
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
          expect(data.header.fontSize).toBe(14);
          expect(data.content.fontSize).toBe(14);
        });

        it('should change size to 5 when less than 5', () => {
          data.header.fontSize = 3;
          data.content.fontSize = 3;

          stylingItems.headerFontSize.change(data);
          stylingItems.fontSize.change(data);
          expect(data.header.fontSize).toBe(5);
          expect(data.content.fontSize).toBe(5);
        });

        it('should change size to 300 when more than 300', () => {
          data.header.fontSize = 350;
          data.content.fontSize = 350;

          stylingItems.headerFontSize.change(data);
          stylingItems.fontSize.change(data);
          expect(data.header.fontSize).toBe(300);
          expect(data.content.fontSize).toBe(300);
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
          expect(stylingItems.hoverColor.show(data)).toBe(true);
          expect(stylingItems.hoverFontColor.show(data)).toBe(true);
        });

        it('should return false when hoverEffect is false', () => {
          data.content.hoverEffect = false;

          expect(stylingItems.hoverColor.show(data)).toBe(false);
          expect(stylingItems.hoverFontColor.show(data)).toBe(false);
        });
      });
    });
  });
});
