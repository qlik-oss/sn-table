/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from '@nebula.js/stardust';
import { createRoot } from 'react-dom/client';

import { mount } from '../table/Root';

export default function useReactRoot(rootElement) {
  const [reactRoot, setReactRoot] = useState();

  useEffect(() => {
    if (rootElement) {
      setReactRoot(createRoot(rootElement));
      mount(rootElement);
    }
  }, [rootElement]);

  return reactRoot;
}
