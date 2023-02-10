/* eslint-disable no-underscore-dangle */
import React from 'react';
import { stardust } from '@nebula.js/stardust';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Column, TableLayout } from '../../../../types';
import HeadCellMenu from '../HeadCellMenu';
import TestWithProviders from '../../../../__test__/test-with-providers';
import * as useFieldSelectionHook from '../../../hooks/use-field-selection';

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
  // let mockLayout: TableLayout;
  let fieldInstanceMock: EngineAPI.IField;
  let selectionActionsEnabledStatusMock: Record<string, boolean>;
  let resetSelectionActionsEnabledStatusMock: jest.Mock<any, any>;
  let updateSelectionActionsEnabledStatusMock: jest.Mock<any, any>;
  let model: EngineAPI.IGenericObject;
  const direction: 'ltr' | 'rtl' = 'ltr';
  const menuLabels = [
    'SNTable.MenuItem.Search',
    'SNTable.MenuItem.SelectAll',
    'SNTable.MenuItem.ClearSelections',
    'SNTable.MenuItem.SelectPossible',
    'SNTable.MenuItem.SelectAlternative',
    'SNTable.MenuItem.SelectExcluded',
  ];

  const renderTableHeadCellMenu = (cellCoordMock?: [number, number]) =>
    render(
      <TestWithProviders
        cellCoordMock={cellCoordMock}
        layout={layout}
        direction={direction}
        embed={embed}
        model={model}
      >
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
      label: 'dim#01',
      fieldId: 'someFieldId',
    } as Column;
    defaultListboxAnchorOpts = {
      anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
      transformOrigin: { horizontal: 'left', vertical: 'top' },
    };
    fieldInstanceMock = {
      selectAll: jest.fn(),
      clear: jest.fn(),
      selectPossible: jest.fn(),
      selectAlternative: jest.fn(),
      selectExcluded: jest.fn(),
    } as unknown as EngineAPI.IField;
    selectionActionsEnabledStatusMock = {
      canSelectAll: false,
      canClearSelections: false,
      canSelectPossible: false,
      canSelectAlternative: false,
      canSelectExcluded: false,
    };
    resetSelectionActionsEnabledStatusMock = jest.fn();
    updateSelectionActionsEnabledStatusMock = jest.fn();
    jest.spyOn(useFieldSelectionHook, 'default').mockReturnValue({
      fieldInstance: fieldInstanceMock,
      selectionActionsEnabledStatus: selectionActionsEnabledStatusMock,
      resetSelectionActionsEnabledStatus: resetSelectionActionsEnabledStatusMock,
      updateSelectionActionsEnabledStatus: updateSelectionActionsEnabledStatusMock,
    });
    // mockLayout = {
    //   qHyperCube: {
    //     qDimensionInfo: [
    //       {
    //         qFallbackTitle: 'dim#01',
    //         qStateCounts: { qSelected: 0, qOption: 0, qDeselected: 0, qAlternative: 0, qExcluded: 0 },
    //       },
    //       {
    //         qFallbackTitle: 'dim#02',
    //         qStateCounts: { qSelected: 0, qOption: 0, qDeselected: 0, qAlternative: 0, qExcluded: 0 },
    //       },
    //       {
    //         qFallbackTitle: 'dim#03',
    //         qStateCounts: { qSelected: 0, qOption: 0, qDeselected: 0, qAlternative: 0, qExcluded: 0 },
    //       },
    //     ],
    //   },
    // } as TableLayout;
    model = {
      getLayout: jest.fn().mockResolvedValue(null),
    } as unknown as EngineAPI.IGenericObject;
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

  it('should open the menu only when the button is clicked', async () => {
    renderTableHeadCellMenu();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeVisible();
    });
    menuLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });

  it('should close the menu when listbox is about to mount', async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeVisible();
    });
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should close the menu by clicking the menu button when the context menu is open', async () => {
    renderTableHeadCellMenu();

    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeVisible();
    });
    fireEvent.click(button);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should call `embed.__DO_NOT_USE__.popover()` once while trying to open listbox filter for a dimension', async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeVisible();
    });
    fireEvent.click(screen.getByText('SNTable.MenuItem.Search'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledTimes(1);
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      column.fieldId,
      defaultListboxAnchorOpts
    );
  });
});
