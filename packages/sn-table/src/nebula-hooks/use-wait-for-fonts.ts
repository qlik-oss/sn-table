import { usePromise } from "@nebula.js/stardust";
import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import { getBodyStyle, getHeaderStyle } from "../table/utils/styling-utils";
import { TableLayout } from "../types";

const useWaitForFonts = (theme: ExtendedTheme, layout: TableLayout) => {
  const { fontSize: headerFontSize, fontFamily: headerFontFamily } = getHeaderStyle(layout, theme, false);
  const { fontSize, fontFamily } = getBodyStyle(layout, theme);

  const [isFontLoaded, error] = usePromise(async () => {
    await document.fonts.load(`600 ${headerFontSize} ${headerFontFamily}`);
    await document.fonts.load(`${fontSize} ${fontFamily}`);

    return true;
  }, [headerFontSize, headerFontFamily, fontSize, fontFamily]);

  // An error while loading fonts should not block the table from rendering. So if an error occur,
  // log the error and continue rendering the table
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to load font:", error);
    return true;
  }

  return !!isFontLoaded;
};

export default useWaitForFonts;
