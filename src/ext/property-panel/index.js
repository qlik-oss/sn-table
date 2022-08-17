import createData from './data';
import settings from './settings';

const sorting = {
  uses: 'sorting',
};

const addOns = {
  type: 'items',
  component: 'expandable-items',
  translation: 'properties.addons',
  items: {
    dataHandling: {
      uses: 'dataHandling',
      items: {
        calcCond: {
          uses: 'calcCond',
        },
      },
    },
  },
};

const getPropertyPanelDefinition = (env) => {
  return {
    type: 'items',
    component: 'accordion',
    items: {
      data: createData(env),
      sorting,
      addOns,
      settings: settings(env),
    },
  };
};

export default getPropertyPanelDefinition;
