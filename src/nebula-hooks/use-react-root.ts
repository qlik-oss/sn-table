/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from '@nebula.js/stardust';
import ReactDom, { createRoot } from 'react-dom/client';

import { mount } from '../table/Root';

export default function useReactRoot(rootElement: HTMLElement) {
  const [reactRoot, setReactRoot] = useState<ReactDom.Root | undefined>(undefined);

  useEffect(() => {
    if (rootElement) {
      setReactRoot(createRoot(rootElement));
      mount(rootElement); // only does something in native env
    }
  }, [rootElement]);

  return reactRoot;
}
