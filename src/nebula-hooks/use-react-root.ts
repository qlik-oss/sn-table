/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from '@nebula.js/stardust';
import React, { createRoot } from 'react-dom/client';

export default function useReactRoot(rootElement: HTMLElement) {
  const [reactRoot, setReactRoot] = useState<React.Root | undefined>(undefined);

  useEffect(() => {
    rootElement && setReactRoot(createRoot(rootElement));
  }, [rootElement]);

  return reactRoot;
}
