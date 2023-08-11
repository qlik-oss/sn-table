import { useMemo, useTheme } from '@nebula.js/stardust';
import { isDarkColor, isTransparentColor } from '../table/utils/color-utils';
import { ExtendedTheme, BackgroundColors } from '../types';

/**
 * The colors in the table can depend on background colors set on table, object and sheet level.
 * Even though not officially supported, it is expected that css settings on object and sheet are respected.
 * The priority order is: table theme > object css > object theme
 * If the result for object/table background is transparent, the sheet css color is used
 */
export const getBackgroundColors = (theme: ExtendedTheme, rootElement: HTMLElement): BackgroundColors => {
  const qvInnerObject = rootElement?.closest('.qv-object .qv-inner-object');
  const objectColorFromCSS = qvInnerObject && window.getComputedStyle(qvInnerObject).backgroundColor;

  const qvPanelSheet = rootElement?.closest('.qv-panel-sheet');
  const sheetColorFromCSS = qvPanelSheet && window.getComputedStyle(qvPanelSheet).backgroundColor;

  // tableColorFromTheme is undefined if nothing is set specifically for object.straightTableV2.backgroundColor
  const tableColorFromTheme = theme.getStyle('', '', 'object.straightTableV2.backgroundColor');
  // colorFromTheme traverses the theme tree until it finds a value for backgroundColor
  // it is undefined if there is no value
  const colorFromTheme = theme.getStyle('object', 'straightTableV2', 'backgroundColor');

  const color = tableColorFromTheme || objectColorFromCSS || colorFromTheme;
  const isTransparent = isTransparentColor(color);
  const isDark = isDarkColor(isTransparent ? sheetColorFromCSS : color);

  return {
    tableColorFromTheme: tableColorFromTheme || 'inherit',
    color,
    isDark,
    isTransparent,
  };
};

const useExtendedTheme = (rootElement: HTMLElement): ExtendedTheme => {
  // TODO: add name method to stardust.Theme
  const nebulaTheme = useTheme() as ExtendedTheme;
  return useMemo(
    () => ({ ...nebulaTheme, background: getBackgroundColors(nebulaTheme, rootElement) } as ExtendedTheme),
    [nebulaTheme.name(), rootElement]
  );
};

export default useExtendedTheme;
