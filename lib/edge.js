'use strict';

module.exports = class Edge {
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
    return `<edge: ${this.name_or_index} from(${this.from.toStringContent()}) to(${this.to.toStringContent()})>`;
  }
}
