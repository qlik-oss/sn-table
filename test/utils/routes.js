module.exports = (baseUrl) => ({
  renderFixture: (fixturePath) => `${baseUrl}/render?fixture=${fixturePath}`,
});
