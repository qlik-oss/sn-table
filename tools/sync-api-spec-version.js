/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const fileName = path.resolve(cwd, 'api-specifications/properties.json');
const apiSpecProperties = require(fileName);
const { version } = require(path.resolve(cwd, 'package.json'));

apiSpecProperties.info.version = version;

fs.writeFile(fileName, JSON.stringify(apiSpecProperties, null, 2), (err) => {
  if (err) throw err;
});
