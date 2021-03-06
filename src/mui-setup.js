import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';

export default function muiSetup(sproutBase) {
  if (sproutBase.overrides) {
    sproutBase.overrides.MuiListItem.root['&$selected'] = {};
    sproutBase.overrides.MuiSelect.root['& ~i'].padding = '6px';
    sproutBase.overrides.MuiTableSortLabel.root.color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&$active'].color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&:hover'].color = 'inherit';
    sproutBase.overrides.MuiTableRow.hover['&&:hover'].backgroundColor = 'rgba(0, 0, 0, 0)';
    sproutBase.overrides.MuiTableCell.root.height = 'auto';
    sproutBase.overrides.MuiTableCell.root.lineHeight = '130%';
    sproutBase.overrides.MuiTableCell.head.height = 'auto';
    sproutBase.overrides.MuiTableCell.head.lineHeight = '150%';
    sproutBase.overrides.MuiTableCell.root['&:focus'] = {
      boxShadow: '0 0 0 2px #3f8ab3 inset',
      outline: 'none',
    };
  }

  const theme = createMuiTheme(sproutBase);
  const generateClassName = createGenerateClassName({
    productionPrefix: `${process.env.PACKAGE_VERSION}`,
    disableGlobal: true,
    seed: `sn-t-${Date.now()}`,
  });

  return { theme, generateClassName };
}
