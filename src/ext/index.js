import getPropertyPanelDefinition from './property-panel';
import getData from './data';

export default function ext(env) {
  return {
    definition: getPropertyPanelDefinition(env),
    data: getData(env),
    support: {
      export: true,
      exportData: true,
      snapshot: true,
      viewData: false,
    },
  };
}
