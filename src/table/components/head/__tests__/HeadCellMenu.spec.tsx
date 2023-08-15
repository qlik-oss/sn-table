/* eslint-disable no-underscore-dangle */
import { stardust } from "@nebula.js/stardust";
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import React from "react";
import TestWithProviders from "../../../../__test__/test-with-providers";
import { Column, TableLayout } from "../../../../types";
import * as useFieldSelectionHook from "../../../hooks/use-field-selection";
import HeadCellMenu from "../HeadCellMenu";

type ExtendedEmbed = stardust.Embed & {
  __DO_NOT_USE__: {
    popover: () => void;
  };
  on: () => void;
};

describe("<HeadCellMenu />", () => {
  let embed: ExtendedEmbed;
  let layout: TableLayout;
  let column: Column;
  let defaultListboxAnchorOpts: any;
  let fieldInstanceMock: EngineAPI.IField;
  let selectionActionsEnabledStatusMock: Record<string, boolean>;
  let resetSelectionActionsEnabledStatusMock: jest.Mock<any, any>;
  let updateSelectionActionsEnabledStatusMock: jest.Mock<any, any>;
  let model: EngineAPI.IGenericObject;
  let useFieldSelectionHookResult: useFieldSelectionHook.UseFieldSelectionOutput;
  let interactions: stardust.Interactions;
  const direction: "ltr" | "rtl" = "ltr";
  const menuLabels = [
    "SNTable.MenuItem.Search",
    "SNTable.MenuItem.SelectAll",
    "SNTable.MenuItem.SelectPossible",
    "SNTable.MenuItem.SelectAlternative",
    "SNTable.MenuItem.SelectExcluded",
    "SNTable.MenuItem.ClearSelections",
  ];

  const renderTableHeadCellMenu = () =>
    render(
      <TestWithProviders layout={layout} direction={direction} embed={embed} model={model} interactions={interactions}>
        <HeadCellMenu column={column} tabIndex={0} />
      </TestWithProviders>
    );

  const openMenu = async () => {
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeVisible();
    });
  };

  beforeEach(() => {
    embed = {
      field: jest.fn().mockResolvedValueOnce({ mount: jest.fn(), unmount: jest.fn() }),
      render: jest.fn(),
      create: jest.fn(),
      generateProperties: jest.fn(),
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
        qDimensionInfo: [{ qFallbackTitle: "someTitle" }],
      },
    } as TableLayout;
    column = {
      colIdx: 0,
      isDim: true,
      label: "dim#01",
      fieldId: "someFieldId",
    } as Column;
    defaultListboxAnchorOpts = {
      anchorOrigin: { horizontal: "left", vertical: "bottom" },
      transformOrigin: { horizontal: "left", vertical: "top" },
    };
    fieldInstanceMock = {
      selectAll: jest.fn(),
      clear: jest.fn(),
      selectPossible: jest.fn(),
      selectAlternative: jest.fn(),
      selectExcluded: jest.fn(),
    } as unknown as EngineAPI.IField;
    selectionActionsEnabledStatusMock = {
      canSelectAll: true,
      canClearSelections: false,
      canSelectPossible: true,
      canSelectAlternative: false,
      canSelectExcluded: false,
    };
    resetSelectionActionsEnabledStatusMock = jest.fn();
    updateSelectionActionsEnabledStatusMock = jest.fn();
    useFieldSelectionHookResult = {
      fieldInstance: fieldInstanceMock,
      selectionActionsEnabledStatus: selectionActionsEnabledStatusMock,
      resetSelectionActionsEnabledStatus: resetSelectionActionsEnabledStatusMock,
      updateSelectionActionsEnabledStatus: updateSelectionActionsEnabledStatusMock,
    };
    jest.spyOn(useFieldSelectionHook, "default").mockReturnValue(useFieldSelectionHookResult);
    model = {
      getLayout: jest.fn().mockResolvedValue(null),
    } as unknown as EngineAPI.IGenericObject;
    interactions = {
      select: true,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render head cell menu button but the opacity is 0, and the menu is not opened", () => {
    renderTableHeadCellMenu();

    const element = screen.getByRole("button");
    expect(element).toBeInTheDocument();
    expect(element).not.toBeVisible();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should open menu and render all menu items when column is dimension", async () => {
    renderTableHeadCellMenu();
    await openMenu();

    ["SNTable.MenuItem.Search", "SNTable.MenuItem.Selections", "SNTable.MenuItem.AdjustColumnSize"].forEach(
      (actionLabel) => {
        expect(screen.queryByText(actionLabel)).toBeVisible();
      }
    );
  });

  it("should open menu but not render selection items when when column is measure", async () => {
    column = { ...column, isDim: false };
    renderTableHeadCellMenu();
    await openMenu();

    expect(screen.queryByText("SNTable.MenuItem.Search")).toBeNull();
    expect(screen.queryByText("SNTable.MenuItem.Selections")).toBeNull();
    expect(screen.queryByText("SNTable.MenuItem.AdjustColumnSize")).toBeVisible();
  });

  it("should open menu but not render selection items when when column is dimension, but selections is disabled", async () => {
    interactions.select = false;
    renderTableHeadCellMenu();
    await openMenu();

    expect(screen.queryByText("SNTable.MenuItem.Search")).toBeNull();
    expect(screen.queryByText("SNTable.MenuItem.Selections")).toBeNull();
    expect(screen.queryByText("SNTable.MenuItem.AdjustColumnSize")).toBeVisible();
  });

  it("should close the menu when listbox is about to mount", async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeVisible();
    });
    fireEvent.click(screen.getByText("SNTable.MenuItem.Search"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should close the menu by clicking the menu button when the context menu is open", async () => {
    renderTableHeadCellMenu();

    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeVisible();
    });
    fireEvent.click(button);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    // it's called 2 times:
    // 1. default state is false
    // 2. when we actually close the dropdown
    expect(resetSelectionActionsEnabledStatusMock).toHaveBeenCalledTimes(2);
  });

  it("should call `embed.__DO_NOT_USE__.popover()` once while trying to open listbox filter for a dimension", async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeVisible();
    });
    fireEvent.click(screen.getByText("SNTable.MenuItem.Search"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledTimes(1);
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      column.fieldId,
      defaultListboxAnchorOpts
    );
  });

  it("should call `embed.__DO_NOT_USE__.popover()` once while trying to open listbox filter for a master dimension", async () => {
    column = {
      ...column,
      qLibraryId: "someLibId",
    };
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeVisible();
    });
    fireEvent.click(screen.getByText("SNTable.MenuItem.Search"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledTimes(1);
    expect(embed.__DO_NOT_USE__.popover).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      { qLibraryId: column.qLibraryId, type: "dimension" },
      defaultListboxAnchorOpts
    );
  });

  it("should reflect correct `enabled` status of selection actions based", async () => {
    renderTableHeadCellMenu();

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeVisible();
    });
    fireEvent.click(screen.getByText("SNTable.MenuItem.Selections"));
    menuLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });

    // enabled actions based on mocked values
    ["SNTable.MenuItem.SelectAll", "SNTable.MenuItem.SelectPossible"].forEach((actionLabel) => {
      expect(screen.queryByText(actionLabel)?.closest("li")).not.toHaveAttribute("aria-disabled");
    });

    // disabled actions based on mocked values
    [
      "SNTable.MenuItem.SelectAlternative",
      "SNTable.MenuItem.SelectExcluded",
      "SNTable.MenuItem.ClearSelections",
    ].forEach((actionLabel) => {
      expect(screen.queryByText(actionLabel)?.closest("li")).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Selection actions", () => {
    const handleBeforeEachAction = async (targetAction: string) => {
      jest.spyOn(useFieldSelectionHook, "default").mockReturnValue({
        ...useFieldSelectionHookResult,
        selectionActionsEnabledStatus: {
          ...useFieldSelectionHookResult.selectionActionsEnabledStatus,
          [`can${targetAction}`]: true,
        },
      });
      renderTableHeadCellMenu();
      fireEvent.click(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.queryByRole("menu")).toBeVisible();
      });
      fireEvent.click(screen.getByText("SNTable.MenuItem.Selections"));
      fireEvent.click(screen.getByText(`SNTable.MenuItem.${targetAction}`));
    };

    const testEnd = async () => {
      expect(updateSelectionActionsEnabledStatusMock).toHaveBeenCalledTimes(1);
      fireEvent.click(document);
      await waitForElementToBeRemoved(() => screen.queryByRole("menu"));
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    };

    it('should be able to call "Select All" once when it is enabled', async () => {
      await handleBeforeEachAction("SelectAll");
      expect(fieldInstanceMock.selectAll).toHaveBeenCalledTimes(1);
      await testEnd();
    });

    it('should be able to call "Clear Selection" all once when it is enabled', async () => {
      await handleBeforeEachAction("ClearSelections");
      expect(fieldInstanceMock.clear).toHaveBeenCalledTimes(1);
      await testEnd();
    });

    it('should be able to call "Select Possible" all once when it is enabled', async () => {
      await handleBeforeEachAction("SelectPossible");
      expect(fieldInstanceMock.selectPossible).toHaveBeenCalledTimes(1);
      await testEnd();
    });

    it('should be able to call "Select Alternative" all once when it is enabled', async () => {
      await handleBeforeEachAction("SelectAlternative");
      expect(fieldInstanceMock.selectAlternative).toHaveBeenCalledTimes(1);
      await testEnd();
    });

    it('should be able to call "Select Excluded" all once when it is enabled', async () => {
      await handleBeforeEachAction("SelectExcluded");
      expect(fieldInstanceMock.selectExcluded).toHaveBeenCalledTimes(1);
      await testEnd();
    });
  });
});
