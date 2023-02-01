/* eslint-disable no-underscore-dangle */
import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Column, TableLayout } from '../../../../types';
import HeadCellMenu from '../HeadCellMenu';
import TestWithProviders from '../../../../__test__/test-with-providers';

type ExtendedEmbed = stardust.Embed & {
  __DO_NOT_USE__: {
    popover: () => void;
  };
  on: () => void;
};

describe('<HeadCellMenu />', () => {
  let embed: ExtendedEmbed;
  let layout: TableLayout;
  let column: Column;
  let defaultListboxAnchorOpts: any;
  const direction: 'ltr' | 'rtl' = 'ltr';

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <TestWithProviders cellCoordMock={cellCoordMock} layout={layout} direction={direction} embed={embed}>
        <HeadCellMenu column={column} tabIndex={0} />
      </TestWithProviders>
    );

  beforeEach(() => {
    embed = {
      field: jest.fn().mockResolvedValueOnce({ mount: jest.fn(), unmount: jest.fn() }),
      render: jest.fn(),
      selections: jest.fn(),
      context: jest.fn(),
      getRegisteredTypes: jest.fn(),
      __DO_NOT_USE__: {
        popover: jest.fn(),
      },
      on: jest.fn(),
    };
    layout = {
      qHyperCube: {
        qDimensionInfo: [{ qFallbackTitle: 'someTitle' }],
      },
    } as TableLayout;
    column = {
      colIdx: 0,
      isDim: true,
      label: 'someDimLabel',
    } as Column;
    defaultListboxAnchorOpts = {
      anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
      transformOrigin: { horizontal: 'left', vertical: 'top' },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render head cell menu button but the opacity is 0', () => {
    renderTableHeadCellMenu();

    const element = screen.getByRole('button');
    expect(element).toBeInTheDocument();
    expect(element).not.toBeVisible();
  });

  it('should not render head cell menu button when isDimension is false', () => {
    column = {
      ...column,
      isDim: false,
    } as Column;
    renderTableHeadCellMenu();

    const element = screen.queryByRole('button');
    expect(element).toBeNull();
  });

  it('should open the menu only when the button is clicked', () => {
    renderTableHeadCellMenu();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeVisible();
    expect(screen.getByText('SNTable.MenuItem.Search')).toBeVisible();
  });

  it('should close the menu when listbox is about to mount', async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    await waitFor(() => {
      expect(menu).toBeVisible();
    });
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
  });

  it('should close the menu by clicking the menu button when the context menu is open', async () => {
    renderTableHeadCellMenu();

    const button = screen.getByRole('button');
    fireEvent.click(button);
    const menu = screen.queryByRole('menu');
    await waitFor(() => {
      expect(menu).toBeVisible();
    });
    fireEvent.click(button);
    await waitForElementToBeRemoved(menu);
  });

  it('should call `embed.__DO_NOT_USE__.popover()` once while trying to open listbox filter for a library dimension', async () => {
    layout = {
      qHyperCube: {
        qDimensionInfo: [{ qFallbackTitle: 'someTitle' }],
      },
    } as TableLayout;
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledTimes(1);
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      column.label,
      defaultListboxAnchorOpts
    );
  });
});
