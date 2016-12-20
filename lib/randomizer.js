var generator = require('random-seed');

class Randomizer {

	constructor(seed) {
		if (!seed) {
			throw new Error('required argument missing');
		}
		this.gen = generator.create(seed);
	}

	static create(seed) {
		return new Randomizer(seed);
	}

	numbers(min, max, step) {
		if (arguments.length < 2) {
			throw new Error('required arguments missing');
		}
		if (!Boolean(step)) {
			step = 0; // default
		}
		let range = max - min;
		if (step > 0) {
			let numSteps = Math.floor(range / step) + 1;
			return () => {
				return Math.floor(this.gen.random() * numSteps) * step + min;
			};
		}
		else {
			return () => {
				return this.gen.random() * range + min;
			};
		}
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

	choices(list) {
		let randomIndex = this.integers(0, list.length - 1);
		return () => {
			return list[randomIndex()];
		};
	}

	// TODO write string methods

	// TODO write arrays method

	// TODO write objects method

}

module.exports = Randomizer;