import { Cell, Column } from '../../../../../types';
import { SelectionStates } from '../../../../constants';
import { SELECTION_STYLING } from '../../../../styling-defaults';
import { BodyStyle } from '../../types';
import getCellStyle from '../get-cell-style';

interface OverridableProps {
  cell?: Cell;
  column?: Column;
  isHoveringOnRow?: boolean;
  cellSelectionState?: SelectionStates;
}

const cellWithAttrExps = {
  qAttrExps: {
    qValues: [
      {
        qText: 'RGB(128,0,0)',
        qNum: 4286578688,
      },
      {
        qText: 'RGB(0,128,0)',
        qNum: 4278222848,
      },
    ],
  },
} as unknown as Cell;

const columnWithStylingIDs = {
  stylingIDs: ['cellBackgroundColor', 'cellForegroundColor'],
} as Column;

describe('getCellStyle', () => {
  const borderColors = {
    borderTopColor: 'bodyBorderColor',
    borderBottomColor: 'bodyBorderColor',
    borderLeftColor: 'bodyBorderColor',
    borderRightColor: 'bodyBorderColor',
  };
  let bodyStyle: BodyStyle;
  let fn: (props: OverridableProps) => BodyStyle;

  beforeEach(() => {
    bodyStyle = {
      ...borderColors,
      color: 'bodyColor',
      background: 'bodyBackground',
      hoverColors: {
        background: 'hoverBackgroundColor',
        color: 'hoverFontColor',
      },
    };

    fn = ({ cell, column, isHoveringOnRow, cellSelectionState }: OverridableProps) =>
      getCellStyle(
        cell ?? ({} as Cell),
        column ?? ({ stylingIDs: [] } as unknown as Column),
        isHoveringOnRow ?? false,
        cellSelectionState ?? SelectionStates.INACTIVE,
        bodyStyle
      );
  });

  describe('user is NOT hovering row', () => {
    test('selection state is INACTIVE', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.INACTIVE });

      expect(s).toEqual({ ...borderColors, color: 'bodyColor', background: 'bodyBackground' });
    });

    test('selection state is SELECTED', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.SELECTED });

      expect(s).toEqual({
        ...borderColors,
        color: SELECTION_STYLING.SELECTED.color,
        background: SELECTION_STYLING.SELECTED.background,
        selectedCellClass: 'selected',
      });
    });

    test('selection state is POSSIBLE', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.POSSIBLE });

      expect(s).toEqual({
        ...borderColors,
        color: 'bodyColor',
        background: 'bodyBackground',
      });
    });

    test('selection state is EXCLUDED', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.EXCLUDED });

      expect(s).toEqual({
        ...borderColors,
        color: 'bodyColor',
        background:
          'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px), bodyBackground',
      });
    });

    test('with column styling and selection state is INACTIVE', () => {
      const s = fn({
        cell: cellWithAttrExps,
        column: columnWithStylingIDs,
        isHoveringOnRow: false,
        cellSelectionState: SelectionStates.INACTIVE,
      });

      expect(s).toEqual({ ...borderColors, color: 'rgb(0,128,0)', background: 'rgb(128,0,0)' });
    });

    test('with column styling and selection state is SELECTED', () => {
      const s = fn({
        cell: cellWithAttrExps,
        column: columnWithStylingIDs,
        isHoveringOnRow: false,
        cellSelectionState: SelectionStates.SELECTED,
      });

      expect(s).toEqual({
        ...borderColors,
        color: SELECTION_STYLING.SELECTED.color,
        background: SELECTION_STYLING.SELECTED.background,
        selectedCellClass: 'selected',
      });
    });

    test('with column styling and selection state is EXCLUDED', () => {
      const s = fn({
        cell: cellWithAttrExps,
        column: columnWithStylingIDs,
        isHoveringOnRow: false,
        cellSelectionState: SelectionStates.EXCLUDED,
      });

      expect(s).toEqual({
        ...borderColors,
        color: 'rgb(0,128,0)',
        background:
          'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px), rgb(128,0,0)',
      });
    });
  });

  describe('user is hovering row', () => {
    test('selection state is INACTIVE', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.INACTIVE });

      expect(s).toEqual({
        ...borderColors,
        color: 'hoverFontColor',
        background: 'hoverBackgroundColor',
      });
    });

    test('selection state is SELECTED', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.SELECTED });

      expect(s).toEqual({
        ...borderColors,
        color: SELECTION_STYLING.SELECTED.color,
        background: SELECTION_STYLING.SELECTED.background,
        selectedCellClass: 'selected',
      });
    });

    test('selection state is POSSIBLE', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.POSSIBLE });

      expect(s).toEqual({
        ...borderColors,
        color: 'hoverFontColor',
        background: 'hoverBackgroundColor',
      });
    });

    test('selection state is EXCLUDED', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.EXCLUDED });

      expect(s).toEqual({
        ...borderColors,
        color: 'hoverFontColor',
        background:
          'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px), hoverBackgroundColor',
      });
    });

    test('with column styling and selection state is INACTIVE', () => {
      const s = fn({
        cell: cellWithAttrExps,
        column: columnWithStylingIDs,
        isHoveringOnRow: true,
        cellSelectionState: SelectionStates.INACTIVE,
      });

      expect(s).toEqual({
        ...borderColors,
        color: 'hoverFontColor',
        background: 'hoverBackgroundColor',
      });
    });

    test('with column styling and selection state is SELECTED', () => {
      const s = fn({
        cell: cellWithAttrExps,
        column: columnWithStylingIDs,
        isHoveringOnRow: true,
        cellSelectionState: SelectionStates.SELECTED,
      });

      expect(s).toEqual({
        ...borderColors,
        color: SELECTION_STYLING.SELECTED.color,
        background: SELECTION_STYLING.SELECTED.background,
        selectedCellClass: 'selected',
      });
    });

    test('with column styling and selection state is EXCLUDED', () => {
      const s = fn({
        cell: cellWithAttrExps,
        column: columnWithStylingIDs,
        isHoveringOnRow: true,
        cellSelectionState: SelectionStates.EXCLUDED,
      });

      expect(s).toEqual({
        ...borderColors,
        color: 'hoverFontColor',
        background:
          'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px), hoverBackgroundColor',
      });
    });
  });
});
