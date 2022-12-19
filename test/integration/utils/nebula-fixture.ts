import path from 'path';
import serve from '@nebula.js/cli-serve';
import createNebulaRoutes from '../../rendering/utils/routes';

class NebulaFixture {
  public theme;

  public themeType;

  public language;

  public renderUrl;

  public nebulaServer;

  public route;

  constructor(theme: Object | Function, themeType: String, language: String) {
    this.theme = theme;
    this.themeType = themeType;
    this.language = language;
  }

  async setup() {
    this.nebulaServer = await serve({
      // the entry is equal to path.resolve(__dirname, '../../dist/sn-table.js'),
      // so before run the testing, yarn build should run first to generate /dist
      entry: path.resolve(__dirname, '../../../'),
      type: 'sn-table',
      open: false,
      build: false,
      themes: [
        {
          id: this.themeType,
          theme: this.theme,
        },
      ],
      fixturePath: 'test/integration/__fixtures__',
    });
    this.route = createNebulaRoutes(this.nebulaServer.url);
  }

  async renderFixture(fileName: string) {
    const fixturePath = `./${fileName}&theme=${this.themeType}&language=${this.language}`;
    this.renderUrl = await this.route.renderFixture(fixturePath);
    return this.getRenderUrl();
  }

  getRenderUrl() {
    return this.renderUrl;
  }

  async teardown() {
    this.nebulaServer.close();
  }
}

export default NebulaFixture;
