import getSettings from "../settings";

describe("settings", () => {
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

  describe("styling", () => {
    const { headerSection, contentSection, hoverEffectSection } =
      getSettings(env).items.presentation.items[0].items[0].items;

    describe("headerFontSize/fontSize.change", () => {
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

      it("should not adjust size when in allowed value", () => {
        headerFont.change(data);
        contentFont.change(data);
        expect(data.header.fontSize).toBe(14);
        expect(data.content.fontSize).toBe(14);
      });

      it("should adjust size to 5 when less than 5", () => {
        data.header.fontSize = 3;
        data.content.fontSize = 3;

        headerFont.change(data);
        contentFont.change(data);
        expect(data.header.fontSize).toBe(5);
        expect(data.content.fontSize).toBe(5);
      });

      it("should adjust size to 300 when more than 300", () => {
        data.header.fontSize = 350;
        data.content.fontSize = 350;

        headerFont.change(data);
        contentFont.change(data);
        expect(data.header.fontSize).toBe(300);
        expect(data.content.fontSize).toBe(300);
      });
    });

    describe("headerFontSize/fontSize/headerFontColor/fontColor.defaultValue", () => {
      const { headerFontSize, headerFontColor } = headerSection.items.headerFontItem.items.headerFontWrapper.items;
      const { contentFontSize, contentFontColor } = contentSection.items.contentFontItem.items.contentFontWrapper.items;
      let args;
      let themeJson;
      const object = {
        straightTableV2: {
          header: {
            fontSize: "16px",
            color: "#000000",
          },
          content: {
            fontSize: "10px",
            color: "#222222",
          },
        },
      };

      beforeEach(() => {
        themeJson = { fontSize: "14px", color: "#4d4d4d" };
        args = {
          theme: {
            current: () => themeJson,
          },
        };
      });

      it("gets correct default font sizes", () => {
        const hfs = headerFontSize.defaultValue({}, {}, args);
        const cfs = contentFontSize.defaultValue({}, {}, args);
        expect(hfs).toBe(14);
        expect(cfs).toBe(14);
      });

      it("gets correct default font sizes with specific straightTableV2 theming", () => {
        themeJson.object = object;
        const hfs = headerFontSize.defaultValue({}, {}, args);
        const cfs = contentFontSize.defaultValue({}, {}, args);
        expect(hfs).toBe(16);
        expect(cfs).toBe(10);
      });

      it("gets correct default font colors", () => {
        const hfc = headerFontColor.defaultValue({}, {}, args);
        const cfc = contentFontColor.defaultValue({}, {}, args);
        expect(hfc).toStrictEqual({ color: "#4d4d4d" });
        expect(cfc).toStrictEqual({ color: "#4d4d4d" });
      });

      it("gets correct default font colors with specific straightTableV2 theming", () => {
        themeJson.object = object;
        const hfc = headerFontColor.defaultValue({}, {}, args);
        const cfc = contentFontColor.defaultValue({}, {}, args);
        expect(hfc).toStrictEqual({ color: "#000000" });
        expect(cfc).toStrictEqual({ color: "#222222" });
      });
    });

    describe("hoverColor/hoverFontColor.show", () => {
      const hoverItems = hoverEffectSection.items.hoverEffectItem.items;
      let data;

      beforeEach(() => {
        data = {
          content: {
            hoverEffect: true,
          },
        };
      });

      it("should return true when hoverEffect is true", () => {
        expect(hoverItems.hoverEffectColorItem.show(data)).toBe(true);
        expect(hoverItems.hoverEffectFontColorItem.show(data)).toBe(true);
      });

      it("should return false when hoverEffect is false", () => {
        data.content.hoverEffect = false;

        expect(hoverItems.hoverEffectColorItem.show(data)).toBe(false);
        expect(hoverItems.hoverEffectFontColorItem.show(data)).toBe(false);
      });
    });
  });
});
