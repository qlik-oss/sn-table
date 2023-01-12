import { useMemo } from 'react';
import { getTotalPosition } from '../../../../handle-data';
import { useContextSelector, TableContext } from '../../../context';
import { HEADER_HEIGHT, HEADER_AND_TOTALS_HEIGHT } from '../constants';

export interface Totals {
  atBottom: boolean;
  atTop: boolean;
  shrinkBodyHeightBy: number;
}

const useTotals = () => {
  const { layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const totalsPosition = getTotalPosition(layout);

  return useMemo(
    () => ({
      ...totalsPosition,
      shrinkBodyHeightBy: totalsPosition.atTop || totalsPosition.atBottom ? HEADER_AND_TOTALS_HEIGHT : HEADER_HEIGHT,
    }),
    [totalsPosition]
  );
};

export default useTotals;
