var generator = require('random-seed');

class Randomizer {

	constructor(seed) {
		if (!seed) {
			throw new Error('required argument missing');
		}
		this.gen = generator.create(seed);
		this.gens = [];
	}

	static create(seed) {
		return new Randomizer(seed);
	}

	group() {
		let seed = this.seeds()();
		this.gens.push(this.gen);
		this.gen = generator.create(seed);
	}

	ungroup() {
		this.gen = this.gens.pop();
	}

	numbers(min, max, step) {
		if (arguments.length < 2) {
			throw new Error('required arguments missing');
		}
		if (Number(min) !== min || Number(max) !== max) {
			throw new Error('invalid argument for `min` or `max`');
		}
		if (!Boolean(step)) {
			step = 0; // default
		}
		else if (isNaN(step)) {
			throw new Error('invalid argument for `step`');
		}
		if (min >= max) {
			throw new Error('invalid range implied by `min`, `max`');
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

	arrays(count, randomItem) {
		return ()=> {
			this.group();
			let n = (typeof count === 'function') ? count() : count;
			let a = [];
			for (let i = 0; i < n; i++) {
				a.push(randomItem());
			}
			this.ungroup();
			return a;
		};
	}

	// TODO write objects method

	// TODO write string methods

}

module.exports = Randomizer;