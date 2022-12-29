declare module '@nebula.js/cli-serve' {
  export type NebulaServer = { url: string; close: () => Promise<void> };

  export default async function serve(config: unknown): Promise<NebulaServer>;
}
