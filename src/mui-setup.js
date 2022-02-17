import { createTheme } from '@mui/material/styles';
import * as muiConfig from './mui-config.json';

export default function muiSetup(direction, theme) {
  // Currently importing a reduced copy of sprout, should be replaced with the open-source version of sprout ASAP
  if (muiConfig.components) {
    muiConfig.components.MuiIconButton.styleOverrides.root.padding = '0px 7px';
    muiConfig.components.MuiTable.styleOverrides.root = {};
    muiConfig.components.MuiTableSortLabel.styleOverrides.root.color = 'inherit';
    muiConfig.components.MuiTableSortLabel.styleOverrides.root['&.Mui-active'].color = 'inherit';
    muiConfig.components.MuiTableSortLabel.styleOverrides.root['&:hover'].color = 'inherit';
    muiConfig.components.MuiTableRow.styleOverrides.root['&&:hover'].backgroundColor = 'rgba(0, 0, 0, 0)';
    muiConfig.components.MuiTableCell.styleOverrides.root.padding = '7px 14px';
    muiConfig.components.MuiTableCell.styleOverrides.root.height = 'auto';
    muiConfig.components.MuiTableCell.styleOverrides.root.lineHeight = '130%';
    muiConfig.components.MuiTableCell.styleOverrides.head.height = 'auto';
    muiConfig.components.MuiTableCell.styleOverrides.head.lineHeight = '150%';
    muiConfig.components.MuiTableCell.styleOverrides.root['&:focus'] = {
      boxShadow: '0 0 0 2px #3f8ab3 inset',
      outline: 'none',
    };
    muiConfig.components.MuiTableContainer.styleOverrides.root = {};
    muiConfig.components.MuiToolbar.styleOverrides.root.color = theme.isBackgroundDarkColor ? '#ffffff' : '#404040';
    muiConfig.components.MuiFormLabel.styleOverrides.root.color = theme.isBackgroundDarkColor ? '#ffffff' : '#404040';
    muiConfig.components.MuiInputBase.styleOverrides.root = {
      backgroundColor: 'inherit',
    };
    muiConfig.components.MuiInputBase.styleOverrides.input.padding = '0px 12px';
    muiConfig.components.MuiInputBase.styleOverrides.input.border = '1px solid transparent';
    muiConfig.components.MuiOutlinedInput.styleOverrides.input.padding = '0px 12px';
    muiConfig.components.MuiNativeSelect.styleOverrides.outlined.border = '1px solid transparent';
    muiConfig.components.MuiNativeSelect.styleOverrides.icon = {
      color: theme.isBackgroundDarkColor ? '#ffffff' : '#404040',
    };
    muiConfig.components.MuiInputLabel.styleOverrides.outlined = {
      fontSize: 14,
      width: 'fit-content',
      position: 'relative',
      padding: 8,
      transform: 'none',
      fontWeight: 400,
    };
    muiConfig.components.MuiFormControl.styleOverrides.root.paddingLeft = 28;
    muiConfig.components.MuiFormControl.styleOverrides.root.paddingRight = 14;
  }

  return createTheme({ ...muiConfig, direction });
}
