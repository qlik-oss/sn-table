const stylingPanel = {
  type: "items",
  items: [
    {
      component: "styling-panel",
      chartTitle: "Object.StraightTable",
      subtitle: "LayerStyleEditor.component.styling",
      translation: "LayerStyleEditor.component.styling",
      ref: "components",
      useGeneral: true,
      defaultValue: [],
      items: {
        headerSection: {
          translation: "properties.Header",
          component: "panel-section",
          items: {
            headerFontItem: {
              component: "items",
              ref: "components",
              key: "theme",
              items: {
                headerFontWrapper: {
                  component: "inline-wrapper",
                  items: {
                    headerFontSize: {
                      component: "integer",
                      ref: "header.fontSize",
                      translation: "properties.fontSize",
                      width: 9,
                      min: 5,
                      max: 300,
                      defaultValue(item, data, args) {
                        const currentTheme = args.theme.current();
                        return parseInt(
                          currentTheme.object?.straightTableV2?.header?.fontSize ?? currentTheme.fontSize,
                          10,
                        );
                      },
                      change(data) {
                        data.header.fontSize = !data.header.fontSize
                          ? data.header.fontSize
                          : Math.max(5, Math.min(300, Math.floor(data.header.fontSize)));
                      },
                    },
                    headerFontColor: {
                      show: true,
                      ref: "header.fontColor",
                      type: "object",
                      component: "color-picker",
                      defaultValue(item, data, args) {
                        const currentTheme = args.theme.current();
                        return { color: currentTheme.object?.straightTableV2?.header?.color ?? currentTheme.color };
                      },
                      dualOutput: true,
                    },
                  },
                },
              },
            },
          },
        },
        contentSection: {
          component: "panel-section",
          translation: "properties.Content",
          items: {
            contentFontItem: {
              component: "items",
              ref: "components",
              key: "theme",
              items: {
                contentFontWrapper: {
                  component: "inline-wrapper",
                  items: {
                    contentFontSize: {
                      component: "integer",
                      ref: "content.fontSize",
                      translation: "properties.fontSize",
                      width: 9,
                      min: 5,
                      max: 300,
                      defaultValue(item, data, args) {
                        const currentTheme = args.theme.current();
                        return parseInt(
                          currentTheme.object?.straightTableV2?.content?.fontSize ?? currentTheme.fontSize,
                          10,
                        );
                      },
                      change(data) {
                        data.content.fontSize = !data.content.fontSize
                          ? data.content.fontSize
                          : Math.max(5, Math.min(300, Math.floor(data.content.fontSize)));
                      },
                    },
                    contentFontColor: {
                      ref: "content.fontColor",
                      type: "object",
                      component: "color-picker",
                      defaultValue(item, data, args) {
                        const currentTheme = args.theme.current();
                        return { color: currentTheme.object?.straightTableV2?.content?.color ?? currentTheme.color };
                      },
                      dualOutput: true,
                    },
                  },
                },
              },
            },
          },
        },
        hoverEffectSection: {
          translation: "properties.RowHover",
          component: "panel-section",
          items: {
            hoverEffectItem: {
              component: "items",
              ref: "components",
              key: "theme",
              items: {
                hoverEffectSwitch: {
                  ref: "content.hoverEffect",
                  translation: "ThemeStyleEditor.style.hoverEffect",
                  type: "boolean",
                  component: "switch",
                  options: [
                    {
                      value: true,
                      translation: "properties.on",
                    },
                    {
                      value: false,
                      translation: "properties.off",
                    },
                  ],
                  defaultValue: false,
                },
                hoverEffectColorItem: {
                  show(data) {
                    return data?.content?.hoverEffect;
                  },
                  ref: "content.hoverColor",
                  translation: "ThemeStyleEditor.style.hoverStyle",
                  type: "object",
                  component: "color-picker",
                  dualOutput: true,
                },
                hoverEffectFontColorItem: {
                  show(data) {
                    return data?.content?.hoverEffect;
                  },
                  ref: "content.hoverFontColor",
                  translation: "ThemeStyleEditor.style.hoverFontStyle",
                  type: "object",
                  component: "color-picker",
                  dualOutput: true,
                },
              },
            },
          },
        },
      },
    },
  ],
};

const getTotals = (env) => ({
  type: "items",
  items: [
    {
      ref: "totals.show",
      type: "boolean",
      translation: "properties.totals",
      component: "switch",
      options: [
        {
          value: true,
          translation: "Common.Auto",
        },
        {
          value: false,
          translation: "Common.Custom",
        },
      ],
      defaultValue: true,
    },
    {
      ref: "totals.position",
      translation: "Common.Position",
      type: "string",
      component: "dropdown",
      options: [
        {
          value: "noTotals",
          translation: "Common.None",
        },
        {
          value: "top",
          translation: "Common.Top",
        },
        {
          value: "bottom",
          translation: "Common.Bottom",
        },
      ],
      defaultValue: "noTotals",
      show(data) {
        return !data.totals.show;
      },
    },
    {
      ref: "totals.label",
      translation: "properties.totals.label",
      type: "string",
      expression: "optional",
      defaultValue() {
        return env.translator.get("Object.Table.Totals");
      },
    },
  ],
  show: !env?.anything?.sense?.isUnsupportedFeature?.("totals"),
});

const getChartExploration = (env) =>
  env.flags.isEnabled("PS_18291_TABLE_EXPLORATION") && {
    chartExploration: {
      type: "items",
      translation: "properties.chartExploration",
      items: {
        chartExplorationToggler: {
          type: "items",
          component: "chart-exploration-toggler",
          translation: "properties.enableChartExploration",
          ref: "enableChartExploration",
        },
        visibilityToggler: {
          show: (itemData) => itemData.enableChartExploration,
          component: "buttongroup",
          translation: "properties.ChartExploration.VisibilityOption",
          ref: "chartExploration.menuVisibility",
          options: [
            {
              value: "auto",
              translation: "Common.Auto",
            },
            {
              value: "minimized",
              translation: "properties.ChartExploration.Minimized",
            },
          ],
        },
      },
      // straight table that has chart exploration enabled and is placed inside a container
      // should not show Chart exploration in the property panel
      show: (itemData) => !itemData.insideContainer,
    },
  };

const getUsePagination = () => ({
  ref: "usePagination",
  translation: "properties.usePagination",
  type: "boolean",
  component: "checkbox",
  defaultValue: false,
});

const getSettings = (env) => ({
  uses: "settings",
  items: {
    presentation: {
      grouped: true,
      type: "items",
      translation: "properties.presentation",
      items: [stylingPanel, getTotals(env), getUsePagination()],
    },
    ...getChartExploration(env),
  },
});

export default getSettings;
