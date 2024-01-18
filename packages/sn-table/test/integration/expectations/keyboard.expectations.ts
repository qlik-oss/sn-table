import { Collection, Key } from "../types";

function getStep(key: Key, times = 1): Collection {
  return { key, times };
}

const expectations: Collection = {
  before: {
    clickOnCell: "&lowbar;",
  },
  navigateWithArrows: {
    steps: [
      {
        step: 1,
        description: 'Press Arrow Up then the focused cell should be "&oline;"',
        keys: [getStep("ArrowUp")],
        content: "&oline;",
      },
      {
        step: 2,
        description: 'Press Arrow Right 4x then the focused cell should be "Low Line"',
        keys: [getStep("ArrowRight", 4)],
        content: "Low Line",
      },
      {
        step: 3,
        description: 'Press Arrow Down 2x then the focused cell should be "En Dash"',
        keys: [getStep("ArrowDown", 2)],
        content: "En Dash",
      },
      {
        step: 4,
        description: 'Press Arrow Left 3x then the focused cell should be "Hyphen"',
        keys: [getStep("ArrowLeft", 3)],
        content: "Hyphen",
      },
    ],
  },
};

export default expectations;
