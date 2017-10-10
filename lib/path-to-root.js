'use strict';

const Node = require('./node');
const ROOT = new Node(null, 0, 'root');
module.exports = function pathToRoot(node, visited = new WeakSet(), fromEdge) {
  let path = _pathToRoot(node, visited, fromEdge);
  if (path.length > 0 && path[path.length - 1].index !== 0) {
    throw Error(`${node} has no path to root`);
  }
  return path;
};

function _pathToRoot(node, visited, fromEdge) {
  if (visited.has(node)) { return; }
  visited.add(node);

  let from = fromEdge ? fromEdge.from : node

  if (node.index === 0) {
    if (!node.name) { node.name = '(root)'; }
    return [node];
  }

  for (let edge of node.in) {
    if (edge.type === 'weak') { continue; }
    let path = _pathToRoot(edge.from, visited, edge);
    if (path) {
      return [from].concat(path);
    }
  }

  return [node];
}
