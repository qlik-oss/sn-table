import { useMemo } from 'react';
import { getTotalPosition } from '../../../../handle-data';
import { TableLayout } from '../../../../types';
import { HEADER_HEIGHT, HEADER_AND_TOTALS_HEIGHT } from '../constants';

export interface Totals {
  atBottom: boolean;
  atTop: boolean;
  shrinkBodyHeightBy: number;
}

const useTotals = (layout: TableLayout) => {
  const totalsPosition = getTotalPosition(layout);

  return useMemo(
    () => ({
      ...totalsPosition,
      shrinkBodyHeightBy: totalsPosition.atTop || totalsPosition.atTop ? HEADER_AND_TOTALS_HEIGHT : HEADER_HEIGHT,
    }),
    [totalsPosition]
  );
};

export default useTotals;
