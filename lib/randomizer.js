var generator = require('random-seed');

function Randomizer(seed) {
	this.gen = generator.create(seed);
}

Randomizer.create = function create(seed) {
	return new Randomizer(seed);
};

Randomizer.prototype = {
	numbers: function numbers(min, max, step) {
		return ()=> {
			// TODO stick to step intervals
			var range = max - min;
			return this.gen.random() * range + min;
		};
	}
};

module.exports = Randomizer;