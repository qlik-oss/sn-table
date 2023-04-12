export function indexAdded(array, index) {
  let i;
  for (i = 0; i < array.length; ++i) {
    if (array[i] >= 0 && array[i] >= index) {
      ++array[i];
    }
  }
  array.push(index);
}

export function indexRemoved(array, index) {
  let removeIndex = 0;
  let i;
  for (i = 0; i < array.length; ++i) {
    if (array[i] > index) {
      --array[i];
    } else if (array[i] === index) {
      removeIndex = i;
    }
  }
  array.splice(removeIndex, 1);
  return removeIndex;
}

export function min(nDimsOrMeas) {
  return nDimsOrMeas > 0 ? 0 : 1;
}

export function getDescription(env) {
  return env.translator.get('Visualizations.Descriptions.Column');
}

export default function getData(env) {
  return {
    measures: {
      min,
      max: 1000,
      description: () => getDescription(env),
      add(measure, data, hcHandler) {
        const { qColumnOrder } = hcHandler.hcProperties;
        const ix = hcHandler.getDimensions().length + hcHandler.getMeasures().length - 1;
        indexAdded(qColumnOrder, ix);
      },
      remove(measure, data, hcHandler, idx) {
        const { qColumnOrder } = hcHandler.hcProperties;
        const columnIx = (hcHandler.hcProperties.qDimensions ? hcHandler.hcProperties.qDimensions.length : 0) + idx;
        indexRemoved(qColumnOrder, columnIx);
      },
    },
    dimensions: {
      min,
      max: 1000,
      description: () => getDescription(env),
      add(dimension, data, hcHandler) {
        const { qColumnOrder } = hcHandler.hcProperties;
        const ix = hcHandler.getDimensions().length - 1;
        indexAdded(qColumnOrder, ix);

        return dimension;
      },
      remove(dimension, data, hcHandler, idx) {
        if (dimension?.isAlternative) return;
        const { qColumnOrder } = hcHandler.hcProperties;
        indexRemoved(qColumnOrder, idx);
      },
    },
  };
}
