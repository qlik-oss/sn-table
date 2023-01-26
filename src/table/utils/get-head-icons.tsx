import React from 'react';
import Lock from '@qlik-trial/sprout/icons/react/Lock';
import Descending from '@qlik-trial/sprout/icons/react/Descending';
import Ascending from '@qlik-trial/sprout/icons/react/Ascending';
import { Column } from '../../types';

const getHeadIcons = ({ sortDirection, isLocked, align }: Column) => {
  const sortIcon = sortDirection === 'A' ? <Ascending height="12px" /> : <Descending height="12px" />;
  const lockIcon = isLocked ? <Lock height="12px" data-testid="head-cell-lock-icon" /> : undefined;
  return align === 'right' ? { startIcon: sortIcon, lockIcon } : { endIcon: sortIcon, lockIcon };
};

export default getHeadIcons;
