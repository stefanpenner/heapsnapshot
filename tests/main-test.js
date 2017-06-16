'use strict';

const expect = require('chai').expect;
const main  = require('../')
describe('main API', function() {
  it('has the correct API', function() {
    expect(main).to.be.a('function');
    expect(main.pathToRoot).to.be.a('function');
  });
});
