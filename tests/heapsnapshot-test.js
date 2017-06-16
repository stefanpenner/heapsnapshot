'use strict';

const expect = require('chai').expect;
const Heapsnapshot = require('../lib/heapsnapshot');
const path = require('path');
const fs = require('fs');

const EXAMPLE_PATH = path.join(__dirname, '../examples');

describe('Heapsnapshot', function() {
  let small;

  before(function() {
    small = Heapsnapshot.fromFileSync(EXAMPLE_PATH  + "/small.heapsnapshot")
    small.buildSync();
  });

  describe('fromFileSync', function() {

    it('parsed node_fields correctly', function() {
      expect(small.NODE_TYPE).to.eql(0);
      expect(small.NODE_NAME).to.eql(1);
      expect(small.NODE_ID).to.eql(2);
      expect(small.NODE_SELF_SIZE).to.eql(3);
      expect(small.NODE_TRACE_NODE_ID).to.eql(5);
      expect(small.NODE_TYPES).to.deep.eql([
        'hidden',
        'array',
        'string',
        'object',
        'code',
        'closure',
        "regexp",
        'number',
        'native',
        'synthetic',
        'concatenated string',
        'sliced string'
      ]);

      expect(small.NODE_SIZE).to.eql(6);
    });

    it('parsed edge_fields correctly', function() {
      expect(small.EDGE_TYPE).to.eql(0);
      expect(small.EDGE_NAME_OR_INDEX).to.eql(1);
      expect(small.EDGE_TO_NODE).to.eql(2);
      expect(small.EDGE_TYPES).to.deep.eql([
        'context',
        'element',
        'property',
        'internal',
        'hidden',
        'shortcut',
        'weak'
      ]);
      expect(small.EDGE_SIZE).to.eql(3);
    });

    it('has found number of nodes and edges', function() {
      expect(small.NODE_TOTAL).to.eql(34378);
      expect(small.EDGE_TOTAL).to.eql(147610);
    });
  });

  describe('summary', function() {
    it('works', function() {
      expect(small.summary()).to.deep.eql({
        array: 4418,
        closure: 4257,
        code: 3053,
        "concatenated string": 501,
        hidden: 16669,
        native: 2,
        number: 21,
        object: 1963,
        regexp: 3,
        string: 3457,
        synthetic: 21,
        undefined: 13
      });
    });
  });
});
