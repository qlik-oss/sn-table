import { BaseSyntheticEvent } from 'react';
import { stardust } from '@nebula.js/stardust';
import { AnnounceFn, TableCell, TotalsPosition } from '../../types';

interface ICellFocusProps {
  focusType: string;
  cell: HTMLTableCellElement | undefined;
}
interface IHandleResetFocusProps {
  focusedCellCoord: [number, number];
  rootElement: HTMLElement;
  shouldRefocus: React.MutableRefObject<boolean>;
  isSelectionMode: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  keyboard: stardust.Keyboard;
  announce: AnnounceFn;
}

export const getCellElement = (rootElement: HTMLElement, cellCoord: [number, number]) =>
  rootElement.getElementsByClassName('sn-table-row')[cellCoord[0]]?.getElementsByClassName('sn-table-cell')[
    cellCoord[1]
  ] as HTMLTableCellElement;

export const findCellWithTabStop = (rootElement: HTMLElement) =>
  rootElement.querySelector("td[tabindex='0'], th[tabindex='0']") as HTMLTableCellElement;

export const updateFocus = ({ focusType, cell }: ICellFocusProps) => {
  if (!cell) return;

  switch (focusType) {
    case 'focus':
      cell.focus();
      cell.setAttribute('tabIndex', '0');
      break;
    case 'blur':
      cell.blur();
      cell.setAttribute('tabIndex', '-1');
      break;
    case 'addTab':
      cell.setAttribute('tabIndex', '0');
      break;
    case 'removeTab':
      cell.setAttribute('tabIndex', '-1');
      break;
    default:
      break;
  }
};

export const removeAndFocus = (
  newCoord: [number, number],
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard
) => {
  updateFocus({ focusType: 'removeTab', cell: findCellWithTabStop(rootElement) });
  setFocusedCellCoord(newCoord);
  keyboard.enabled && keyboard.focus?.();
};

export const handleClickToFocusBody = (
  cell: TableCell,
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard,
  totalsPosition: TotalsPosition
) => {
  const { rawRowIdx, rawColIdx } = cell;
  const adjustedRowIdx = totalsPosition === 'top' ? rawRowIdx + 2 : rawRowIdx + 1;
  removeAndFocus([adjustedRowIdx, rawColIdx], rootElement, setFocusedCellCoord, keyboard);
};

export const handleClickToFocusHead = (
  columnIndex: number,
  rootElement: HTMLElement,
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>,
  keyboard: stardust.Keyboard
) => {
  removeAndFocus([0, columnIndex], rootElement, setFocusedCellCoord, keyboard);
};

export const handleMouseDownLabelToFocusHeadCell = (
  evt: BaseSyntheticEvent,
  rootElement: HTMLElement,
  columnIndex: number
) => {
  evt.preventDefault();
  updateFocus({ focusType: 'focus', cell: getCellElement(rootElement, [0, columnIndex]) });
};

export const handleResetFocus = ({
  focusedCellCoord,
  rootElement,
  shouldRefocus,
  isSelectionMode,
  setFocusedCellCoord,
  keyboard,
  announce,
}: IHandleResetFocusProps) => {
  updateFocus({ focusType: 'removeTab', cell: findCellWithTabStop(rootElement) });
  // If you have selections ongoing, you want to stay on the same column
  const cellCoord: [number, number] = isSelectionMode ? [1, focusedCellCoord[1]] : [0, 0];
  if (!keyboard.enabled || keyboard.active) {
    // Only run this if updates come from inside table
    const focusType = shouldRefocus.current ? 'focus' : 'addTab';
    shouldRefocus.current = false;
    const cell = getCellElement(rootElement, cellCoord);
    updateFocus({ focusType, cell });

    if (isSelectionMode) {
      const hasSelectedClassName = cell?.classList?.contains('selected');
      announce({
        keys: [
          `${cell.textContent},`,
          hasSelectedClassName ? 'SNTable.SelectionLabel.SelectedValue' : 'SNTable.SelectionLabel.NotSelectedValue',
        ],
      });
    }
  }
  setFocusedCellCoord(cellCoord);
};

export const handleFocusoutEvent = (
  evt: FocusEvent,
  shouldRefocus: React.MutableRefObject<boolean>,
  keyboard: stardust.Keyboard
) => {
  const targetElement = evt.currentTarget as HTMLDivElement;
  if (keyboard?.enabled && !targetElement.contains(evt.relatedTarget as Node) && !shouldRefocus.current) {
    targetElement.querySelector('#sn-table-announcer--01')!.innerHTML = '';
    targetElement.querySelector('#sn-table-announcer--02')!.innerHTML = '';
    // Blur the table but not focus its parent element
    // when keyboard.active is false, this has no effect
    // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
    keyboard.blur?.(false);
  }
};

export const focusSelectionToolbar = (element: HTMLElement, keyboard: stardust.Keyboard, last: boolean) => {
  const clientConfirmButton = element
    .closest('.qv-object-wrapper')
    ?.querySelector('.sel-toolbar-confirm')?.parentElement;
  if (clientConfirmButton) {
    clientConfirmButton.focus();
    return;
  }
  // @ts-ignore TODO: fix nebula api so that blur has the correct argument type
  keyboard.focusSelection?.(last);
};

export const announceSelectionState = (
  announce: AnnounceFn,
  nextCell: HTMLTableCellElement,
  isSelectionMode: boolean
) => {
  if (isSelectionMode) {
    const hasActiveClassName = nextCell.classList.contains('selected');
    hasActiveClassName
      ? announce({ keys: ['SNTable.SelectionLabel.SelectedValue'] })
      : announce({ keys: ['SNTable.SelectionLabel.NotSelectedValue'] });
  }
};
