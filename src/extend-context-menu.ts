// @ts-expect-error  TODO: remove tag when onContextMenu is declared in nebula/stardust
import { onContextMenu } from "@nebula.js/stardust";
import copyCellValue from "./table/utils/copy-utils";

export default function extendContextMenu() {
  onContextMenu?.((menu: any, event: Event) => {
    const target = event.target as HTMLElement | null;
    const cellElement = target?.closest<HTMLElement>(".sn-table-cell");
    cellElement &&
      menu.addItem({
        translation: "contextMenu.copyCellValue",
        icon: "lui-icon lui-icon--copy",
        tid: "copy-cell-context-item",
        select: async () => {
          copyCellValue(cellElement);
        },
      });
  });
}
