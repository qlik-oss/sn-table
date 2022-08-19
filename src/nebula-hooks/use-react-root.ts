/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from '@nebula.js/stardust';
import { createRoot } from 'react-dom/client';

import { mount } from '../table/Root';

const useReactRoot = (rootElement: HTMLElement) =>
  useMemo(() => {
    mount(rootElement);
    return createRoot(rootElement);
  }, [rootElement]);

export default useReactRoot;
