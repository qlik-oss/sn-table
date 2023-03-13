import getPropertyPanelDefinition from './property-panel';
import getData from './data';

const getExploration = (env) =>
  env.flags.isEnabled('PS_18291_TABLE_EXPLORATION') && {
    exploration: {
      component: 'items',
      items: {
        columnHandler: {
          component: 'column-handler',
          search: true,
          selectAll: false,
        },
      },
      classification: {
        tags: ['exploration'],
        exclusive: true,
      },
    },
  };

export default function ext(env) {
  return {
    definition: getPropertyPanelDefinition(env),
    ...getExploration(env),
    data: getData(env),
    support: {
      export: true,
      exportData: true,
      snapshot: true,
      viewData: false,
      exploration: true,
    },
  };
}
