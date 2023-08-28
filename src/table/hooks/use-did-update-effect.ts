import React, { useEffect, useRef } from 'react';

export default function useDidUpdateEffect(effect: () => void, deps: React.DependencyList) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      effect();
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
