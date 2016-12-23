var Randomizer = require('../lib/randomizer');

var seed = 'Example seed for prices demo';

var random = Randomizer.create(seed);

var randomPrice = random.numbers(0.99, 199.99, 1);

var n = 10;

for (let i = 0; i < n; i++) {
	let price = randomPrice();
	console.log(price);
}