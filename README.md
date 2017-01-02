# data-randomizer

## Installation

`npm install --save data-randomizer`

## Usage

```
const SEED = 'My example Seed asdf 1234';

let Randomizer = require('data-randomizer');

let random = Randomizer.create(SEED);

let randomId = random.integers(10000, 20000);

let randomName = random.phrases(3);

let mockProduct = {
    id: randomId(),
    name: randomName()
};
```

## Description

This module lets you create random data with arbitrary constraints.

It is pseudo-random, so it requires an arbitrary seed value to get started. Any string will do.
The purpose of the seed is to maintain consistency from one run to the next.
If you don't like the data being generated, then change the seed.

It is recursive, meaning that compound data structures will be treated as one iteration of the random sequence.
The purpose of the recursion is to maintain consistency among multiple items, regardless of how deep the data goes.
For example, if you generate an "atomic" value such as a number after a "compound" value such as an object,
even if you add key-value pairs to the object, the subsequent number will not change.
This is helpful when you want to keep as much of your existing structure as possible for a given seed.

## Methods

### (static) `create(seed: String) -> DataRandomizer`

Instantiates a randomizer.

`let random = Randomizer.create('abc');`

### `numbers(min: Number, max: Number, step?: Number) -> Function`

Creates function that returns numbers between `min` (inclusive) and `max` (exclusive)
at `step` intervals (default 0).

`let randomHeight = random.numbers(25, 300)`

`let randomPrice = random.numbers(0.01, 999.99, 0.01)`

### `integers(min: Number, max: Number) -> Function`

Creates function that returns random integer between `min` (inclusive) and `max` (inclusive).

### `booleans(split?: Number) -> Function`

Creates function that returns random boolean with `split` probability of being true (default 0.5).

### `phrases(wordCount: Number|Function) -> Function`

Creates function that generates string with given number of words.

### `sentences() -> Function`

Creates function that generates random string.

### `paragraphs() -> Function`

Creates function that generates random paragraph.

### `dates(min: Date, max: Date) -> Function`

Creates function that generates random Date in given range.

### `choices(list: Array) -> Function`

Creates function that returns random item from `list`.

### `alternatives(list: Array<Function>) -> Function`

Creates function that randomly selects from the `list` of functions to invoke.
This is useful to specify a union of multiple random type constraints.

### `arrays(count: Number|Function, randomItem: Function) -> Function`

Creates function that generates array of random items.
The count can be a constant number or a function that generates a random number.

### `objects(template: Object) -> Function`

Creates function that generates object with structure corresponding to `template`.

### `composites(branchCount: Number|Function, depth: Number|Function, recursivePropertyName: String, baseStructure: Object) -> Function`

Creates function that generates object with base structure and recursive property that contains list of zero or more similar structures,
thus forming a tree-like data structure, the shape of which is determined by branch count and depth.

### `permutations(count: Number|Function, list: Array) -> Function`

Creates function that generates array of items from `list` of length given by `count`
(or the length of `list`, whichever is less).
Each item in the resulting array will be distinct.

### `transformations(factories: Array, t: Function) -> Function`

Creates function that invokes all given factories and passes them as arguments to the transform function.
This is useful when you want to define post-processing for some random data.
