import { SelectionStates } from '../../../../constants';
import { BodyStyle } from '../../types';
import getCellStyle from '../get-cell-style';

interface OverideableProps {
  isHoveringOnRow?: boolean;
  cellSelectionState?: SelectionStates;
}

describe('getCellStyle', () => {
  let bodyStyle: BodyStyle;
  let fn: (props: OverideableProps) => BodyStyle;

  beforeEach(() => {
    bodyStyle = {
      color: 'bodyColor',
      background: 'bodyBackground',
      borderColor: 'bodyBorderColor',
      hoverBackgroundColor: 'hoverBackgroundColor',
      hoverFontColor: 'hoverFontColor',
    };

    fn = ({ isHoveringOnRow, cellSelectionState }: OverideableProps) =>
      getCellStyle(isHoveringOnRow ?? false, cellSelectionState ?? SelectionStates.INACTIVE, bodyStyle);
  });

  describe('user is NOT hovering row', () => {
    test('selection state is INACTIVE', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.INACTIVE });

      expect(s).toEqual(bodyStyle);
    });

    test('selection state is SELECTED', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.SELECTED });

      expect(s).toEqual({
        color: '#fff',
        background: '#009845',
        borderColor: 'bodyBorderColor',
        hoverBackgroundColor: 'hoverBackgroundColor',
        hoverFontColor: 'hoverFontColor',
        selectedCellClass: 'selected',
      });
    });

    test('selection state is POSSIBLE', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.POSSIBLE });

      expect(s).toEqual({
        color: 'bodyColor',
        background: 'bodyBackground',
        borderColor: 'bodyBorderColor',
        hoverBackgroundColor: 'hoverBackgroundColor',
        hoverFontColor: 'hoverFontColor',
      });
    });

    test('selection state is EXCLUDED', () => {
      const s = fn({ isHoveringOnRow: false, cellSelectionState: SelectionStates.EXCLUDED });

      expect(s).toEqual({
        color: 'bodyColor',
        background:
          'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px), bodyBackground',
        borderColor: 'bodyBorderColor',
        hoverBackgroundColor: 'hoverBackgroundColor',
        hoverFontColor: 'hoverFontColor',
      });
    });
  });

  describe('user is hovering row', () => {
    test('selection state is INACTIVE', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.INACTIVE });

      expect(s).toEqual({
        color: 'hoverFontColor',
        background: 'hoverBackgroundColor',
        borderColor: 'bodyBorderColor',
        hoverBackgroundColor: 'hoverBackgroundColor',
        hoverFontColor: 'hoverFontColor',
      });
    });

    test('selection state is SELECTED', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.SELECTED });

      expect(s).toEqual({
        color: '#fff',
        background: '#009845',
        borderColor: 'bodyBorderColor',
        hoverBackgroundColor: 'hoverBackgroundColor',
        hoverFontColor: 'hoverFontColor',
        selectedCellClass: 'selected',
      });
    });

    test('selection state is POSSIBLE', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.POSSIBLE });

      expect(s).toEqual({
        color: 'hoverFontColor',
        background: 'hoverBackgroundColor',
        borderColor: 'bodyBorderColor',
        hoverBackgroundColor: 'hoverBackgroundColor',
        hoverFontColor: 'hoverFontColor',
      });
    });

    test('selection state is EXCLUDED', () => {
      const s = fn({ isHoveringOnRow: true, cellSelectionState: SelectionStates.EXCLUDED });

      expect(s).toEqual({
        color: 'hoverFontColor',
        background:
          'repeating-linear-gradient(-45deg, rgba(200,200,200,0.08), rgba(200,200,200,0.08) 2px, rgba(200,200,200,0.3) 2.5px, rgba(200,200,200,0.08) 3px, rgba(200,200,200,0.08) 5px), hoverBackgroundColor',
        borderColor: 'bodyBorderColor',
        hoverBackgroundColor: 'hoverBackgroundColor',
        hoverFontColor: 'hoverFontColor',
      });
    });
  });
});
