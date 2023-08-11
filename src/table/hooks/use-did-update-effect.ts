import React, { useEffect, useRef } from 'react';

export default function useDidUpdateEffect(effect: () => void, deps: React.DependencyList) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      effect();
    } else {
      didMountRef.current = true;
    }
  }, deps);
}
