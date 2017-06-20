'use strict';

const expect = require('chai').expect;
const pathToRoot = require('../lib/path-to-root');

describe('pathToRoot', function() {
  it('is a function', function() {
    expect(pathToRoot).to.be.a('function');
  });

  it('has arity of one', function() {
    expect(pathToRoot.length).to.eql(1);
  });

  describe('walking', function(){
    it('if root has no name, give it one', function() {
      expect(pathToRoot({ index: 0, in: [] })[0].name).to.eql('(root)');
    });

    it('supports common scenarios', function() {
      let root = {
        index: 0,
        in: [ ]
      };

      let two = {
        index: 2,
        in: [
          { from: root }
        ]
      };

      let one = {
        index: 1,
        in: [
          { from: two },
          { from: root }
        ]
      };

      expect(pathToRoot(root)).to.deep.eql([root]);
      expect(pathToRoot(one)).to.deep.eql([one, two, root]);
      expect(pathToRoot(two)).to.deep.eql([two, root]);
    });

    it('errors if no path to root can be found', function() {
      let root = {
        index: 0,
        in: [ ]
      };

      let two = {
        index: 2,
        in: [ ],
        toString() { return '<two:2>'; }
      };

      let one = {
        index: 1,
        in: [ { from: two }, ],
        toString() { return '<two:1>'; }
      };

      expect(() => pathToRoot(one)).to.throw(/has no path to root/);
      expect(() => pathToRoot(two)).to.throw(/has no path to root/);
    });

    it('supports skipping specific nodes', function() {
      let root = {
        index: 0,
        in: [ ]
      };

      let two = {
        index: 2,
        in: [
          { from: root }
        ]
      };

      let one = {
        index: 1,
        in: [
          { from: two },
          { from: root }
        ]
      };

      expect(pathToRoot(one, new WeakSet([two]))).to.deep.eql([one, root]);
    });
  });
});
