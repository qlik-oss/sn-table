export default (baseUrl) => ({
  fixture: () => `${baseUrl}/fixture`,
  render: (key) => `${baseUrl}/render?fixture=${key}`,
});
