import { Align, ColumnWidthType, ExportFormat } from '../../../types';
import importProperties, { getColumnInfo, getMultiColumnInfo } from '../import-properties';

describe('importProperties', () => {
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
          type: 'auto' as ColumnWidthType,
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

  describe('getColumnInfo', () => {
    const index = 0;

    it('should get the correct columnInfo given columnWidths with -1', () => {
      const columnWidths = [-1, -1];
      let newColumnInfo = getColumnInfo(qDimensions, index, columnWidths);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ type: 'fitToContent' });

      newColumnInfo = getColumnInfo(qMeasures, 1, columnWidths, 1);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ type: 'fitToContent' });
    });

    it('should get the correct columnInfo given columnWidths with pixels', () => {
      const columnWidths = [300, 20];
      let newColumnInfo = getColumnInfo(qDimensions, index, columnWidths);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ pixels: 300, type: 'pixels' });

      newColumnInfo = getColumnInfo(qMeasures, 1, columnWidths, 1);
      expect(newColumnInfo.qDef.columnWidth).toEqual({ pixels: 20, type: 'pixels' });
    });

    it('should get the correct columnInfo given columnWidths with empty array', () => {
      const columnWidths = [] as number[];
      let newColumnInfo = getColumnInfo(qDimensions, 0, columnWidths);
      expect(newColumnInfo.qDef.columnWidth).toEqual({
        type: 'auto',
        pixels: 200,
        percentage: 20,
      });

      newColumnInfo = getColumnInfo(qMeasures, 1, columnWidths, 1);
      expect(newColumnInfo.qDef.columnWidth).toEqual({
        type: 'auto',
        pixels: 200,
        percentage: 20,
      });
    });
  });

  describe('getMultiColumnInfo', () => {
    it('should get correct dimensions and measures when no qColumnOrder or columnWidths provided', () => {
      const qColumnOrder = [] as number[];
      const columnWidths = [] as number[];

      const { dimensions, measures } = getMultiColumnInfo(qDimensions, qMeasures, qColumnOrder, columnWidths);
      expect(dimensions).toEqual(qDimensions);
      expect(measures).toEqual(qMeasures);
    });

    it('should get correct dimensions and measures when no qColumnOrder provided', () => {
      const qColumnOrder = [] as number[];
      const columnWidths = [400, -1, 300];

      const { dimensions, measures } = getMultiColumnInfo(qDimensions, qMeasures, qColumnOrder, columnWidths);
      expect(dimensions[0].qDef.columnWidth).toEqual({ pixels: 400, type: 'pixels' });
      expect(measures[0].qDef.columnWidth).toEqual({
        type: 'fitToContent',
      });
      expect(measures[1].qDef.columnWidth).toEqual({ pixels: 300, type: 'pixels' });
    });

    it('should get correct dimensions and measures', () => {
      const qColumnOrder = [2, 0, 1];
      const columnWidths = [400, -1, 300];

      const { dimensions, measures } = getMultiColumnInfo(qDimensions, qMeasures, qColumnOrder, columnWidths);
      expect(dimensions[0].qDef.columnWidth).toEqual({ pixels: 400, type: 'pixels' });
      expect(measures[0].qDef.columnWidth).toEqual({ pixels: 300, type: 'pixels' });
      expect(measures[1].qDef.columnWidth).toEqual({
        type: 'fitToContent',
      });
    });
  });

  describe('importProperties', () => {
    const exportFormat = {
      data: [
        {
          dimensions: qDimensions,
          measures: qMeasures,
          excludedDimensions: [],
          excludedMeasures: [],
          interColumnSortOrder: [0, 1, 2],
        },
      ],
      properties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qColumnOrder: [0, 1, 2],
          columnWidths: [300, -1, 400],
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
      expect(propertyTree.qProperty.qHyperCubeDef.qDimensions[0].qDef.columnWidth).toEqual({
        pixels: 300,
        type: 'pixels',
      });
      expect(propertyTree.qProperty.qHyperCubeDef.qMeasures[0].qDef.columnWidth).toEqual({
        type: 'fitToContent',
      });
      expect(propertyTree.qProperty.qHyperCubeDef.qMeasures[1].qDef.columnWidth).toEqual({
        pixels: 400,
        type: 'pixels',
      });
    });
  });
});
