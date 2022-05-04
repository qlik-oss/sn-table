import { useMemo } from 'react';
import { useRootContext } from '../contexts/RootContext';
import announcementFactory from '../table/utils/announcement-factory';

const useAnnounce = () => {
  // console.log(useRootContext);
  const {
    nebulaProps: { rootElement, translator },
  } = useRootContext();
  const announce = useMemo(() => announcementFactory(rootElement, translator), [translator.language]);
  return announce;
  // return {};
};

export default useAnnounce;
