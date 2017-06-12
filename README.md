# heapsnapshot

usage:

* `yarn add heapsnapshot`
* `npm install heapsnapshot`


```js

const Heapsnapshot = require('heapsnapshot');
const snapshot = Heapsnapshot.fromFileSync(__dirname + '/container.heapsnapshot');

// TODO: iterate for building (so we can do it eventually incrementally)
for (let _ of snapshot.build()) { }

// get all nodes
const nodes = [...snapshot.nodeIterator()];
const containers = node.filter(x => x.type === 'object' && x.name === 'Container');

let path = Heapsnapshot.pathToRoot(containers[0]);
console.log(path.join(' -> '));
// => <Container:622248> -> <Class:140976> -> <Window / http://localhost:4200:13800> -> root
```
