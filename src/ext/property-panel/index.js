import getData from './data';
import getSettings from './settings';

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
      data: getData(env),
      sorting,
      addOns,
      settings: getSettings(env),
    },
  };
};

export default getPropertyPanelDefinition;
