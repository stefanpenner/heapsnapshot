'use strict';

module.exports = function pathToRoot(node) {
  let visited =  arguments[1] || new WeakSet();
  let fromEdge = arguments[2];
  if (visited.has(node)) { return; }
  visited.add(node);

  let from = fromEdge ? fromEdge.from : node

  if (node.index === 0) { return [node.name || 'root']; }

  for (let edge of node.in) {
    if (edge.type === 'weak') { continue; }
    let path = pathToRoot(edge.from, visited, edge);
    if (path) {
      return [from].concat(path);
    }
  }

  return [];
};
