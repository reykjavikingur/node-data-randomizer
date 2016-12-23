let random = require('../lib/randomizer').create('Example seed for demo of powers of ten');

let randomPowerOfTen = random.transformations([
	random.integers(1, 9),
	random.integers(0, 6)
], (c, x) => {
	return c * Math.pow(10, x);
});

let n = 25;

for (let i = 0; i < n; i++) {
	console.log(randomPowerOfTen());
}
