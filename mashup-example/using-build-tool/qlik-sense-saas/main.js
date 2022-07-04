/* eslint-disable */
import embed from './configure';
import connect from './connect';
import './style.css';

async function run() {
  const app = await connect({
    url: 'wastelands.us.qlikcloud.com', // 'xxxx.us.qlik.com',
    webIntegrationId: 'TGzZjWAv7OK6F4lp0oQhf_7Y-XCK_DtN', // 'xxx-xxxxxxx-xxxxxxxx',
    appId: '95ab782b-1d7d-4ecc-acaa-4dd17a3841da', // 'xxxx-xxx-xxx-xxx-xxxxxxx',
  });

  const nuked = embed(app);

  (await nuked.selections()).mount(document.querySelector('.toolbar'));

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
  });
}

run();
