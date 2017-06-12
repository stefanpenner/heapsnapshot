'use strict';

const Heapsnapshot = require('../');

function rank(node, value = 0) {
  if (node.distance > value) {
    node.distance = value;
  }
  node.distance = value;
  value++;
  node.in.forEach(edge => rank(edge.from, value));
}

console.log('reading');
const snapshot = Heapsnapshot.fromFileSync(__dirname + '/container.heapsnapshot');

// build
console.log('building');
for (let _ of snapshot.build()) { }

console.log('all')
let all = [...snapshot.nodeIterator()];
// let allEdges = [...snapshot.edgeIterator()];

console.log('searching...')
let containers = all.filter(x => x.type === 'object' && x.name === 'Container');
// let container = all.find(x => x.name === '__container__');
// let self      = all.find(x => x.name === 'self');
// let app       = all.find(x => x.name === 'MyBundledApp');

function pathToRoot(node, visited = new WeakSet(), fromEdge) {
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
}

let ignored = [];

console.log('testing');

let visited = new WeakSet()
let path;
let count = 0;
while(path = pathToRoot(containers[0], visited)) {
  count++;
  visited = new WeakSet()
  ignored.push(path[1]);
  ignored.forEach(node => visited.add(node))
  console.log(`path ${count}:`, path.join(' -> '));
}
