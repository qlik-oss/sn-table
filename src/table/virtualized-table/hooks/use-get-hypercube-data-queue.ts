import { useMemo, useRef } from 'react';

export interface AbortablePromise {
  isCancelled: boolean;
}

const pageToKey = ({ qLeft, qTop, qWidth, qHeight }: EngineAPI.INxPage) => `${qLeft}-${qTop}-${qWidth}-${qHeight}`;

const useGetHyperCubeDataQueue = (
  getDataPages: (qPages: EngineAPI.INxPage[]) => Promise<EngineAPI.INxDataPage[]>,
  handleDataPages: (qDataPages: EngineAPI.INxDataPage[]) => void
) => {
  const queued = useRef(new Set<EngineAPI.INxPage>()); // Keep track of all unique pages that should be retrieved
  const ongoing = useRef(new Set<EngineAPI.INxPage[]>()); // Keep track of ongoing request. Should be aborted if page info or layout is changed
  const finished = useRef(new Set<string>()); // Keep track of all unqiue pages that have added to the queue

  const queue = useMemo(
    () => ({
      enqueue: (page: EngineAPI.INxPage, onBeforeHandlePages?: () => void) => {
        const key = pageToKey(page);

        if (finished.current.has(key)) {
          return;
        }

        queued.current.add(page);
        // Add to finished before it's actually finished. That makes it easier to check if the page should be retrieved or not
        // as otherwise all three sets (queued, ongoing and finished) have to be queried for presence.
        finished.current.add(key);

        if (queued.current.size === 1) {
          queueMicrotask(async () => {
            const qPages = Array.from(queued.current.values());

            queued.current.clear();
            ongoing.current.add(qPages);

            try {
              const qDataPages = await getDataPages(qPages);

              if (ongoing.current.has(qPages)) {
                onBeforeHandlePages?.();
                handleDataPages(qDataPages);
              }
            } catch (error) {
              // Could mean that it failed to retrieve or handle the data pages. Removed them from "finished" so they can be fetched again
              qPages.forEach((p) => {
                finished.current.delete(pageToKey(p));
              });
            } finally {
              ongoing.current.delete(qPages);
            }
          });
        }
      },
      clear: () => {
        queued.current.clear();
        ongoing.current.clear();
        finished.current.clear();
      },
    }),
    [getDataPages, handleDataPages]
  );

  return queue;
};

export default useGetHyperCubeDataQueue;
