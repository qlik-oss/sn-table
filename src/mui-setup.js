import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';

export default function muiSetup(sproutBase) {
  if (sproutBase.overrides) {
    sproutBase.overrides.MuiListItem.root['&$selected'] = {};

    sproutBase.overrides.MuiTableBody = {
      root: {
        display: 'block',
        overflow: 'auto',
      },
    };

    sproutBase.overrides.MuiTableBody.root = {
      display: 'block',
      overflow: 'auto',
    };

    sproutBase.overrides.MuiTableRow.root = {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
    };

    sproutBase.overrides.MuiSelect.root['& ~i'].padding = '6px';
    sproutBase.overrides.MuiTableSortLabel.root.color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&$active'].color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&:hover'].color = 'inherit';
  }

  const theme = createMuiTheme(sproutBase);
  const generateClassName = createGenerateClassName({
    productionPrefix: 'sn-t',
    disableGlobal: true,
    seed: Date.now(),
  });

  return { theme, generateClassName };
}
