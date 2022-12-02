import { useEffect, useMemo, useRef, useState } from 'react';
import { PageInfo, TableLayout } from '../../../../types';

type ClearOnDepsChanged = [TableLayout, PageInfo];

const useQueue = <T>(onLoad: (value: T[]) => Promise<void>, deps: ClearOnDepsChanged) => {
  const [layout, pageInfo] = deps;
  const queued = useRef(new Map<string, T>());
  const loaded = useRef(new Set<string>());
  const [shouldAbort, setShouldAbort] = useState(false); // TODO does not work

  const queue = useMemo(
    () => ({
      enqueue: (key: string, item: T) => {
        if (loaded.current.has(key)) {
          return;
        }

        queued.current.set(key, item);
        loaded.current.add(key);
      },
      load: async () => {
        if (queued.current.size === 0) {
          return;
        }

        const items = Array.from(queued.current.values());
        queued.current.clear();

        if (shouldAbort) {
          return;
        }
        await onLoad(items);
      },
    }),
    [queued, loaded, onLoad, shouldAbort]
  );

  useEffect(() => {
    setShouldAbort(false);
    queued.current.clear();
    loaded.current.clear();

    return () => {
      setShouldAbort(true);
    };
  }, [layout, pageInfo]);

  useEffect(() => console.log('shouldAbort', shouldAbort), [shouldAbort]);

  return queue;
};

export default useQueue;
