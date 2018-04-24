const random = require('../lib/randomizer').create('Example seed for demo of powers of ten');

var randomPowerOfTen = random.object({
	digit: random.integer(1, 9),
	power: random.integer(0, 6),
})
	.transform(r => {
		return r.digit * Math.pow(10, r.power);
	});

var n = 25;

for (let i = 0; i < n; i++) {
	console.log(randomPowerOfTen());
}
