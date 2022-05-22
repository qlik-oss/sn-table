import connect from './connect';
import embed from './configure';
import './style.css';

(async () => {
  const app = await connect();
  const nuked = embed(app);

  nuked.selections().then((selections) => selections.mount(document.getElementById('selections')));

  // create a session object
  nuked.render({
    element: document.querySelector('.object'),
    type: 'table',
    fields: ['Sales Quantity', '=Sum([Sales Quantity])'],
  });

  const fields = ['Sales Quantity', '=Sum([Sales Quantity])'];

  for (let index = 0; index < 90; index++) {
    fields.push('Sales Quantity');
  }
  console.log('🚀 ~ file: main.js ~ line 19 ~ fields', fields);

  // create another session object
  nuked.render({
    element: document.querySelectorAll('.object')[1],
    type: 'table',
    fields,
    options: {
      // direction: 'rtl',
    },
    properties: {
      qHyperCubeDef: {
        qMeasures: [
          {
            qDef: {
              qDef: '=Sum([Sales Quantity])',
              textAlign: {
                auto: false,
                align: 'left',
              },
            },
          },
        ],
      },
    },
  });
})();
