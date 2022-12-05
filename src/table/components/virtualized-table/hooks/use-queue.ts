import { useMemo, useRef } from 'react';
import { PageInfo, TableLayout } from '../../../../types';
import useOnPropsChange from './use-on-props-change';

type ClearOnDepsChanged = [TableLayout, PageInfo];

export interface AbortablePromise {
  isCancelled: boolean;
}

const useQueue = (
  fetchHandler: (pages: EngineAPI.INxPage[]) => Promise<EngineAPI.INxDataPage[]>,
  onResolved: (dataPages: EngineAPI.INxDataPage[]) => void,
  deps: ClearOnDepsChanged
) => {
  const [layout, pageInfo] = deps;
  const queued = useRef(new Map<string, EngineAPI.INxPage>()); // Keep track of all unique pages that should be retrieved
  const loaded = useRef(new Set<string>()); // Keep track of all unqiue pages that have been retried
  const ongoing = useRef(new Set<AbortablePromise>()); // Keep track of ongoing request and abort them if page is changed or layout is updated

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

        if (queued.current.size === 1) {
          queueMicrotask(async () => {
            const pagesToRetrieve = Array.from(queued.current.values());
            queued.current.clear();

            const abortablePromise: AbortablePromise = { isCancelled: false };
            ongoing.current.add(abortablePromise);

            try {
              const dataPages = await fetchHandler(pagesToRetrieve);
              if (!abortablePromise.isCancelled) {
                onResolved(dataPages);
              }
            } catch (error) {
              // TODO If this means that it failed to retrieve the pages they should be removed from "loaded" so they can be fetched again
            } finally {
              ongoing.current.delete(abortablePromise);
            }
          });
        }
      },
    }),
    [queued, loaded, fetchHandler, onResolved]
  );

  return queue;
};

export default useQueue;
