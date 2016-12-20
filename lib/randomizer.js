var generator = require('random-seed');

class Randomizer {

	constructor(seed) {
		this.gen = generator.create(seed);
	}

	static create(seed) {
		return new Randomizer(seed);
	}

	numbers(min, max, step) {
		return ()=> {
			var range = max - min;
			var x = this.gen.random() * range + min;
			if (Boolean(step)) {
				return Math.round(x / step) * step;
			}
			else {
				return x;
			}
		};
	}

}

module.exports = Randomizer;