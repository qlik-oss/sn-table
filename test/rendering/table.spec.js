import fs from 'fs';
import path from 'path';
import serve from '@nebula.js/cli-serve';
import createPuppet from './utils/puppet';
import events from './utils/events';
import createNebulaRoutes from './utils/routes';

const paths = {
  artifacts: path.join(__dirname, '__artifacts__'),
  fixtures: path.join(__dirname, '__fixtures__'),
};

describe('sn table: Rendering tests', () => {
  let s;
  let puppet;
  let route;

  before(async () => {
    s = await serve({
      // the entry is equal to path.resolve(__dirname, '../../dist/sn-table.js'),
      // so before run the testing, yarn build should run first to generate /dist
      entry: path.resolve(__dirname, '../../'),
      type: 'sn-table',
      open: false,
      build: false,
      themes: [],
      fixturePath: 'test/rendering/__fixtures__',
    });

    puppet = createPuppet(page);
    route = createNebulaRoutes(s.url);
  });

  after(async () => {
    s.close();
  });

  beforeEach(() => {
    events.addListeners(page);
  });

  afterEach(() => {
    events.removeListeners(page);
  });

  // Iterate testing fixture files
  fs.readdirSync(paths.fixtures).forEach((file) => {
    const name = file.replace('.fix.js', '');
    const fixturePath = `./${file}`;

    // Create test case per testing fixture file
    it(name, async () => {
      // Render chart based on testing fixture file
      // in Nebula serve using Enigma mocker
      const renderUrl = await route.renderFixture(fixturePath);
      console.log({ renderUrl });
      // Open page in Nebula which renders fixture
      await puppet.open(renderUrl);
      // Puppeteer Capture screenshot
      const img = await puppet.screenshot();
      // Compare screenshot with baseline image
      expect(img).to.matchImageOf(name, { artifactsPath: paths.artifacts }, 0.01);
    });
  });
});
