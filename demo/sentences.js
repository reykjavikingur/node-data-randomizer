var Randomizer = require('../lib/randomizer');

var seed = 'Demo seed for testing purposes@!#1314678';

var n = 10;

var random = Randomizer.create(seed);

//var randomSentence = random.sentences(random.integers(5, 10));
var randomSentence = random.sentences();

for (let i = 0; i < n; i++) {
	console.log(randomSentence());
}
