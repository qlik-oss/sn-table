import { Align, ColumnWidthType, PropTree } from '../../../types';
import exportProperties, { getColumnWidth } from '../exportProperties';

describe('exportProperties', () => {
  describe('getColumnWidth', () => {
    let colIdx;
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

  describe('exportProperties', () => {
    const propertyTree = {
      qChildren: [],
      qProperty: {
        qHyperCubeDef: {
          qDimensions: [
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
            },
          ],
          qMeasures: [
            {
              qDef: {
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
            },
          ],
        },
      },
    } as unknown as PropTree;
    const hyperCubePath = undefined;

    const expFormat = exportProperties(propertyTree, hyperCubePath);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(expFormat.properties.qHyperCubeDef.columnWidths).toEqual([-1, 200]);
  });
});
