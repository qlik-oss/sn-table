import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';

export default function muiSetup(isActive, sproutBase) {
  if (sproutBase.overrides) {
    /* eslint-disable no-param-reassign */
    sproutBase.overrides.MuiTableContainer.root.height = 'calc(100% - 52px)';
    sproutBase.overrides.MuiTableContainer.root.overflow = !isActive ? 'auto' : 'hidden';
    sproutBase.overrides.MuiPaper = { root: { height: '100%' } };
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
