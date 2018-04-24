var Randomizer = require('../lib/randomizer');

var seed = 'ReyIceBjo';

var random = Randomizer.create(seed);

var randomDate = random.date(new Date('June 21, 2007'), new Date('July 31, 2017'));

var n = 10;

for (let i = 0; i < n; i++) {
	let date = randomDate();
	console.log(String(date));
}