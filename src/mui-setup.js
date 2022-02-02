import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { createGenerateClassName } from '@mui/styles';
import * as muiConfig from './mui-config.json';

export default function muiSetup(direction) {
  // Currently importing a reduced copy of sprout, should be replaced with the open-source version of sprout ASAP
  if (muiConfig.overrides) {
    muiConfig.overrides.MuiListItem.root['&$selected'] = {};
    muiConfig.overrides.MuiNativeSelect.select['& ~i'].padding = '6px';
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
    muiConfig.overrides.MuiToolbar = {
      regular: {
        minHeight: '49px !important',
      },
    };
    muiConfig.overrides.MuiTableContainer.root.borderBottom = '0';
  }

  const theme = createTheme(adaptV4Theme({ ...muiConfig, direction }));
  const generateClassName = createGenerateClassName({
    productionPrefix: `${process.env.PACKAGE_VERSION}`,
    disableGlobal: true,
    seed: `sn-t-${Date.now()}`,
  });

  return { theme, generateClassName };
}
