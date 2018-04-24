var Randomizer = require('../lib/randomizer');

var seed = 'Demo seed for testing purposes@!#1314678';

var n = 10;

var random = Randomizer.create(seed);

var randomPhrase = random.phrase(3);

for (let i = 0; i < n; i++) {
	console.log(randomPhrase());
}
