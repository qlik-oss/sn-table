import { createTheme } from '@mui/material/styles';
import * as muiConfig from './mui-config.json';

export default function muiSetup(direction) {
  // Currently importing a reduced copy of sprout, should be replaced with the open-source version of sprout ASAP
  if (muiConfig.components) {
    muiConfig.components.MuiTable.styleOverrides.root = {};
  }

  return createTheme({ ...muiConfig, direction });
}
