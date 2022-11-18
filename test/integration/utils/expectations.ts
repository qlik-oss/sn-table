type Collection = { [key: string]: any };
type Key =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Enter'
  | 'Tab'
  | 'Space'
  | 'Control+Space'
  | 'Shift+Tab'
  | 'Meta+Shift+ArrowRight'
  | 'Meta+Shift+ArrowLeft'
  | 'Escape';


function getStep(key: Key, times: number = 1): Collection {
  return { key, times };
}

const expectations: Collection = {
  scenario_1: {
    steps: [
      {
        step: 1,
        description: 'cmd/ctrl + shift + right to change to next',
        keys: [getStep('Meta+Shift+ArrowRight')],
        page: 2,
        buttonsDisabled: ['false', 'false', 'false', 'false'],
      },
      {
        step: 2,
        description: 'cmd/ctrl + shift + left to change to prev',
        keys: [getStep('Meta+Shift+ArrowLeft')],
        page: 1,
        buttonsDisabled: ['true', 'true', 'false', 'false'],
      },
    ],
  },
}

export { expectations };