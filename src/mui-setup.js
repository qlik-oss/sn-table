import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';

export default function muiSetup(sproutBase) {
  if (sproutBase.overrides) {
    sproutBase.overrides.MuiTableContainer.root.height = 'calc(100% - 52px)';
    sproutBase.overrides.MuiListItem.root['&$selected'] = {};
    sproutBase.overrides.MuiSelect.root['& ~i'].padding = '6px';
    sproutBase.overrides.MuiTableSortLabel.root.color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&$active'].color = 'inherit';
    sproutBase.overrides.MuiTableSortLabel.root['&:hover'].color = 'inherit';
    sproutBase.overrides.MuiTableRow.hover['&&:hover'].backgroundColor = 'rgba(0, 0, 0, 0)';
    sproutBase.overrides.MuiTableCell.root.height = 'auto';
    sproutBase.overrides.MuiTableCell.root.lineHeight = '130%';
    sproutBase.overrides.MuiTableCell.head.height = 'auto';
    sproutBase.overrides.MuiTableCell.head = {
      lineHeight: '150%',
      position: '-webkit-sticky' /* Safari */,
      // eslint-disable-next-line no-dupe-keys
      position: 'sticky',
      top: '0',
      zIndex: '1',
      boxShadow: 'inset 0 1px 0 #D9D9D9, inset 0 -1px 0 #D9D9D9',
      ...sproutBase.overrides.MuiTableCell.head,
    };
    sproutBase.overrides.MuiTableCell.root['&:focus'] = {
      boxShadow: '0 0 0 2px #3f8ab3 inset',
      outline: 'none',
    };
  }

  const theme = createMuiTheme(sproutBase);
  const generateClassName = createGenerateClassName({
    productionPrefix: 'sn-t',
    disableGlobal: true,
    seed: Date.now(),
  });

  return { theme, generateClassName };
}
