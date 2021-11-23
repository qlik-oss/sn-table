import { useMemo } from 'react';
import { useRootContext } from '../contexts/rootContext';
import announcementFactory from '../table/utils/announcement-factory';

const useAnnounce = () => {
  const {
    nebulaProps: { rootElement, translator },
  } = useRootContext();
  const announce = useMemo(() => announcementFactory(rootElement, translator), [translator.language]);
  return announce;
};

export default useAnnounce;
