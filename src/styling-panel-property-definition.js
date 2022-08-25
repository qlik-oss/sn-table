const stylingPanelDefinition = {
  component: 'styling-panel',
  chartTitle: 'Object.StraightTable',
  translation: 'LayerStyleEditor.component.styling',
  subtitle: 'LayerStyleEditor.component.styling',
  ref: 'components',
  useGeneral: true,
  key: 'theme',
  defaultValue: [],
  items: {
    headerSection: {
      translation: 'properties.Header',
      component: 'panel-section',
      items: {
        headerFontItem: {
          component: 'items',
          ref: 'components',
          key: 'general',
          items: {
            headerFontWrapper: {
              component: 'inline-wrapper',
              items: {
                headerFontSize: {
                  component: 'integer',
                  ref: 'header.fontSize',
                  type: 'integer',
                  width: 9,
                  min: 5,
                  max: 300,
                  // placeholder: () => parseInt(styleService.getStyle('header', 'fontSize'), 10), // Not sure about placeholder, as qlik-oss do not have theme integrated in it
                  change(data) {
                    data.header.fontSize = !data.header.fontSize
                      ? data.header.fontSize
                      : Math.max(5, Math.min(300, Math.floor(data.header.fontSize)));
                  },
                },
                headerFontColor: {
                  show: true,
                  ref: 'header.fontColor',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
              },
            },
          },
        },
      },
    },
    contentSection: {
      component: 'panel-section',
      translation: 'properties.Content',
      items: {
        contentFontItem: {
          component: 'items',
          ref: 'components',
          key: 'general',
          items: {
            contentFontWrapper: {
              component: 'inline-wrapper',
              items: {
                contentFontSize: {
                  component: 'integer',
                  ref: 'content.fontSize',
                  type: 'integer',
                  width: 9,
                  min: 5,
                  max: 300,
                  // placeholder: () => parseInt(styleService.getStyle('content', 'fontSize'), 10), // Not sure about placeholder, as qlik-oss do not have theme integrated in it
                  change(data) {
                    data.content.fontSize = !data.content.fontSize
                      ? data.content.fontSize
                      : Math.max(5, Math.min(300, Math.floor(data.content.fontSize)));
                  },
                },
                contentFontColor: {
                  ref: 'content.fontColor',
                  type: 'object',
                  component: 'color-picker',
                  dualOutput: true,
                },
              },
            },
          },
        },
      },
    },
    hoverEffectSection: {
      translation: 'properties.RowHover',
      component: 'panel-section',
      items: {
        hoverEffectItem: {
          component: 'items',
          ref: 'components',
          key: 'general',
          items: {
            hoverEffectSwitch: {
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
              defaultValue: false,
            },
            hoverEffectColorItem: {
              show(data) {
                return data?.content?.hoverEffect;
              },
              ref: 'content.hoverColor',
              translation: 'ThemeStyleEditor.style.hoverStyle',
              type: 'object',
              component: 'color-picker',
              dualOutput: true,
            },
            hoverEffectFontColorItem: {
              show(data) {
                return data?.content?.hoverEffect;
              },
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
  },
};

const stylingEditorDefinition = {
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
};

export { stylingPanelDefinition, stylingEditorDefinition };
