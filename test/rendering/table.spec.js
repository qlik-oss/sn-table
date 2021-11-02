import fs from 'fs';
import path from 'path';
import serve from '@nebula.js/cli-serve';
import createPuppet from './utils/puppet';
import events from './utils/events';
import createRoutes from './utils/routes';
import createFixtureService from './utils/fixtures';

const paths = {
  artifacts: path.join(__dirname, '__artifacts__'),
  data: path.join(__dirname, '__data__'),
};

describe('sn table: Rendering tests', () => {
  let s;
  let puppet;
  let routes;
  let fixtures;

  before(async () => {
    s = await serve({
      entry: path.resolve(__dirname, '../../'),
      type: 'sn-table',
      open: false,
      build: false,
      themes: [],
    });

    puppet = createPuppet(page);
    routes = createRoutes(s.url);
    fixtures = createFixtureService(routes);
  });

  after(async () => {
    // s.close();
  });

  beforeEach(() => {
    events.addListeners(page);
  });

  afterEach(() => {
    events.removeListeners(page);
  });

  fs.readdirSync(paths.data).forEach((file) => {
    const name = file.replace('.json', '');
    const fixturePath = path.join(paths.data, file);

    it(name, async () => {
      // Upload fixture to Nebula serve
      const { fixture } = await fixtures.upload(fixturePath);
      // Open page in Nebula which renders fixture
      await puppet.open(routes.render(fixture.key));
      console.log(routes.render(fixture.key));
      // Capture screenshot
      const img = await puppet.screenshot();

      expect(img).to.matchImageOf(name, { artifactsPath: paths.artifacts }, 0.01);
    });
  });
});
