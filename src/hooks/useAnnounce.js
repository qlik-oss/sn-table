import { useMemo } from 'react';
import announcementFactory from '../table/utils/announcement-factory';

const useAnnounce = (props) => {
  // console.log(useRootContext);
  // const {
  //   nebulaProps: { rootElement, translator },
  // } = useRootContext();
  const announce = useMemo(() => announcementFactory(props.rootElement, props.translator), [props.translator.language]);
  return announce;
  // return {};
};

export default useAnnounce;
