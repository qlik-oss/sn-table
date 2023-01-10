import { useState } from 'react';
import { TableLayout } from '../../../../types';

const useHoverEffect = (layout: TableLayout) => {
  const showHoverEffect = !!layout.components?.[0]?.content?.hoverEffect;

  return {
    showHoverEffect,
  };
};

export default useHoverEffect;
