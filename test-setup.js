const { JSDOM } = require('jsdom');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiDom = require('chai-dom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

chai.use(sinonChai);
chai.use(chaiDom);
