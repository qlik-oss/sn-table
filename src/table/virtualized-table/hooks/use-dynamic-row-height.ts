import { useCallback } from 'react';
import { BodyStyle } from '../types';
import measureCell from '../utils/measure-cell';
import useMeasureText from './use-measure-text';

interface Props {
  bodyStyle: BodyStyle;
  rowHeight: number;
  columnWidth: number[];
}

const useDynamicRowHeight = ({ bodyStyle, rowHeight, columnWidth }: Props) => {
  const { measureText } = useMeasureText(bodyStyle.fontSize, bodyStyle.fontFamily);

  const memoizedMeasureCell = useCallback(
    (text: string, colIdx: number) => measureCell(rowHeight, text, columnWidth[colIdx], measureText),
    [measureText, rowHeight, columnWidth]
  );

  return { memoizedMeasureCell };
};

export default useDynamicRowHeight;
