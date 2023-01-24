import React, { useMemo } from 'react';
import Lock from '@qlik-trial/sprout/icons/react/Lock';
import Descending from '@qlik-trial/sprout/icons/react/Descending';
import Ascending from '@qlik-trial/sprout/icons/react/Ascending';
import { Column } from '../../types';

const useHeadIcons = (column: Column) => {
  return useMemo(() => {
    const sortIcon = column.sortDirection === 'A' ? <Ascending height="12px" /> : <Descending height="12px" />;
    const lockIcon = column.isLocked ? <Lock height="12px" data-testid="head-cell-lock-icon" /> : undefined;
    return column.align === 'right' ? { startIcon: sortIcon, lockIcon } : { endIcon: sortIcon, lockIcon };
  }, [column]);
};

export default useHeadIcons;
