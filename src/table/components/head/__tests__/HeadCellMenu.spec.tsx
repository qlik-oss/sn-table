import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { TableLayout } from '../../../../types';
import HeadCellMenu from '../HeadCellMenu';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<HeadCellMenu />', () => {
  let embed: stardust.Embed;
  let layout: TableLayout;
  const columnIndex = 0;
  const direction: 'ltr' | 'rtl' = 'ltr';
  let isDimension: boolean;

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <TestWithProviders cellCoordMock={cellCoordMock} layout={layout} direction={direction} embed={embed}>
        <HeadCellMenu isDimension={isDimension} columnIndex={columnIndex} />
      </TestWithProviders>
    );

  beforeEach(() => {
    embed = {
      field: jest.fn().mockResolvedValueOnce({ mount: jest.fn(), unmount: jest.fn() }),
      render: jest.fn(),
      selections: jest.fn(),
      context: jest.fn(),
      getRegisteredTypes: jest.fn(),
    };
    layout = {
      qHyperCube: {
        qDimensionInfo: [{ qFallbackTitle: 'someTitle' }],
      },
    } as TableLayout;
    isDimension = true;
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
    isDimension = false;
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

  it('should close the menu when the menu item is clicked', async () => {
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

  it('should call `embed.field` once while trying to open listbox filter for a library dimension', async () => {
    layout = {
      qHyperCube: {
        qDimensionInfo: [{ qLibraryId: 'id' }],
      },
    } as TableLayout;
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
    expect(embed?.field).toHaveBeenCalledTimes(1);
    expect(embed?.field).toHaveBeenCalledWith({ qLibraryId: 'id', type: 'dimension' });
  });

  it('should call `embed.field` once while trying to open listbox filter for a dimension', async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
    expect(embed?.field).toHaveBeenCalledTimes(1);
    expect(embed?.field).toHaveBeenCalledWith('someTitle');
  });

  it('should not call `embed.field` if field ID is not found', async () => {
    layout = {
      qHyperCube: {
        qDimensionInfo: [],
      },
    } as unknown as TableLayout;
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    const menu = screen.queryByRole('menu');
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    await waitForElementToBeRemoved(menu);
    expect(embed?.field).toHaveBeenCalledTimes(0);
  });
});
