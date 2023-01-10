import { useState } from 'react';
import { TableLayout } from '../../../../types';

const useHoverEffect = (layout: TableLayout) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const showHoverEffect = !!layout.components?.[0]?.content?.hoverEffect;

  return {
    hoverIndex,
    setHoverIndex,
    showHoverEffect,
  };
};

export default useHoverEffect;
