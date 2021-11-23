import { useEffect } from 'react';
import { handleScroll, handleNavigateTop } from '../table/utils/handle-scroll';

export const useScroll = ({ tableSectionRef, focusedCellCoord, rootElement }) => {
  useEffect(() => {
    const scrollCallback = (evt) => handleScroll(evt, tableSectionRef);
    tableSectionRef.current && tableSectionRef.current.addEventListener('wheel', scrollCallback);

    return () => {
      tableSectionRef.current.removeEventListener('wheel', scrollCallback);
    };
  }, []);

  useEffect(() => {
    handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement });
  }, [tableSectionRef, focusedCellCoord]);
};
