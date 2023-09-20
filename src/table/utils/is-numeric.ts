import { Cell } from "../../types";

export const isNumeric = (val: string | number) => !Number.isNaN(+val);

export const isNumericCell = (cell: EngineAPI.INxCell | Cell) =>
  !!((cell.qNum || cell.qNum === 0) && isNumeric(cell.qNum));
