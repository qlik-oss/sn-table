const route = (baseUrl: string) => ({
  renderFixture: (fixturePath: string) => `${baseUrl}/render?fixture=${fixturePath}`,
});

export default route;
