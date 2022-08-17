const getStyleSettings = (env) => {
  return [
    {
      type: 'items',
      items: [
        {
          component: 'style-editor',
          translation: 'LayerStyleEditor.component.styling',
          subtitle: 'LayerStyleEditor.component.styling',
          resetBtnTranslation: 'LayerStyleEditor.component.resetAll',
          key: 'theme',
          ref: 'components',
          defaultValue: [], // used by chart conversion
          defaultValues: {
            // used by style editor
            key: 'theme',
            content: {
              fontSize: null,
              fontColor: {
                index: -1,
                color: null,
              },
              hoverEffect: false,
              hoverColor: {
                index: -1,
                color: null,
              },
              hoverFontColor: {
                index: -1,
                color: null,
              },
            },
            header: {
              fontSize: null,
              fontColor: {
                index: -1,
                color: null,
              },
            },
          },
          items: {
            chart: {
              type: 'items',
              items: {
                headerFontSize: {
                  show: true,
                  ref: 'header.fontSize',
                  translation: 'ThemeStyleEditor.style.headerFontSize',
                  component: 'integer',
                  // placeholder: () => parseInt(styleService.getStyle('header', 'fontSize'), 10),
                  maxlength: 3,
                  change(data) {
                    data.header.fontSize = Math.max(5, Math.min(300, Math.floor(data.header.fontSize)));
                  },
                },
                headerFontColor: {
                  show: true,
                  ref: 'header.fontColor',
                  translation: 'ThemeStyleEditor.style.headerFontColor',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
                fontSize: {
                  show: true,
                  translation: 'ThemeStyleEditor.style.cellFontSize',
                  ref: 'content.fontSize',
                  component: 'integer',
                  // placeholder: () => parseInt(styleService.getStyle('content', 'fontSize'), 10),
                  maxlength: 3,
                  change(data) {
                    data.content.fontSize = Math.max(5, Math.min(300, Math.floor(data.content.fontSize)));
                  },
                },
                fontColor: {
                  show: true,
                  ref: 'content.fontColor',
                  translation: 'ThemeStyleEditor.style.cellFontColor',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
                hoverEffect: {
                  show: true,
                  ref: 'content.hoverEffect',
                  translation: 'ThemeStyleEditor.style.hoverEffect',
                  type: 'boolean',
                  component: 'switch',
                  options: [
                    {
                      value: true,
                      translation: 'properties.on',
                    },
                    {
                      value: false,
                      translation: 'properties.off',
                    },
                  ],
                },
                hoverColor: {
                  show: (data) => !!data.content.hoverEffect,
                  ref: 'content.hoverColor',
                  translation: 'ThemeStyleEditor.style.hoverStyle',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
                hoverFontColor: {
                  show: (data) => !!data.content.hoverEffect,
                  ref: 'content.hoverFontColor',
                  translation: 'ThemeStyleEditor.style.hoverFontStyle',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
              },
            },
          },
        },
      ],
    },
    {
      type: 'items',
      items: [
        {
          ref: 'totals.show',
          type: 'boolean',
          translation: 'properties.totals',
          component: 'switch',
          options: [
            {
              value: true,
              translation: 'Common.Auto',
            },
            {
              value: false,
              translation: 'Common.Custom',
            },
          ],
          defaultValue: true,
        },
        {
          ref: 'totals.position',
          translation: 'Common.Position',
          type: 'string',
          component: 'dropdown',
          options: [
            {
              value: 'noTotals',
              translation: 'Common.None',
            },
            {
              value: 'top',
              translation: 'Common.Top',
            },
            {
              value: 'bottom',
              translation: 'Common.Bottom',
            },
          ],
          defaultValue: 'noTotals',
          show(data) {
            return !data.totals.show;
          },
        },
        {
          ref: 'totals.label',
          translation: 'properties.totals.label',
          type: 'string',
          expression: 'optional',
          defaultValue() {
            return env.translator.get('Object.Table.Totals');
          },
        },
      ],
      show: !env?.anything?.sense?.isUnsupportedFeature?.('totals'),
    },
  ];
};

const settings = (env) => {
  return {
    uses: 'settings',
    items: {
      presentation: {
        grouped: true,
        type: 'items',
        translation: 'properties.presentation',
        items: getStyleSettings(env),
      },
    },
  };
};

export default settings;
