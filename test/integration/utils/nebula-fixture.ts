import path from 'path';
import serve, { NebulaServer } from '@nebula.js/cli-serve';
import createNebulaRoutes from '../../rendering/utils/routes';

type Route = {
  renderFixture: (path: string) => Promise<string>;
};

class NebulaFixture {
  public theme;

  public themeType;

  public language;

  public renderUrl: string | undefined;

  public nebulaServer: NebulaServer | undefined;

  public route: Route | undefined;

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
    this.route = createNebulaRoutes(this.nebulaServer.url) as unknown as Route;
  }

  async renderFixture(fileName: string) {
    const fixturePath = `./${fileName}&theme=${this.themeType}&language=${this.language}`;
    this.renderUrl = await this.route?.renderFixture(fixturePath);
    return this.getRenderUrl();
  }

  getRenderUrl() {
    return this.renderUrl as string; // Assume that it has been assigned a value
  }

  async teardown() {
    this.nebulaServer?.close();
  }
}

export default NebulaFixture;
