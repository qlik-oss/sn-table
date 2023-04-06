/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Align, ColumnWidthType, ExportFormat } from '../../../types';
import importProperties, { getColumnInfo } from '../importProperties';

describe('importProperties', () => {
  describe('getColumnInfo', () => {
    const columnInfo = [
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
            type: 'auto' as ColumnWidthType,
            pixels: 200,
            percentage: 20,
          },
        },
        qAttributeExpressions: [],
      },
    ];
    const index = 0;

    it('should get the correct columnInfo given columnWidths with -1', () => {
      const columnWidths = [-1, -1];
      let newColumnInfo = getColumnInfo(columnInfo, index, columnWidths);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ type: 'fitToContent' });

      newColumnInfo = getColumnInfo(columnInfo, 1, columnWidths, 1);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ type: 'fitToContent' });
    });

    it('should get the correct columnInfo given columnWidths with pixels', () => {
      const columnWidths = [300, 20];
      let newColumnInfo = getColumnInfo(columnInfo, index, columnWidths);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ pixels: 300, type: 'pixels' });

      newColumnInfo = getColumnInfo(columnInfo, 1, columnWidths, 1);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ pixels: 20, type: 'pixels' });
    });

    it('should get the correct columnInfo given columnWidths with -1 and pixels', () => {
      const columnWidths = [400, -1];
      let newColumnInfo = getColumnInfo(columnInfo, index, columnWidths);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ pixels: 400, type: 'pixels' });

      newColumnInfo = getColumnInfo(columnInfo, 1, columnWidths, 1);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ type: 'fitToContent' });
    });

    it('should get the correct columnInfo given columnWidths with empty', () => {
      const columnWidths = [] as unknown;
      let newColumnInfo = getColumnInfo(columnInfo, 0, columnWidths);
      expect(newColumnInfo.qDef.columnWidth).toEqual({
        type: 'auto',
        pixels: 200,
        percentage: 20,
      });

      newColumnInfo = getColumnInfo(columnInfo, 1, columnWidths, 1);
      expect(newColumnInfo.qDef.columnWidth).toEqual({
        type: 'auto',
        pixels: 200,
        percentage: 20,
      });
    });
  });

  describe('importProperties', () => {
    const exportFormat = {
      data: [
        {
          dimensions: [
            {
              qDef: {
                columnWidth: {
                  type: 'auto',
                  pixels: 200,
                  percentage: 20,
                },
              },
            },
          ],
          measures: [
            {
              qDef: {
                columnWidth: {
                  type: 'auto',
                  pixels: 200,
                  percentage: 20,
                },
              },
            },
          ],
          excludedDimensions: [],
          excludedMeasures: [],
          interColumnSortOrder: [0, 1],
        },
      ],
      properties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qColumnOrder: [0, 1],
          columnWidths: [300, -1],
        },
      },
    } as unknown as ExportFormat;
    const initialProperties = {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
      },
    } as unknown as EngineAPI.IGenericHyperCubeProperties;
    const extension = {
      getDefaultDimensionProperties: jest.fn(),
      getDefaultMeasureProperties: jest.fn(),
    };
    const hypercubePath = undefined;

    it('should get the correct importProperties', () => {
      const propertyTree = importProperties(exportFormat, initialProperties, extension, hypercubePath);
      // @ts-ignore
      expect(propertyTree.qProperty.qHyperCubeDef.qDimensions[0].qDef.columnWidth).toEqual({
        pixels: 300,
        type: 'pixels',
      });
      // @ts-ignore
      expect(propertyTree.qProperty.qHyperCubeDef.qMeasures[0].qDef.columnWidth).toEqual({
        type: 'fitToContent',
      });
    });
  });
});
