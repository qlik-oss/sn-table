import { createGenerateClassName, createTheme } from '@material-ui/core/styles';
import * as muiConfig from './mui-config.json';

export default function muiSetup() {
  // Currently importing a reduced copy of sprout, should be replaced with the open-source version of sprout ASAP
  if (muiConfig.overrides) {
    muiConfig.overrides.MuiListItem.root['&$selected'] = {};
    muiConfig.overrides.MuiSelect.root['& ~i'].padding = '6px';
    muiConfig.overrides.MuiTableSortLabel.root.color = 'inherit';
    muiConfig.overrides.MuiTableSortLabel.root['&$active'].color = 'inherit';
    muiConfig.overrides.MuiTableSortLabel.root['&:hover'].color = 'inherit';
    muiConfig.overrides.MuiTableRow.hover['&&:hover'].backgroundColor = 'rgba(0, 0, 0, 0)';
    muiConfig.overrides.MuiTableCell.root.height = 'auto';
    muiConfig.overrides.MuiTableCell.root.lineHeight = '130%';
    muiConfig.overrides.MuiTableCell.head.height = 'auto';
    muiConfig.overrides.MuiTableCell.head.lineHeight = '150%';
    muiConfig.overrides.MuiTableCell.root['&:focus'] = {
      boxShadow: '0 0 0 2px #3f8ab3 inset',
      outline: 'none',
    };
  }

  const theme = createTheme(muiConfig);
  const generateClassName = createGenerateClassName({
    productionPrefix: `${process.env.PACKAGE_VERSION}`,
    disableGlobal: true,
    seed: `sn-t-${Date.now()}`,
  });

  return { theme, generateClassName };
}
