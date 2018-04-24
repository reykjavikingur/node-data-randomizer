var Randomizer = require('../lib/randomizer');

var seed = 'Example seed for prices demo 1';

var random = Randomizer.create(seed);

var randomPrice = random.alternative([
	random.number(0.99, 199.99, 1),
	random.number(0.98, 199.98, 1)
]);

var n = 25;

for (let i = 0; i < n; i++) {
	let price = randomPrice();
	console.log(price);
}