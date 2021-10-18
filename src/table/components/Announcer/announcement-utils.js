import { SN_TABLE_EVENT_TYPES, ASSERTIVE_PRESSURE, ANNOUNCEMENT_TYPES } from './constants';

// handle pagination by calling `emitAnnouncement` in pagination related components
// handle sorting by calling `emitAnnouncement` in table head
export const emitAnnouncement = ({
  announcementType = 'some-announcement-type',
  politness = ASSERTIVE_PRESSURE.ASSERTIVE,
  shouldBeAtomic = false,
  shouldBubble = true,
  message = '',
  notationDependencies = {},
} = {}) => {
  // TODO:
  //  - this function would create an announcment evt
  //  - dispatches this event
  const announcementEvent = new CustomEvent(SN_TABLE_EVENT_TYPES.EMIT_ANNOUNCEMENT, {
    bubbles: shouldBubble,
    detail: {
      announcementType,
      politness,
      shouldBeAtomic,
      message: message || getAnnouncementNotation({ announcementType, ...notationDependencies }),
    },
  });

  document.activeElement.dispatchEvent(announcementEvent);
};

export const getCellSelectionStatusNote = (rows, translator) =>
  rows.length === 1
    ? translator.get('SNTable.SelectionLabel.OneSelectedValue')
    : translator.get('SNTable.SelectionLabel.SelectedValues', [rows.length]);

const getMemoisedAnnouncementNotation = (prevCount) => {
  let prevSelectedCount = prevCount || 0;
  let hasJunkChar = 0;

  return ({
    announcementType,
    rootElement,
    selectionState,
    focusedCellCoord,
    isActiveElementInTable,
    translator,
  } = {}) => {
    if (!focusedCellCoord || !isActiveElementInTable) return '';

    const [rowIdx, colIdx] = focusedCellCoord;
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[rowIdx]?.getElementsByClassName('sn-table-cell')[colIdx];

    // const tColumnName = tableData.columns[y].label;
    // const cellContent = cell && cell.innerText;
    const isCellSelected = cell && cell.classList.contains('selected');

    let notation = '';

    switch (announcementType) {
      case ANNOUNCEMENT_TYPES.FOCUS_TYPE:
        if (selectionState.rows.length === 0 && prevSelectedCount > 0) {
          // if we deselect last (selected) cell which means we close the selection mode
          notation = translator.get('SNTable.SelectionLabel.ExitedSelectionMode');
        }

        prevSelectedCount = selectionState.rows.length;
        break;

      case ANNOUNCEMENT_TYPES.SELECTION_TYPE:
        if (selectionState.rows.length) {
          const selectionNote = getCellSelectionStatusNote(selectionState.rows, translator);

          if (prevSelectedCount < selectionState.rows.length) {
            // if we select cell
            notation += `${translator.get('SNTable.SelectionLabel.SelectedValue')} ${selectionNote}`;
          } else if (prevSelectedCount > selectionState.rows.length) {
            // if we deselect cell
            notation += `${translator.get('SNTable.SelectionLabel.DeselectedValue')} ${selectionNote}`;
          } else if (isCellSelected) {
            // if we are in selection mode and move to selected cell
            notation += translator.get('SNTable.SelectionLabel.SelectedValue');
          } else {
            // if we are in selection mode and move to unselected cell
            notation += translator.get('SNTable.SelectionLabel.NotSelectedValue');
          }
        }

        prevSelectedCount = selectionState.rows.length;
        break;

      default:
        notation = 'some announcment';
        break;
    }

    // Junk char addition
    if (hasJunkChar % 2) notation += ` ­`;
    hasJunkChar++;

    return notation;
  };
};

export const getAnnouncementNotation = getMemoisedAnnouncementNotation();
