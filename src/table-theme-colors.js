import { resolveExpression, isDarkColor } from './table/utils/color-utils';

export default function tableThemeColors(theme) {
  const qvInnerObject = document.querySelector('.qv-object .qv-inner-object');
  const backgroundColorFromCSS = qvInnerObject && window.getComputedStyle?.(qvInnerObject).backgroundColor;

  const tableBackgroundColorFromTheme = theme.getStyle('', '', 'object.straightTable.backgroundColor');
  const backgroundColorFromTheme = theme.getStyle('object', 'straightTable', 'backgroundColor');

  const backgroundColor = resolveExpression(
    tableBackgroundColorFromTheme || backgroundColorFromCSS || backgroundColorFromTheme
  );
  const isBackgroundDarkColor = isDarkColor(backgroundColor);

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
    tableBackgroundColor: tableBackgroundColorFromTheme,
    backgroundColor,
    isBackgroundDarkColor,
    borderColor,
    body,
    pagination,
  };
}
