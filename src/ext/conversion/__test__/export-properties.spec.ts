import { Align, ColumnWidthType, PropTree } from '../../../types';
import exportProperties, { getColumnWidths } from '../export-properties';

describe('exportProperties', () => {
  const qDimensions = [
    {
      qDef: {
        textAlign: {
          auto: true,
          align: 'left' as Align,
        },
        columnWidth: {
          type: 'auto' as ColumnWidthType,
          pixels: 200,
          percentage: 20,
        },
      },
      qAttributeExpressions: [],
    },
    {
      qDef: {
        textAlign: {
          auto: true,
          align: 'left' as Align,
        },
        columnWidth: {
          type: 'pixels' as ColumnWidthType,
        },
      },
      qAttributeExpressions: [],
    },
  ];
  const qMeasures = [
    {
      qDef: {
        qDef: '',
        textAlign: {
          auto: true,
          align: 'left' as Align,
        },
        columnWidth: {
          type: 'pixels' as ColumnWidthType,
          pixels: 200,
          percentage: 20,
        },
      },
      qAttributeExpressions: [],
    },
    {
      qDef: {
        qDef: '',
        textAlign: {
          auto: true,
          align: 'left' as Align,
        },
        columnWidth: {
          type: 'FitToContent' as ColumnWidthType,
          pixels: 200,
          percentage: 20,
        },
      },
      qAttributeExpressions: [],
    },
  ];

  describe('getColumnWidths', () => {
    it('should get correct columnWidths when no qColumnOrder provided', () => {
      const columnWidths = getColumnWidths(qDimensions, qMeasures);
      expect(columnWidths).toEqual([-1, 200, 200, -1]);
    });

    it('should get correct columnWidths when qColumnOrder provided', () => {
      const qColumnOrder = [1, 2, 0, 3];
      const columnWidths = getColumnWidths(qDimensions, qMeasures, qColumnOrder);
      expect(columnWidths).toEqual([200, 200, -1, -1]);
    });
  });

  describe('exportProperties', () => {
    const propertyTree = {
      qChildren: [],
      qProperty: {
        qHyperCubeDef: {
          qDimensions,
          qMeasures,
          qColumnOrder: [0, 2, 1],
          columnOrder: [0, 2, 1],
        },
      },
    } as unknown as PropTree;
    const hyperCubePath = undefined;

    const expFormat = exportProperties(propertyTree, hyperCubePath);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(expFormat.properties.qHyperCubeDef.columnWidths).toEqual([-1, 200, 200, -1]);
    expect(
      expFormat.properties.qLayoutExclude.quarantine.straightTableColumnWidths['qHyperCubeDef.columnWidths']
    ).toEqual([-1, 200, 200, -1]);
    expect(
      expFormat.properties.qLayoutExclude.quarantine.straightTableColumnOrder['qHyperCubeDef.qColumnOrder']
    ).toEqual([0, 2, 1]);
    expect(
      expFormat.properties.qLayoutExclude.quarantine.straightTableColumnOrder['qHyperCubeDef.columnOrder']
    ).toEqual([0, 2, 1]);
  });
});
