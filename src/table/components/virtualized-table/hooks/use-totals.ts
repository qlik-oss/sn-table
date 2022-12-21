import { useMemo } from 'react';
import { getTotalPosition } from '../../../../handle-data';
import { TableLayout } from '../../../../types';
import { HEADER_HEIGHT, HEADER_AND_TOTALS_HEIGHT } from '../constants';

export interface Totals {
  atBottom: boolean;
  atTop: boolean;
  isVisible: boolean;
  shrinkBodyHeightBy: number;
}

const useTotals = (layout: TableLayout) => {
  const totalsPosition = getTotalPosition(layout);

  return useMemo(
    () => ({
      atBottom: totalsPosition === 'bottom',
      atTop: totalsPosition === 'top',
      isVisible: totalsPosition !== 'noTotals',
      shrinkBodyHeightBy: totalsPosition === 'noTotals' ? HEADER_HEIGHT : HEADER_AND_TOTALS_HEIGHT,
    }),
    [totalsPosition]
  );
};

export default useTotals;
