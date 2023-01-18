import { useMemo } from 'react';
import { getTotalPosition } from '../../../../handle-data';
import { TableLayout } from '../../../../types';

export interface Totals {
  atBottom: boolean;
  atTop: boolean;
}

const useTotals = (layout: TableLayout) => useMemo(() => getTotalPosition(layout), [layout]);

export default useTotals;
