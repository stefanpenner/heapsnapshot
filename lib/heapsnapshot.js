'use strict';

const fs = require('fs');
const assert = require('assert');
const util = require('util');
const Node = require('./node');

// hack to get the node debug to not try to print these out...
const PARSED = new WeakMap();
const NODES = new WeakMap();
const EDGES = new WeakMap();
const NODE_INDEX_BY_DEPARTING_EDGE_INDEX = new WeakMap();
const IN_EDGES = new WeakMap();
const OUT_EDGES = new WeakMap();

module.exports = class Heapsnapshot {
  constructor(parsed) {
    PARSED.set(this, parsed);

    let meta        = this.meta = parsed.snapshot.meta;
    let node_fields = this.node_fields = meta.node_fields

    // offsets
    this.NODE_TYPE = node_fields.indexOf('type');
    this.NODE_NAME = node_fields.indexOf('name');
    this.NODE_ID = node_fields.indexOf('id');
    this.NODE_SELF_SIZE = node_fields.indexOf('self_size');
    this.NODE_EDGE_COUNT = node_fields.indexOf('edge_count');
    this.NODE_TRACE_NODE_ID = node_fields.indexOf('trace_node_id');
    this.NODE_TYPES = meta.node_types[this.NODE_TYPE];
    this.NODE_SIZE = node_fields.length;

    let edge_fields = meta.edge_fields;

    this.EDGE_TYPE = edge_fields.indexOf('type');
    this.EDGE_NAME_OR_INDEX = edge_fields.indexOf('name_or_index');
    this.EDGE_TO_NODE = edge_fields.indexOf('to_node');
    this.EDGE_TYPES = meta.edge_types[this.EDGE_TYPE];
    this.EDGE_SIZE = meta.edge_fields.length;

    // validate
    const NODE_TOTAL = this.NODE_TOTAL = parsed.nodes.length / this.NODE_SIZE;
    assert.equal(NODE_TOTAL, NODE_TOTAL | 0);

    const EDGE_TOTAL = this.EDGE_TOTAL = parsed.edges.length / this.EDGE_SIZE;
    assert.equal(EDGE_TOTAL, EDGE_TOTAL | 0);

    NODES.set(this, Object.create(null));
    EDGES.set(this, Object.create(null));
    NODE_INDEX_BY_DEPARTING_EDGE_INDEX.set(this, Object.create(null));
    IN_EDGES.set(this, Object.create(null));

    this.root = null;
  }

  summary() {
    const iterator = this.nodeIterator();
    let summary = Object.create(null);
    for (let node of iterator) {
      summary[node.type] = summary[node.type] || 0;
      summary[node.type]++;
    }

    return summary;
  }

  static fromFileSync(filePath) {
    return new this(JSON.parse(fs.readFileSync(filePath, 'UTF8')));
  }

  * build() {
    let index = 0;
    let edge = 0;
    let parsed = PARSED.get(this);
    let nodes = NODES.get(this);
    let edges = EDGES.get(this);
    let OMG = NODE_INDEX_BY_DEPARTING_EDGE_INDEX.get(this);

    while (parsed.nodes.length > index) {
      let node = nodes[index] = this._createNode(index);
      node.edge_start = edge;
      edge += (node.edge_end - edge);

      for (let i = node.edge_start; i < node.edge_end; i += this.EDGE_SIZE) {
        OMG[i] = node.index;
      }
      yield;
      index += this.NODE_SIZE;
    }


    for (let i = 0; i < parsed.edges.length; i += this.EDGE_SIZE) {
      edges[i] = this._createEdge(i);
      yield;
    }

    let in_edges = IN_EDGES.get(this);
    Object.keys(edges).forEach(i => {
      let edge = edges[i];
      in_edges[edge.to_index] = in_edges[edge.to_index] || [];
      in_edges[edge.to_index].push(edge);
    });

    this.root = this.nodeForIndex(0);
  }

  * nodeIterator() {
    let index = 0;
    let parsed = PARSED.get(this);

    while(parsed.nodes.length > index) {
      yield this.nodeForIndex(index);
      index += this.NODE_SIZE;
    }
  }

  * edgeIterator() {
    let index = 0;
    let parsed = PARSED.get(this);

    while (parsed.edges.length > index) {
      yield this.edgeForIndex(index);
      index += this.EDGE_SIZE;
    }
  }

  _createEdge(index) {
    let parsed = PARSED.get(this);
    let edges = parsed.edges;

    let type = this.EDGE_TYPES[edges[index + this.EDGE_TYPE]];
    let name_org_index = edges[index + this.EDGE_NAME_OR_INDEX];
    let to_index = edges[index + this.EDGE_TO_NODE];
    let from_index = NODE_INDEX_BY_DEPARTING_EDGE_INDEX.get(this)[index];

    return new Edge(this, type, name_org_index, from_index, to_index);
  }

  inEdgesFor(node) {
    return IN_EDGES.get(this)[node.index] || [];
  }

  outEdgesFor(node) {
    let result = OUT_EDGES.get(node);
    if (result) { return result; }
    let all = PARSED.get(this).edges;
    let edges = [];
    for (let i = node.edge_start; i < node.edge_end; i += this.EDGE_SIZE) {
      edges.push(this.edgeForIndex(i));
    }
    OUT_EDGES.set(node, edges);
    return edges;
  }

  _createNode(index) {
    let number = index / this.NODE_SIZE;
    let parsed = PARSED.get(this);
    let nodes = parsed.nodes;
    let strings = parsed.strings;

    // 'type', 'name', 'id', 'self_size', 'edge_count', 'trac
    let type = this.NODE_TYPES[parsed.nodes[index + this.NODE_TYPE]];
    if (type === undefined) {
      // strange, sometimes we have a type value of 12, but never greater...
      // console.log(`index: ${index} value: ${parsed.nodes[index + NODE_TYPE]}`);
    }

    let name = strings[parsed.nodes[index + this.NODE_NAME]];
    let id = nodes[index + this.NODE_ID];
    let self_size = nodes[index + this.NODE_SELF_SIZE];
    let edge_count = nodes[index + this.NODE_EDGE_COUNT];
    let trace_node_id = nodes[index + this.NODE_TRACE_NODE_ID];

    return new Node(this, index, number, name, type, id, self_size, edge_count, trace_node_id);
  }

  nodeForIndex(index) {
    let node = NODES.get(this)[index];
    if (node === undefined) {
      throw new Error(`unknonw node for index: ${index}`)
    }

    return node;
  }

  edgeForIndex(index) {
    let edge = EDGES.get(this)[index];

    if (edge === undefined) {
      throw new Error(`unknonw edge for index: ${index}`)
    }

    return edge;
  }


  nodeToEdge(edge) {
    return this.nodeForIndex(NODE_INDEX_BY_DEPARTING_EDGE_INDEX.get(this)[edge.index]);
  }
}

class Edge {
  constructor(snapshot, type, name_or_index, from_index, to_index) {
    this._snapshot = snapshot;
    this.type = type;
    this.name_or_index = name_or_index;
    this.to_index = to_index;
    this.from_index = from_index;
  }

  get to() {
    return this._snapshot.nodeForIndex(this.to_index);
  }

  get from() {
    return this._snapshot.nodeForIndex(this.from_index);
  }

  toString() {
    return `<edge:${this.name_or_index} from: ${from.toStringContent()} to ${to.toStringContent()}>`;
  }
};
