import getSettings from '../settings';

describe('settings', () => {
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

  describe('styling', () => {
    const { headerSection, contentSection, hoverEffectSection } =
      getSettings(env).items.presentation.items[0].items[0].items;

    describe('headerFontSize/fontSize.change', () => {
      const headerFont = headerSection.items.headerFontItem.items.headerFontWrapper.items.headerFontSize;
      const contentFont = contentSection.items.contentFontItem.items.contentFontWrapper.items.contentFontSize;
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

      it('should not adjust size when in allowed value', () => {
        headerFont.change(data);
        contentFont.change(data);
        expect(data.header.fontSize).toBe(14);
        expect(data.content.fontSize).toBe(14);
      });

      it('should adjust size to 5 when less than 5', () => {
        data.header.fontSize = 3;
        data.content.fontSize = 3;

        headerFont.change(data);
        contentFont.change(data);
        expect(data.header.fontSize).toBe(5);
        expect(data.content.fontSize).toBe(5);
      });

      it('should adjust size to 300 when more than 300', () => {
        data.header.fontSize = 350;
        data.content.fontSize = 350;

        headerFont.change(data);
        contentFont.change(data);
        expect(data.header.fontSize).toBe(300);
        expect(data.content.fontSize).toBe(300);
      });
    });

    describe('hoverColor/hoverFontColor.show', () => {
      const hoverItems = hoverEffectSection.items.hoverEffectItem.items;
      let data;

      beforeEach(() => {
        data = {
          content: {
            hoverEffect: true,
          },
        };
      });

      it('should return true when hoverEffect is true', () => {
        expect(hoverItems.hoverEffectColorItem.show(data)).toBe(true);
        expect(hoverItems.hoverEffectFontColorItem.show(data)).toBe(true);
      });

      it('should return false when hoverEffect is false', () => {
        data.content.hoverEffect = false;

        expect(hoverItems.hoverEffectColorItem.show(data)).toBe(false);
        expect(hoverItems.hoverEffectFontColorItem.show(data)).toBe(false);
      });
    });
  });
});
