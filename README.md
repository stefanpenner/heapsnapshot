# heapsnapshot
[![Build Status](https://travis-ci.org/stefanpenner/heapsnapshot.svg?branch=master)](https://travis-ci.org/stefanpenner/heapsnapshot)

A Programmatic API for a heapsnapshot.

Currently supports dumps from:
* chrome/v8

usage:
* `yarn add heapsnapshot`
* `npm install heapsnapshot`

heaps can be quite large, and this library isn't terribly efficient yet so at times you may need to run with note with `node --max_old_space_size=4096 <script-name>`

```js
const Heapsnapshot = require('heapsnapshot');
const snapshot = Heapsnapshot.fromFileSync(__dirname + '/container.heapsnapshot');

// TODO: iterate for building (so we can do it eventually incrementally)
snapshot.buildSync(); // alternatively build() is a generator, which allows for incremental building.

// get all nodes
const nodes = [...snapshot.nodeIterator()];
const containers = node.filter(x => x.type === 'object' && x.name === 'Container');

let path = Heapsnapshot.pathToRoot(containers[0]);
console.log(path.join(' -> '));
// => <Container:622248> -> <Class:140976> -> <Window / http://localhost:4200:13800> -> root
```


### Stuff

#### Node

```js
node.in // => array in in-bound edges
node.out // => array in in-bound edges
node.toString() // => "<Container: 622248>"
```

#### Edge

```js
edge.to // => node the edge points to
edge.from // => node the edge comes from
edge.toString() // => "<name: from(Container: 622248) to ((map descriptors): 625980)"
```
