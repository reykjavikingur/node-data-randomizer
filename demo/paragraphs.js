var Randomizer = require('../lib/randomizer');

var seed = 'Demo seed for testing purposes@!#1314678';

var n = 10;

var random = Randomizer.create(seed);

//var randomParagraph = random.paragraphs(random.integers(5, 8), random.integers(4, 16));
var randomParagraph = random.paragraphs();

for (let i = 0; i < n; i++) {
	console.log(randomParagraph());
	console.log('');
}
