import getData from '../data';

describe('ext', () => {
  const mockFlags = {
    PS_18291_TABLE_EXPLORATION: true,
  };
  const env = {
    translator: {
      get: jest.fn(),
    },
    flags: {
      isEnabled: (flag) => mockFlags[flag],
    },
  };

  describe('definition', () => {
    describe('Test current data assets panel', () => {
      mockFlags.PS_18291_TABLE_EXPLORATION = false;

      const { items } = getData(env);

      describe('dimension/measure properties', () => {
        const dimensionItems = items.dimensions.items;

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
    });
    describe('Test new data assets panel', () => {
      mockFlags.PS_18291_TABLE_EXPLORATION = true;
      const { component } = getData(env);
      it('should render data assets panel', () => {
        expect(component).toEqual('data-assets-panel');
      });
    });
  });
});
