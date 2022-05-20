import { isDarkColor, isTransparentColor } from './table/utils/color-utils';

export default function tableThemeColors(theme) {
  const qvInnerObject = document.querySelector('.qv-object .qv-inner-object');
  const objectBackgroundColorFromCSS = qvInnerObject && window.getComputedStyle(qvInnerObject).backgroundColor;

  const qvPanelSheet = document.querySelector('.qv-panel-sheet');
  const sheetBackgroundColorFromCSS = qvPanelSheet && window.getComputedStyle(qvPanelSheet).backgroundColor;

  const tableBackgroundColorFromTheme = theme.getStyle('', '', 'object.straightTable.backgroundColor');

  const backgroundColor = tableBackgroundColorFromTheme || objectBackgroundColorFromCSS;
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
}
