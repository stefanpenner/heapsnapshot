'use strict';

const Node = require('../lib/node')
const expect = require('chai').expect;

describe('Node', function() {
  const snapshot = {
    inEdgesFor(node) {
      if (node.index === 1) {
        return [];
      } else if (node.index === 2) {
        return ['IN-EDGE-PLACEHOLDER']
      } else {
        throw new TypeError(`no such node${node}`);
      }
    },
    outEdgesFor(node) {
      if (node.index === 1) {
        return [];
      } else if (node.index === 2) {
        return ['OUT-EDGE-PLACEHOLDER']
      } else {
        throw new TypeError(`no such node${node}`);
      }
    },
    EDGE_SIZE: 7
  };

  describe('toString', function() {
    it('with name', function() {
      let node = new Node(snapshot, 1, 0, 'hi');
      expect(node.toString()).to.eql('<hi: 1>');
    });

    it('with no name', function() {
      let node = new Node(snapshot, 1, 0);
      expect(node.toString()).to.eql('<(unknown node): 1>');
    });
  });

  describe('edge_end', function() {
    it('works', function() {
      let node = new Node(snapshot, 0, 0, 'name', 1, 1, 0, 5 /* edge count */, 0);
      node.edge_start = 5;
      expect(node.edge_end).to.eql(5 /* EDGE_COUNT */* 7 /* EDGE_SIZE*/ + 5 /* EDGE_START */);
    });
  });

  describe('in', function() {
    it('returns an empty array if it has no IN edges', function() {
      let node = new Node(snapshot, 1);
      expect(node.in).to.deep.eql([]);
    });

    it('returns an populated array if it has IN edges', function() {
      let node = new Node(snapshot, 2);
      expect(node.in).to.deep.eql(['IN-EDGE-PLACEHOLDER']);
    });
  });

  describe('out', function() {
    it('returns an empty array if it has no OUT edges', function() {
      let node = new Node(snapshot, 1);
      expect(node.out).to.deep.eql([]);
    });

    it('returns an populated array if it has IN edges', function() {
      let node = new Node(snapshot, 2);
      expect(node.out).to.deep.eql(['OUT-EDGE-PLACEHOLDER']);
    });
  });

  describe('toStringContent', function() {
    it('includes name if present', function() {
      let node = new Node(snapshot, 22, 0, 'my-name')
      expect(node.toStringContent()).to.eql('my-name: 22')
    });

    it('handles no known name', function() {
      let node = new Node(snapshot, 22, 0, null);
      expect(node.toStringContent()).to.eql('(unknown node): 22');
    });
  });

  describe('toString', function() {
    it('wraps toStringContent with angle brackets', function() {
      let node = new Node();
      let content = `to-stirng-content-${Math.random()}`;
      node.toStringContent = function() {
        return content;
      };

      expect(node.toString()).to.eql(`<${content}>`)
    });
  });
});
