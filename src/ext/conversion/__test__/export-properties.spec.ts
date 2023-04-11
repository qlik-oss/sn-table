import { Align, ColumnWidthType, PropTree } from '../../../types';
import exportProperties, { getColumnWidth, getColumnWidths } from '../export-properties';

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

  describe('getColumnWidth', () => {
    let colIdx;

    it('should get the correct columnWidth for the dimension', () => {
      colIdx = 0;
      const columnWidth = getColumnWidth(colIdx, qDimensions, qMeasures);
      expect(columnWidth).toEqual(-1);
    });

    it('should get the correct columnWidth for the first measure', () => {
      colIdx = 1;
      const columnWidth = getColumnWidth(colIdx, qDimensions, qMeasures);
      expect(columnWidth).toEqual(200);
    });

    it('should get the correct columnWidth for the second measure', () => {
      colIdx = 2;
      const columnWidth = getColumnWidth(colIdx, qDimensions, qMeasures);
      expect(columnWidth).toEqual(-1);
    });
  });

  describe('getColumnWidths', () => {
    it('should get correct columnWidths when no qColumnOrder provided', () => {
      const columnWidths = getColumnWidths(qDimensions, qMeasures);
      expect(columnWidths).toEqual([-1, 200, -1]);
    });

    it('should get correct columnWidths when qColumnOrder provided', () => {
      const qColumnOrder = [1, 2, 0];
      const columnWidths = getColumnWidths(qDimensions, qMeasures, qColumnOrder);
      expect(columnWidths).toEqual([200, -1, -1]);
    });
  });

  describe('exportProperties', () => {
    const propertyTree = {
      qChildren: [],
      qProperty: {
        qHyperCubeDef: {
          qDimensions,
          qMeasures,
        },
      },
    } as unknown as PropTree;
    const hyperCubePath = undefined;

    const expFormat = exportProperties(propertyTree, hyperCubePath);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(expFormat.properties.qHyperCubeDef.columnWidths).toEqual([-1, 200, -1]);
  });
});
