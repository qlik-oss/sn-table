import { Cell } from '../../../types';

const getCellItemKey = ({ columnIndex, data, rowIndex }) => {
  const cell = data.rowsInPage[rowIndex]?.[`col-${columnIndex}`] as Cell;

  return `${cell?.qElemNumber}-${cell?.qText}-${rowIndex}-${columnIndex}`;
};

export default getCellItemKey;
