// @ts-expect-error  TODO: remove tag when onContextMenu is declared in nebula/stardust
import { onContextMenu } from "@nebula.js/stardust";
import copyCellValue from "./table/utils/copy-utils";

export default function extendContextMenu() {
  onContextMenu?.((menu: { addItem: (i: unknown) => void }, event: React.MouseEvent<Element>) => {
    event.target &&
      (event.target as HTMLElement).closest(".sn-table-cell") &&
      menu.addItem({
        translation: "contextMenu.copyCellValue",
        icon: "lui-icon lui-icon--copy",
        tid: "copy-cell-context-item",
        select: async () => {
          copyCellValue(event);
        },
      });
  });
}
