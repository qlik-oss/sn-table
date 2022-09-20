import { onContextMenu } from '@nebula.js/stardust';
import { copyCellValue } from '../table/utils/accessibility-utils';
import { Menu } from '../types';

export default function useContextMenu(areBasicFeaturesEnabled: boolean) {
  onContextMenu((menu: Menu, event: any) => {
    areBasicFeaturesEnabled &&
      event.target &&
      menu.addItem({
        translation: 'contextMenu.copyCellValue',
        icon: 'lui-icon lui-icon--copy',
        tid: 'copy-cell-context-item',
        select: async () => {
          copyCellValue(event.target.firstChild.textContent);
        },
      });
  });
}
