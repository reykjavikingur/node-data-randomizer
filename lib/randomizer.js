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

	integers(min, max) {
		return this.numbers(min, max, 1);
	}

	booleans(split) {
		if (arguments.length === 0) {
			split = 0.5;
		}
		let toss = this.numbers(0, 1);
		return ()=> {
			return toss() < split ? true : false;
		};
	}

	seeds() {
		let randomNumber = this.numbers(0, 1);
		return () => {
			return String(randomNumber());
		};
	}

}

module.exports = Randomizer;