import { generateRandomString } from '../utils';

describe('generateRandomString', () => {
  it('should return random string', () => {
    const length = 10;
    const randomString = generateRandomString(length);
    expect(randomString).to.be.a('string');
    expect(randomString.length).to.equal(length);
  });
});
