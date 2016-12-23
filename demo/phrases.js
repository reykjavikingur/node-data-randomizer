var Randomizer = require('../lib/randomizer');

var seed = 'Demo seed for testing purposes@!#1314678';

var n = 10;

var random = Randomizer.create(seed);

//var randomPhrase = random.phrases(random.integers(5, 10));
var randomPhrase = random.phrases(3);

for (let i = 0; i < n; i++) {
	console.log(randomPhrase());
}
