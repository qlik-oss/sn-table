import { useEffect } from '@nebula.js/stardust';
import { mount } from '../table/Root';

export default function useReactRoot(element) {
  useEffect(() => {
    if (element) {
      mount(element);
    }
  }, [element]);
  return element;
}
