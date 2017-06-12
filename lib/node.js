'use strict';

module.exports = class Node {
  constructor(snapshot, index, number, name, type, id, self_size, edge_count, trace_node_id) {
    this.index = index;
    this.number = number;
    this.name = name;
    this.type = type;
    this.id = id;
    this.self_size = self_size;
    this.edge_count = edge_count;
    this.trace_node_id = this.trace_node_id;
    this.edge_start = - 1;
    this._snapshot = snapshot;
    this.distance = Infinity;
  }

  get edge_end() {
    return this.edge_start + this.edge_count * this._snapshot.EDGE_SIZE;
  }

  get in() {
    return this._snapshot.inEdgesFor(this);
  }

  get out() {
    return this._snapshot.outEdgesFor(this);
  }

  toStringContent() {
    return `${this.name || '(unknown node)'}:${this.index}`
  }
  toString() {
    return `<${this.toStringContent()}>`
  }
};
