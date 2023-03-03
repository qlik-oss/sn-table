// @ts-ignore  TODO: remove tag when onContextMenu is declared in nebula/stardust
import { onContextMenu } from '@nebula.js/stardust';
import copyCellValue from '../table/utils/copy-utils';

const tagNamesWhiteList = new Set(['TD', 'TH']);

export default function useContextMenu(areBasicFeaturesEnabled: boolean) {
  onContextMenu?.((menu: any, event: any) => {
    areBasicFeaturesEnabled &&
      event.target &&
      tagNamesWhiteList.has(event.target.closest('.sn-table-cell')?.tagName) &&
      menu.addItem({
        translation: 'contextMenu.copyCellValue',
        icon: 'lui-icon lui-icon--copy',
        tid: 'copy-cell-context-item',
        select: async () => {
          copyCellValue(event);
        },
      });
  });
}
