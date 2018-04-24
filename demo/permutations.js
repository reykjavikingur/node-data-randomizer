let Randomizer = require('../');
let random = Randomizer.create('abc');

let list = ['foo', 'bar', 'baz', 'quux', 'corge'];

let count = random.integer(2, 4);

let randomPermutation = random.permutation(count, list);

let trials = 20;

for (let i = 0; i < trials; i++) {
	console.log(randomPermutation());
}
