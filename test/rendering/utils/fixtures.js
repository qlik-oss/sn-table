import fs from 'fs';

const fetch = require('cross-fetch');

export default (routes) => ({
  read(fixturePath) {
    return JSON.parse(fs.readFileSync(fixturePath));
  },
  async upload(fixturePath) {
    const fixture = this.read(fixturePath);
    const response = await fetch(routes.fixture(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fixture),
    });
    const responseJson = await response.json();
    return { fixture, response: responseJson };
  },
});
