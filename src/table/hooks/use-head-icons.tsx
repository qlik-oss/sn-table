import React, { useMemo } from 'react';
import Lock from '@qlik-trial/sprout/icons/Lock';
import Descending from '@qlik-trial/sprout/icons/Descending';
import Ascending from '@qlik-trial/sprout/icons/Ascending';
import { Column } from '../../types';

const useHeadIcons = (column: Column) => {
  return useMemo(() => {
    const sortIcon = column.sortDirection === 'A' ? <Ascending size="small" /> : <Descending size="small" />;
    const lockIcon = column.isLocked ? <Lock size="small" data-testid="head-cell-lock-icon" /> : undefined;
    return column.align === 'right' ? { startIcon: sortIcon, lockIcon } : { endIcon: sortIcon, lockIcon };
  }, [column]);
};

export default useHeadIcons;
