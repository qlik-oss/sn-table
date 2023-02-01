import { Cell } from '../../../types';
import { ItemData } from '../types';

interface Props {
  rowIndex: number;
  columnIndex: number;
  data: ItemData;
}

const getCellItemKey = ({ columnIndex, data, rowIndex }: Props) => {
  const cell = data.rowsInPage[rowIndex]?.[`col-${columnIndex}`] as Cell;

  return `${cell?.qElemNumber}-${cell?.qText}-${rowIndex}-${columnIndex}`;
};

export default getCellItemKey;
