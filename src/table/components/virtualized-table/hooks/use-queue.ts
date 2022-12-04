import { useEffect, useMemo, useRef, useState } from 'react';
import { PageInfo, TableLayout } from '../../../../types';
import useOnPropsChange from './use-on-props-change';

type ClearOnDepsChanged = [TableLayout, PageInfo];

export interface AbortablePromise {
  isCancelled: boolean;
  isLoaded: boolean;
  pagesToRetrieve: EngineAPI.INxDataPage[];
}

const useQueue = (
  fetchHandler: (pages: EngineAPI.INxPage[]) => Promise<EngineAPI.INxDataPage[]>,
  onResolved: (dataPages: EngineAPI.INxDataPage[]) => void,
  deps: ClearOnDepsChanged
) => {
  const [layout, pageInfo] = deps;
  const queued = useRef(new Map<string, EngineAPI.INxPage>());
  const loaded = useRef(new Set<string>());
  const ongoing = useRef(new Set<AbortablePromise>());

  useOnPropsChange(() => {
    // Cancel all ongoing requests
    ongoing.current.forEach((abortablePromise) => {
      abortablePromise.isCancelled = true;
    });

    ongoing.current.clear();
    queued.current.clear();
    loaded.current.clear();
  }, [layout, pageInfo]);

  const queue = useMemo(
    () => ({
      enqueue: (key: string, page: EngineAPI.INxPage) => {
        if (loaded.current.has(key)) {
          return;
        }

        queued.current.set(key, page);
        loaded.current.add(key);
      },
      load: async () => {
        if (queued.current.size === 0) {
          return;
        }

        const pagesToRetrieve = Array.from(queued.current.values());
        queued.current.clear();

        const abortablePromise: AbortablePromise = { isCancelled: false };

        try {
          ongoing.current.add(abortablePromise);
          const dataPages = await fetchHandler(pagesToRetrieve);

          // console.log('isCancelled', abortablePromise.isCancelled);
          if (!abortablePromise.isCancelled) {
            // console.log('calling onResolved', dataPages);
            onResolved(dataPages);
          }
        } catch (error) {
          console.error('failed to load', error);
        } finally {
          ongoing.current.delete(abortablePromise);
        }
      },
    }),
    [queued, loaded, fetchHandler, onResolved]
  );

  return queue;
};

export default useQueue;
