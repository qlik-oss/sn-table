/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useTheme } from '@nebula.js/stardust';
import { isDarkColor, isTransparentColor } from '../table/utils/color-utils';
import { ExtendedTheme, TableThemeColors } from '../types';

export const tableThemeColors = (theme: ExtendedTheme, rootElement: HTMLElement): TableThemeColors => {
  const qvInnerObject = rootElement?.closest('.qv-object .qv-inner-object');
  const objectBackgroundColorFromCSS = qvInnerObject && window.getComputedStyle(qvInnerObject).backgroundColor;

  const qvPanelSheet = rootElement?.closest('.qv-panel-sheet');
  const sheetBackgroundColorFromCSS = qvPanelSheet && window.getComputedStyle(qvPanelSheet).backgroundColor;

  const tableBackgroundColorFromTheme = theme.getStyle('', '', 'object.straightTable.backgroundColor');

  const backgroundColorFromTheme = theme.getStyle('object', 'straightTable', 'backgroundColor');
  const backgroundColor = tableBackgroundColorFromTheme || objectBackgroundColorFromCSS || backgroundColorFromTheme;
  const isBackgroundTransparentColor = isTransparentColor(backgroundColor);
  const isBackgroundDarkColor = isDarkColor(
    isBackgroundTransparentColor ? sheetBackgroundColorFromCSS : backgroundColor
  );

  const BORDER_COLOR = isBackgroundDarkColor ? ' #F2F2F2' : '#D9D9D9';

  const borderColor = BORDER_COLOR;
  const body = { borderColor: BORDER_COLOR };
  const pagination = {
    borderColor: BORDER_COLOR,
    color: isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.9)' : '#404040',
    iconColor: isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.54)',
    disabledIconColor: isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
  };

  return {
    tableBackgroundColorFromTheme: tableBackgroundColorFromTheme || 'inherit',
    backgroundColor,
    isBackgroundTransparentColor,
    isBackgroundDarkColor,
    borderColor,
    body,
    pagination,
  };
};

const useExtendedTheme = (rootElement: HTMLElement): ExtendedTheme => {
  // TODO: add name method to stardust.Theme
  const nebulaTheme = useTheme() as ExtendedTheme;
  return useMemo(
    () => ({ ...nebulaTheme, table: tableThemeColors(nebulaTheme, rootElement) } as ExtendedTheme),
    [nebulaTheme.name(), rootElement]
  );
};

export default useExtendedTheme;
