import React from 'react';
import Lock from '@qlik-trial/sprout/icons/react/Lock';
import Descending from '@qlik-trial/sprout/icons/react/Descending';
import Ascending from '@qlik-trial/sprout/icons/react/Ascending';
import { Column, Align } from '../../types';
import { DEFAULT_FONT_SIZE } from '../styling-defaults';
import { LockWrapper } from '../components/head/styles';

const getHeadIcons = ({ sortDirection, isLocked }: Column, align: Align) => {
  const sortIcon =
    sortDirection === 'A' ? <Ascending height={DEFAULT_FONT_SIZE} /> : <Descending height={DEFAULT_FONT_SIZE} />;
  const lockIcon = isLocked ? (
    <LockWrapper>
      <Lock height={DEFAULT_FONT_SIZE} data-testid="head-cell-lock-icon" />
    </LockWrapper>
  ) : undefined;
  return align === 'right' ? { startIcon: sortIcon, lockIcon } : { endIcon: sortIcon, lockIcon };
};

export default getHeadIcons;
