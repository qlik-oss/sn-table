/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from '@nebula.js/stardust';
import React, { createRoot } from 'react-dom/client';

import { mount } from '../table/Root';

export default function useReactRoot(rootElement: HTMLElement) {
  const [reactRoot, setReactRoot] = useState<React.Root | undefined>(undefined);

  useEffect(() => {
    if (rootElement) {
      setReactRoot(createRoot(rootElement));
      mount(rootElement);
    }
  }, [rootElement]);

  return reactRoot;
}
