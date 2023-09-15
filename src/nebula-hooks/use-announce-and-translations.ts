import { useMemo } from "@nebula.js/stardust";

import registerLocale from "../locale/src";
import { Announce, AnnounceArgs, ExtendedTranslator } from "../types";

enum AnnouncerElements {
  FIRST = "first-announcer-element",
  SECOND = "second-announcer-element",
}

/* creates the function for announcement */
export const announcementFactory = (
  rootElement: HTMLElement,
  translator: ExtendedTranslator,
  prevAnnounceEl?: string
): Announce => {
  let previousAnnouncementElement = prevAnnounceEl || null;

  /* updates the aria-live elements using the translation keys, makes sure it is announced every time it is called */
  return ({ keys, shouldBeAtomic = true, politeness = "polite" }: AnnounceArgs) => {
    const notation = keys
      .map((key) => {
        if (Array.isArray(key)) {
          const [actualKey, ...rest] = key;
          return translator.get(actualKey, rest);
        }
        return translator.get(key);
      })
      .join(" ");

    const announceElement1 = rootElement.querySelector(".sn-table-announcer-1") as Element;
    const announceElement2 = rootElement.querySelector(".sn-table-announcer-2") as Element;

    let announceElement: Element;
    if (previousAnnouncementElement === AnnouncerElements.FIRST) {
      announceElement = announceElement2;
      previousAnnouncementElement = AnnouncerElements.SECOND;
    } else {
      announceElement = announceElement1;
      previousAnnouncementElement = AnnouncerElements.FIRST;
    }

    announceElement.innerHTML = announceElement.innerHTML.endsWith(` ­`) ? notation : `${notation} ­`;
    announceElement.setAttribute("aria-atomic", shouldBeAtomic.toString());
    announceElement.setAttribute("aria-live", politeness);
  };
};

const useAnnounceAndTranslations = (rootElement: HTMLElement, translator: ExtendedTranslator) =>
  useMemo(() => {
    registerLocale(translator);
    return () => announcementFactory(rootElement, translator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootElement, translator.language()]);

export default useAnnounceAndTranslations;
