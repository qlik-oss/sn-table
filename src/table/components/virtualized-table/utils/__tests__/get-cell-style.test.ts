import { SelectionStates } from '../../../../constants';
import { BodyStyle } from '../../types';
import getCellStyle from '../get-cell-style';

interface OverridableProps {
  isHoveringOnRow?: boolean;
  cellSelectionState?: SelectionStates;
}

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

    fn = ({ isHoveringOnRow, cellSelectionState }: OverridableProps) =>
      getCellStyle(isHoveringOnRow ?? false, cellSelectionState ?? SelectionStates.INACTIVE, bodyStyle);
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
        color: '#fff',
        background: '#009845',
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
        color: '#fff',
        background: '#009845',
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
  });
});
