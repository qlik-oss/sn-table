import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';

export default function muiSetup(sproutBase) {
  if (sproutBase.overrides) {
    /* eslint-disable no-param-reassign */
    sproutBase.overrides.MuiTableContainer.root.height = 'calc(100% - 52px)';
    sproutBase.overrides.MuiListItem.root['&$selected'] = {};
    sproutBase.overrides.MuiSelect.root['& ~i'].padding = '6px';
    sproutBase.overrides.MuiTableSortLabel.root.color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&$active'].color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&:hover'].color = 'inherit';
    /* eslint-enable no-param-reassign */
  }

  const theme = createMuiTheme(sproutBase);
  const generateClassName = createGenerateClassName({
    productionPrefix: 'sn-t',
    disableGlobal: true,
    seed: Date.now(),
  });

  return { theme, generateClassName };
}
