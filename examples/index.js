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

let ignored = [];
const pathToRoot = require('../lib/path-to-root');
console.log('testing');

let visited = new WeakSet()
let path;
let count = 0;
while(path = pathToRoot(containers[0], visited)) {
  if (path.length < 2) { continue; }
  count++;
  visited = new WeakSet()
  ignored.push(path[1]);
  ignored.forEach(node => visited.add(node))
  console.log(`path ${count}:`, path.join(' -> '));
}
