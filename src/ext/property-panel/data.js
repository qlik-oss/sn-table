import Modifiers from 'qlik-modifiers';
import { ColumnWidthTypes, MAX_COLUMN_PERCENTAGE_WIDTH, MAX_COLUMN_WIDTH } from '../../table/constants';

const columnCommonHidden = {
  autoSort: {
    ref: 'qDef.autoSort',
    type: 'boolean',
    defaultValue: true,
    show: false,
  },
};

const columnExpressionItems = {
  visibilityCondition: {
    type: 'string',
    component: 'expression',
    ref: 'qCalcCondition.qCond',
    expression: 'optional',
    expressionType: 'ValueExpr',
    translation: 'Object.Table.Columns.VisibilityCondition',
    defaultValue: { qv: '' },
    tid: 'visibilityCondition',
    isExpression: (val) => typeof val === 'string' && val.trim().length > 0,
  },
  tableCellColoring: {
    component: 'attribute-expression-reference',
    defaultValue: [],
    ref: 'qAttributeExpressions',
    items: [
      {
        component: 'expression',
        ref: 'qExpression',
        expressionType: 'measure',
        translation: 'Object.Table.Measure.BackgroundExpression',
        defaultValue: '',
        id: 'cellBackgroundColor',
        tid: 'tableColorBgByExpression',
      },
      {
        component: 'expression',
        ref: 'qExpression',
        expressionType: 'measure',
        translation: 'Object.Table.Measure.ForegroundExpression',
        defaultValue: '',
        id: 'cellForegroundColor',
        tid: 'tableColorByExpression',
      },
    ],
  },
};

const textAlignItems = {
  textAlignAuto: {
    ref: 'qDef.textAlign.auto',
    type: 'boolean',
    component: 'switch',
    translation: 'Common.Text.TextAlignment',
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
  textAlign: {
    ref: 'qDef.textAlign.align',
    type: 'string',
    component: 'item-selection-list',
    horizontal: true,
    items: [
      {
        component: 'icon-item',
        icon: 'align_left',
        labelPlacement: 'bottom',
        value: 'left',
        translation: 'properties.dock.left',
      },
      {
        component: 'icon-item',
        icon: 'align_center',
        labelPlacement: 'bottom',
        value: 'center',
        translation: 'Common.Center',
      },
      {
        component: 'icon-item',
        icon: 'align_right',
        labelPlacement: 'bottom',
        value: 'right',
        translation: 'properties.dock.right',
      },
    ],
    defaultValue: 'left',
    show: (data) => data.qDef.textAlign !== undefined && !data.qDef.textAlign.auto,
  },
};

const getTotalsAggr = (env) => ({
  type: 'items',
  grouped: true,
  items: {
    totalsAggrGroup: {
      type: 'items',
      items: {
        totalsAggrFunc: {
          type: 'string',
          component: 'dropdown',
          ref: 'qDef.qAggrFunc',
          translation: 'Object.Table.AggrFunc',
          options(data, handler) {
            const hasActiveModifiers = Modifiers.hasActiveModifiers({
              measures: [data],
              properties: handler.properties,
            });
            const enableTotal = !hasActiveModifiers || Modifiers.ifEnableTotalsFunction(data);
            const autoOption = enableTotal
              ? [
                  {
                    value: 'Expr',
                    translation: 'Common.Auto',
                  },
                ]
              : [];
            return autoOption.concat([
              {
                value: 'Avg',
                translation: 'Object.Table.AggrFunc.Avg',
              },
              {
                value: 'Count',
                translation: 'Object.Table.AggrFunc.Count',
              },
              {
                value: 'Max',
                translation: 'Object.Table.AggrFunc.Max',
              },
              {
                value: 'Min',
                translation: 'Object.Table.AggrFunc.Min',
              },
              {
                value: 'Sum',
                translation: 'Object.Table.AggrFunc.Sum',
              },
              {
                value: 'None',
                translation: 'Object.Table.AggrFunc.None',
              },
            ]);
          },
          defaultValue: env?.anything?.sense?.isUnsupportedFeature?.('totals') ? 'None' : 'Expr',
        },
      },
    },
  },
  show: !env?.anything?.sense?.isUnsupportedFeature?.('totals'),
});

const getColumnResize = (env) =>
  env.flags.isEnabled('PS_18291_SN_TABLE_BASIC_FEATURES')
    ? {
        type: {
          type: 'string',
          component: 'dropdown',
          ref: 'qDef.columnWidth.type',
          translation: 'Object.Table.Column.ResizeType',
          options: [
            {
              value: ColumnWidthTypes.FILL,
              translation: 'Object.Table.Column.Fill',
            },
            {
              value: ColumnWidthTypes.HUG,
              translation: 'Object.Table.Column.Hug',
            },
            {
              value: ColumnWidthTypes.PIXELS,
              translation: 'Object.Table.Column.Pixels',
            },
            {
              value: ColumnWidthTypes.PERCENTAGE,
              translation: 'Object.Table.Column.Percentage',
            },
          ],
          defaultValue: ColumnWidthTypes.FILL,
        },
        sizePixels: {
          ref: 'qDef.columnWidth.pixels',
          translation: 'Object.Table.Column.PixelWidth',
          type: 'number',
          expression: 'optional',
          defaultValue: 200,
          show: (data) => data.qDef.columnWidth?.type === ColumnWidthTypes.PIXELS,
          change(data) {
            data.qDef.columnWidth.pixels =
              data.qDef.columnWidth.pixels === undefined
                ? data.qDef.columnWidth.pixels
                : Math.max(1, Math.min(MAX_COLUMN_WIDTH, data.qDef.columnWidth.pixels));
          },
        },
        sizePercentage: {
          ref: 'qDef.columnWidth.percentage',
          translation: 'Object.Table.Column.PercentageWidth',
          type: 'number',
          expression: 'optional',
          defaultValue: 20,
          show: (data) => data.qDef.columnWidth?.type === ColumnWidthTypes.PERCENTAGE,
          change(data) {
            data.qDef.columnWidth.percentage =
              data.qDef.columnWidth.percentage === undefined
                ? data.qDef.columnWidth.percentage
                : Math.max(1, Math.min(MAX_COLUMN_PERCENTAGE_WIDTH, data.qDef.columnWidth.percentage));
          },
        },
      }
    : {};

const getData = (env) =>
  env.flags.isEnabled('PS_18291_TABLE_EXPLORATION')
    ? {
        type: 'items',
        translation: 'Common.Data',
        component: 'data-assets-panel',
        items: {},
      }
    : {
        type: 'items',
        component: 'columns',
        translation: 'Common.Data',
        sortIndexRef: 'qHyperCubeDef.qColumnOrder',
        allowMove: true,
        allowAdd: true,
        addTranslation: 'Common.Columns',
        items: {
          dimensions: {
            type: 'array',
            component: 'expandable-items',
            ref: 'qHyperCubeDef.qDimensions',
            grouped: true,
            items: {
              libraryId: {
                type: 'string',
                component: 'library-item',
                libraryItemType: 'dimension',
                ref: 'qLibraryId',
                translation: 'Common.Dimension',
                show(itemData) {
                  return itemData.qLibraryId;
                },
              },
              inlineDimension: {
                component: 'inline-dimension',
                show(itemData) {
                  return !itemData.qLibraryId;
                },
              },
              nullSuppression: {
                type: 'boolean',
                ref: 'qNullSuppression',
                defaultValue: false,
                translation: 'properties.dimensions.showNull',
                inverted: true,
              },
              ...columnCommonHidden,
              ...columnExpressionItems,
              ...textAlignItems,
              ...getColumnResize(env),
            },
          },
          measures: {
            type: 'array',
            component: 'expandable-items',
            ref: 'qHyperCubeDef.qMeasures',
            grouped: true,
            items: {
              libraryId: {
                type: 'string',
                component: 'library-item',
                libraryItemType: 'measure',
                ref: 'qLibraryId',
                translation: 'Common.Measure',
                show: (itemData) => itemData.qLibraryId,
              },
              inlineMeasure: {
                component: 'inline-measure',
                show: (itemData) => !itemData.qLibraryId,
              },
              ...columnCommonHidden,
              ...columnExpressionItems,
              ...textAlignItems,
              totalsAggr: getTotalsAggr(env),
              ...getColumnResize(env),
            },
          },
        },
      };

export default getData;
