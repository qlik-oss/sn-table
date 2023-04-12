/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from '@nebula.js/stardust';
import { createRoot } from 'react-dom/client';

import { mount } from '../table/Root';

const useReactRoot = (rootElement: HTMLElement) => {
  const reactRoot = useMemo(() => {
    mount(rootElement);
    return createRoot(rootElement);
  }, [rootElement]);

  useEffect(() => () => reactRoot.unmount(), [reactRoot]);

  return reactRoot;
};

export default useReactRoot;
