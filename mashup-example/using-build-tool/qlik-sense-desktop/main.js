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

  // create another session object
  nuked.render({
    element: document.querySelectorAll('.object')[1],
    type: 'table',
    fields: ['Sales Price', '=Sum([Sales Quantity]*[Sales Price])'],
    options: {
      direction: 'rtl',
    },
    properties: {
      components: [
        {
          content: {
            fontSize: 40,
          },
        },
      ],
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
      footnote: 'it is footnote',
    },
  });
})();
