'use strict';

const Edge = require('../lib/edge')
const expect = require('chai').expect;

describe('Edge', function() {
  const snapshot = {
    nodeForIndex(x) {
      return {
        id: x,
        toStringContent() {
          return `node: ${x}`;
        }
      }
    }
  };

  describe('toString', function() {
    it('works', function() {
      let one = new Edge(snapshot, 'internal', 1, 2, 3);
      expect(one.toString()).to.match(/<edge: 1 from\(node\: 2\) to\(node\: 3\)>/);

      let two = new Edge(snapshot, 'internal', 2, 4, 6);
      expect(two.toString()).to.match(/<edge: 2 from\(node\: 4\) to\(node\: 6\)>/);
    });
  });

  describe('to/from', function() {
    it('works', function() {
      let one = new Edge(snapshot, 'internal', 1, 2, 3);

      expect(one.to.id).to.eql(3);
      expect(one.from.id).to.eql(2);
    });
  });
});
