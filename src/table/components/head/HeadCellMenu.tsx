import React, { useRef, useState, useMemo } from 'react';
import Menu from '@mui/material/Menu';
import More from '@qlik-trial/sprout/icons/More';
import Search from '@qlik-trial/sprout/icons/Search';
import { stardust } from '@nebula.js/stardust';
import { TableLayout } from '../../../types';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellMenuProps, MenuItemGroup } from '../../types';
import { StyledMenuIconButton } from './styles';
import MenuItems from './MenuItems';

const getFieldId = (layout: TableLayout, columnIndex: number): string | stardust.LibraryField | undefined =>
  layout.qHyperCube.qDimensionInfo[columnIndex]?.qLibraryId
    ? {
        type: 'dimension',
        qLibraryId: layout.qHyperCube.qDimensionInfo[columnIndex]?.qLibraryId,
      }
    : layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle;

export default function HeadCellMenu({ columnIndex, isDimension, tabIndex }: HeadCellMenuProps) {
  const { translator } = useContextSelector(TableContext, (value) => value.baseProps);
  const { embed, layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const menuItemGroups = useMemo<MenuItemGroup[]>(
    () => [
      ...(isDimension
        ? [
            [
              {
                id: 3,
                itemTitle: translator.get('SNTable.MenuItem.Search'),
                onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
                  evt.stopPropagation();
                  setOpenMenuDropdown(false);

                  if (!layout || !embed) return;
                  const fieldId = getFieldId(layout, columnIndex);
                  if (!fieldId) return;
                  // @ts-ignore do not use api does not require type check
                  // eslint-disable-next-line
                  embed.__DO_NOT_USE__.popover(listboxRef.current, fieldId, {
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  });
                },
                icon: <Search />,
                isDisabled: false,
              },
            ],
          ]
        : []),
    ],
    [translator, isDimension, listboxRef.current, layout, embed, columnIndex]
  );

  return menuItemGroups.length ? (
    <>
      <div>
        <StyledMenuIconButton
          isVisible={openMenuDropdown}
          ref={anchorRef}
          size="small"
          tabIndex={tabIndex}
          id="sn-table-head-menu-button"
          aria-controls={openMenuDropdown ? 'sn-table-head-menu' : undefined}
          aria-expanded={openMenuDropdown ? 'true' : undefined}
          aria-haspopup="true"
          onClick={() => setOpenMenuDropdown(!openMenuDropdown)}
        >
          <More size="small" />
        </StyledMenuIconButton>

        <div ref={listboxRef} />
      </div>

      <Menu
        className="sn-table-head-menu"
        aria-labelledby="sn-table-head-menu-button"
        open={openMenuDropdown}
        anchorEl={anchorRef.current}
        onClose={() => setOpenMenuDropdown(false)}
        autoFocus={false}
      >
        {MenuItems({ itemGroups: menuItemGroups })}
      </Menu>
    </>
  ) : null;
}
