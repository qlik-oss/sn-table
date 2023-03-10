import React from 'react';
import Lock from '@qlik-trial/sprout/icons/react/Lock';
import Descending from '@qlik-trial/sprout/icons/react/Descending';
import Ascending from '@qlik-trial/sprout/icons/react/Ascending';

import getHeadIcons from '../get-head-icons';
import { Column, Align } from '../../../types';
import { DEFAULT_FONT_SIZE } from '../../styling-defaults';
import { LockWrapper } from '../../components/head/styles';

describe('getHeadIcons', () => {
  const ascending = <Ascending height={DEFAULT_FONT_SIZE} />;
  const descending = <Descending height={DEFAULT_FONT_SIZE} />;
  const lock = (
    <LockWrapper>
      <Lock height="12px" data-testid="head-cell-lock-icon" />
    </LockWrapper>
  );
  let column: Column;
  let align: Align;

  beforeEach(() => {
    align = 'left';
    column = {
      sortDirection: 'A',
      isLocked: false,
    } as Column;
  });

  it('should return ascending as endIcon and no lock icon when sortDirection i A and align is left', () => {
    const icons = getHeadIcons(column, align);
    expect(icons).toEqual({ endIcon: ascending, lockIcon: undefined });
  });

  it('should return descending as endIcon and no lock icon when sortDirection i D and align is left', () => {
    column.sortDirection = 'D';

    const icons = getHeadIcons(column, align);
    expect(icons).toEqual({ endIcon: descending, lockIcon: undefined });
  });

  it('should return ascending as endIcon and no lock icon when sortDirection i A and align is right', () => {
    align = 'right';

    const icons = getHeadIcons(column, align);
    expect(icons).toEqual({ startIcon: ascending, lockIcon: undefined });
  });

  it('should return descending as endIcon and no lock icon when sortDirection i D and align is right', () => {
    align = 'right';
    column.sortDirection = 'D';

    const icons = getHeadIcons(column, align);
    expect(icons).toEqual({ startIcon: descending, lockIcon: undefined });
  });

  it('should return defined lock icon when isLocked is true', () => {
    column.isLocked = true;

    const { lockIcon } = getHeadIcons(column, align);
    expect(lockIcon).toEqual(lock);
  });
});
