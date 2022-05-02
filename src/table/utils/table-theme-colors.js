import { isDarkColor } from './color-utils';

export default function tableThemeColors(theme) {
  const backgroundColor = theme.getStyle('object', 'straightTable', 'backgroundColor');
  const isBackgroundDarkColor = isDarkColor(theme.backgroundColor);
  const borderColor = theme.isBackgroundDarkColor ? ' #F2F2F2' : '#D9D9D9';
  const body = {
    borderColor: theme.isBackgroundDarkColor ? '1px solid #F2F2F2' : '1px solid #D9D9D9',
  };
  const pagination = {
    borderColor: theme.isBackgroundDarkColor ? '1px solid #F2F2F2' : '1px solid #D9D9D9',
    color: isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.9)' : '#404040',
    iconColor: isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.54)',
    disabledIconColor: isBackgroundDarkColor ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
  };

  return { backgroundColor, isBackgroundDarkColor, borderColor, body, pagination };
}
