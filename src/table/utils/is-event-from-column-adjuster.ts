import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";

const isEventFromColumnAdjuster = (evt: React.MouseEvent | React.KeyboardEvent) =>
  (evt.target as HTMLElement | SVGElement)?.getAttribute("class")?.includes(COLUMN_ADJUSTER_CLASS);

export default isEventFromColumnAdjuster;
