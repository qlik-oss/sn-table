// @ts-ignore  TODO: remove tag when onContextMenu is declared in nebula/stardust
import { onContextMenu } from '@nebula.js/stardust';
import copyCellValue from '../table/utils/copy-utils';

export default function useContextMenu(areBasicFeaturesEnabled: boolean) {
  onContextMenu?.((menu: any, event: any) => {
    areBasicFeaturesEnabled &&
      event.target &&
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
