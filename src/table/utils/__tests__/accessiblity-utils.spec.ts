import { stardust } from "@nebula.js/stardust";
import React from "react";
import { Announce, TotalsPosition } from "../../../types";
import { FIRST_BODY_CELL_COORD, FocusTypes } from "../../constants";
import * as accessibilityUtils from "../accessibility-utils";
import * as getElementUtils from "../get-element-utils";

describe("accessibility-utils", () => {
  let cell: HTMLElement | undefined;
  let keyboard: stardust.Keyboard;
  let rootElement: HTMLElement;
  let focusedCellCoord: [number, number];
  let setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  let button: HTMLElement;

  beforeEach(() => {
    button = { focus: jest.fn() } as unknown as HTMLElement;
    cell = {
      focus: jest.fn(),
      blur: jest.fn(),
      setAttribute: jest.fn(),
      querySelector: () => button,
    } as unknown as HTMLElement;
    rootElement = {
      getElementsByClassName: () => [
        { getElementsByClassName: () => [cell] },
        { getElementsByClassName: () => [cell] },
      ],
      querySelector: () => cell,
    } as unknown as HTMLElement;
    focusedCellCoord = [0, 0];
    setFocusedCellCoord = jest.fn();
    keyboard = {
      blur: jest.fn(),
      focus: jest.fn(),
      focusSelection: jest.fn(),
      enabled: true,
      active: false,
    } as unknown as stardust.Keyboard;
  });

  afterEach(() => jest.clearAllMocks());

  describe("focusBackToHeadCell", () => {
    let currentTarget: EventTarget & Element;
    let eventCell: HTMLElement;
    let targetCell: HTMLElement;
    let baseElement: HTMLElement;
    let isNewHeadCellMenuEnabled: boolean;

    const triggerFunction = () => {
      accessibilityUtils.focusBackToHeadCell(currentTarget, isNewHeadCellMenuEnabled);
    };

    beforeEach(() => {
      targetCell = {
        focus: jest.fn(),
      } as unknown as HTMLElement;
      baseElement = {
        setAttribute: jest.fn(),
        querySelector: jest.fn().mockReturnValue(targetCell),
        focus: jest.fn(),
      } as unknown as HTMLElement;
      eventCell = {
        key: "the cell that evt triggered",
        closest: jest.fn().mockReturnValue(baseElement),
        setAttribute: jest.fn(),
      } as unknown as HTMLElement;
      currentTarget = eventCell;
      rootElement = {
        getElementsByClassName: () => [cell, cell],
      } as unknown as HTMLElement;
    });

    it("should reset the cells tab index that event has been triggered on", () => {
      triggerFunction();
      expect(eventCell.setAttribute).toHaveBeenCalledTimes(1);
      expect(eventCell.setAttribute).toHaveBeenCalledWith("tabIndex", "-1");
    });

    it("should focus on the closest sn table cell of the column adjuster", () => {
      triggerFunction();
      expect(eventCell.closest).toHaveBeenCalledTimes(1);
      expect(baseElement.querySelector).toHaveBeenCalledTimes(1);
      expect(baseElement.querySelector).toHaveBeenCalledWith(".sn-table-head-menu-button");
      expect(targetCell.focus).toHaveBeenCalledTimes(1);
    });

    describe("when isNewHeadCellMenuEnabled flag is true:", () => {
      beforeEach(() => {
        isNewHeadCellMenuEnabled = true;
      });

      it("should focus on the closest New Head Cell menu of the column adjuster", () => {
        triggerFunction();
        expect(eventCell.closest).toHaveBeenCalledTimes(1);
        expect(baseElement.querySelector).toHaveBeenCalledTimes(0);
        expect(baseElement.setAttribute).toHaveBeenCalledTimes(1);
        expect(baseElement.setAttribute).toHaveBeenCalledWith("tabIndex", "0");
        expect(baseElement.focus).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("updateFocus", () => {
    let focusType: FocusTypes;
    beforeEach(() => {
      focusType = FocusTypes.FOCUS;
    });

    it("should focus cell and call setAttribute when focusType is focus", () => {
      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.focus).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith("tabIndex", "0");
    });

    it("should focus button when focusType is focusButton", () => {
      focusType = FocusTypes.FOCUS_BUTTON;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(button?.focus).toHaveBeenCalledTimes(1);
    });

    it("should blur cell and call setAttribute when focusType is blur", () => {
      focusType = FocusTypes.BLUR;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.blur).toHaveBeenCalledTimes(1);
      expect(cell?.setAttribute).toHaveBeenCalledWith("tabIndex", "-1");
    });

    it("should call setAttribute when focusType is addTab", () => {
      focusType = FocusTypes.ADD_TAB;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(cell?.setAttribute).toHaveBeenCalledWith("tabIndex", "0");
    });

    it("should call setAttribute when focusType is removeTab", () => {
      focusType = FocusTypes.REMOVE_TAB;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.blur).not.toHaveBeenCalled();
      expect(cell?.setAttribute).toHaveBeenCalledWith("tabIndex", "-1");
    });

    it("should early return and not throw error when cell is undefined", () => {
      cell = undefined;
      expect(() => accessibilityUtils.updateFocus({ focusType, cell })).not.toThrow();
    });

    it("should do nothing for invalid focusType", () => {
      focusType = "invalid" as FocusTypes;

      accessibilityUtils.updateFocus({ focusType, cell });
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(cell?.blur).not.toHaveBeenCalled();
      expect(cell?.setAttribute).not.toHaveBeenCalled();
    });
  });

  describe("resetFocus", () => {
    let shouldRefocus: React.MutableRefObject<boolean>;
    let isSelectionMode: boolean;
    let announce: Announce;
    let totalsPosition: TotalsPosition;
    let isNewHeadCellMenuEnabled: boolean;

    const resetFocus = () =>
      accessibilityUtils.resetFocus({
        focusedCellCoord,
        rootElement,
        shouldRefocus,
        isSelectionMode,
        setFocusedCellCoord,
        keyboard,
        announce,
        totalsPosition,
        isNewHeadCellMenuEnabled,
      });

    beforeEach(() => {
      focusedCellCoord = [2, 1];
      shouldRefocus = { current: false };
      isSelectionMode = false;
      keyboard.enabled = true;
      keyboard.active = true;
      totalsPosition = { atTop: false, atBottom: true };
      announce = jest.fn();
    });

    it("should only remove tabIndex when keyboard.enabled is true and keyboard.active is false", () => {
      keyboard.enabled = true;
      keyboard.active = false;

      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 0]);
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it("should set tabindex on the first cell and not focus", () => {
      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 0]);
      expect(cell?.focus).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it("should set tabindex on the first cell and focus when shouldRefocus is true", () => {
      shouldRefocus.current = true;

      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 0]);
      expect(cell?.focus).toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalled();
    });

    it("should set tabindex on the second cell in currently focused column when isSelectionMode is true", () => {
      isSelectionMode = true;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;

      resetFocus();
      expect(cell?.setAttribute).toHaveBeenCalledTimes(2);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([1, 1]);
      expect(cell?.focus).not.toHaveBeenCalled();
    });

    it("should set focus on the first body cell when isSelectionMode is true and totals is on top", () => {
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;
      isSelectionMode = true;
      focusedCellCoord = [5, 0];
      totalsPosition = { atTop: true, atBottom: false };

      resetFocus();
      expect(setFocusedCellCoord).toHaveBeenCalledWith([2, 0]);
    });

    it("should announce cell content and selection status for non selected first cell after focusing on it", () => {
      cell = { ...cell, textContent: "#something" } as HTMLElement;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;
      isSelectionMode = true;

      resetFocus();
      expect(announce).toHaveBeenCalledWith({
        keys: ["#something,", "SNTable.SelectionLabel.NotSelectedValue"],
      });
    });

    it("should announce cell content and selection status for selected first cell after focusing on it", () => {
      const tmpCell = global.document.createElement("td");
      tmpCell?.classList.add("selected");

      cell = { ...cell, classList: tmpCell?.classList, textContent: "#something" } as HTMLElement;
      const row = { getElementsByClassName: () => [cell, cell] };
      rootElement = {
        getElementsByClassName: () => [row, row],
        querySelector: () => cell,
      } as unknown as HTMLElement;
      isSelectionMode = true;

      resetFocus();
      expect(announce).toHaveBeenCalledWith({
        keys: ["#something,", "SNTable.SelectionLabel.SelectedValue"],
      });
    });

    describe("when isNewHeadCellMenuEnabled flag is true:", () => {
      beforeEach(() => {
        isNewHeadCellMenuEnabled = true;
      });

      test("should reset focus on first head cell if not in selection mode", () => {
        resetFocus();

        expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
        expect(setFocusedCellCoord).toHaveBeenCalledWith([0, 0]);
      });
    });
  });

  describe("handleFocusoutEvent", () => {
    let containsRelatedTarget: boolean;
    let focusoutEvent: FocusEvent;
    let shouldRefocus: React.MutableRefObject<boolean>;
    let announcement1: {
      innerHTML: string;
    };
    let announcement2: {
      innerHTML: string;
    };

    beforeEach(() => {
      containsRelatedTarget = false;
      announcement1 = { innerHTML: "firstAnnouncement" };
      announcement2 = { innerHTML: "secondAnnouncement" };
      focusoutEvent = {
        currentTarget: {
          contains: () => containsRelatedTarget,
          querySelector: (identifier: string) => (identifier.slice(-1) === "1" ? announcement1 : announcement2),
        },
        relatedTarget: {
          closest: () => undefined,
        },
      } as unknown as FocusEvent;
      shouldRefocus = { current: false };
      keyboard = { blur: jest.fn(), focus: jest.fn(), focusSelection: jest.fn(), enabled: true, active: false };
    });

    it("should call blur and remove announcements when currentTarget does not contain relatedTarget, shouldRefocus is false and keyboard.enabled is true", () => {
      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).toHaveBeenCalledWith(false);
      expect(announcement1.innerHTML).toBe("");
      expect(announcement2.innerHTML).toBe("");
    });

    it("should not call blur when currentTarget contains relatedTarget", () => {
      containsRelatedTarget = true;

      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it("should not call blur when shouldRefocus is true", () => {
      shouldRefocus.current = true;

      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it("should not call blur when keyboard.enabled is false", () => {
      keyboard.enabled = false;

      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });

    it("should not call blur when relatedTarget is in the header menu", () => {
      (focusoutEvent.relatedTarget as HTMLElement).closest = () => ({}); // .closest = () => {};

      accessibilityUtils.handleFocusoutEvent(focusoutEvent, shouldRefocus, keyboard);
      expect(keyboard.blur).not.toHaveBeenCalled();
    });
  });

  describe("announceSelectionState", () => {
    let isSelected: boolean;
    let announce: Announce;
    let nextCell: HTMLElement;
    let isSelectionMode: boolean;

    beforeEach(() => {
      isSelected = false;
      announce = jest.fn() as Announce;
      nextCell = {
        classList: {
          contains: () => isSelected,
        },
      } as unknown as HTMLElement;
      isSelectionMode = false;
    });

    it("should do nothing when not in selection mode", () => {
      accessibilityUtils.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).not.toHaveBeenCalled();
    });

    it("should call announce with SelectedValue key when in selection mode and value is selected", () => {
      isSelectionMode = true;
      isSelected = true;
      accessibilityUtils.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).toHaveBeenCalledWith({ keys: ["SNTable.SelectionLabel.SelectedValue"] });
    });

    it("should Call announce with NotSelectedValue key when in selection mode and value is not selected", () => {
      isSelectionMode = true;
      accessibilityUtils.announceSelectionState(announce, nextCell, isSelectionMode);
      expect(announce).toHaveBeenCalledWith({ keys: ["SNTable.SelectionLabel.NotSelectedValue"] });
    });
  });

  describe("removeTabAndFocusCell", () => {
    const newCoord: [number, number] = [1, 1];

    it("should call setFocusedCellCoord but not keyboard.focus when keyboard.enabled is false", () => {
      keyboard.enabled = false;
      accessibilityUtils.removeTabAndFocusCell(newCoord, rootElement, setFocusedCellCoord, keyboard);
      expect(setFocusedCellCoord).toHaveBeenCalledWith(newCoord);
      expect(keyboard.focus).not.toHaveBeenCalled();
    });

    it("should call update setFocusedCellCoord but not keyboard.focus when keyboard.enabled is true and active is true", () => {
      keyboard.active = true;
      accessibilityUtils.removeTabAndFocusCell(newCoord, rootElement, setFocusedCellCoord, keyboard);
      expect(setFocusedCellCoord).toHaveBeenCalledWith(newCoord);
      expect(keyboard.focus).not.toHaveBeenCalled();
    });

    it("should call update setFocusedCellCoord and keyboard.focus when keyboard.enabled is true and active is false", () => {
      accessibilityUtils.removeTabAndFocusCell(newCoord, rootElement, setFocusedCellCoord, keyboard);
      expect(setFocusedCellCoord).toHaveBeenCalledWith(newCoord);
      expect(keyboard.focus).toHaveBeenCalledTimes(1);
    });
  });

  describe("focusBodyFromHead", () => {
    let otherCell: HTMLElement;

    beforeEach(() => {
      otherCell = { ...cell } as HTMLElement;
      rootElement = {
        getElementsByClassName: (className: string) =>
          className === "sn-table-cell" ? [otherCell, otherCell, otherCell, cell, otherCell, otherCell] : [cell, cell],
      } as unknown as HTMLElement;
      jest.spyOn(getElementUtils, "findCellWithTabStop").mockImplementation(() => cell as HTMLElement);
      jest.spyOn(getElementUtils, "getCellElement").mockImplementation(() => cell as HTMLElement);
    });

    it("should call findCellWithTabStop and setFocusedCellCoord and setFocusedCellCoord with coord [2, 1] when cell with tabstop is found", () => {
      accessibilityUtils.focusBodyFromHead(rootElement, setFocusedCellCoord);
      expect(getElementUtils.findCellWithTabStop).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith([2, 1]);
    });

    it("should call findCellWithTabStop, getCellElement and setFocusedCellCoord and setFocusedCellCoord with coord [2, 1] when cell with tabstop is found", () => {
      cell = undefined;
      accessibilityUtils.focusBodyFromHead(rootElement, setFocusedCellCoord);
      expect(getElementUtils.findCellWithTabStop).toHaveBeenCalledTimes(1);
      expect(getElementUtils.getCellElement).toHaveBeenCalledTimes(1);
      expect(getElementUtils.getCellElement).toHaveBeenCalledWith(rootElement, FIRST_BODY_CELL_COORD);
      expect(setFocusedCellCoord).toHaveBeenCalledTimes(1);
      expect(setFocusedCellCoord).toHaveBeenCalledWith(FIRST_BODY_CELL_COORD);
    });
  });
});
