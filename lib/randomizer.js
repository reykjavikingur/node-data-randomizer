const assert = require('assert');
const generator = require('random-seed');
const lorem = require('lorem-ipsum');
const enable = require('./enable');

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
		let seed = this.seed()();
		this.gens.push(this.gen);
		this.gen = generator.create(seed);
	}

	ungroup() {
		this.gen = this.gens.pop();
	}

	number(min, max, step) {
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
		var f;
		if (step > 0) {
			let numSteps = Math.floor(range / step) + 1;
			f = () => {
				return Math.floor(this.gen.random() * numSteps) * step + min;
			};
		}
		else {
			f = () => {
				return this.gen.random() * range + min;
			};
		}
		return enable(f);
	}

	integer(min, max) {
		if (min === max) {
			max = min + 0.1;
		}
		return this.number(min, max, 1);
	}

	boolean(split) {
		if (arguments.length === 0) {
			split = 0.5;
		}
		let toss = this.number(0, 1);
		var f = () => {
			return toss() < split ? true : false;
		};
		return enable(f);
	}

	seed() {
		let randomNumber = this.number(0, 1);
		var f = () => {
			return String(randomNumber());
		};
		return enable(f);
	}

	choice(list) {
		let randomIndex = this.integer(0, list.length - 1);
		var f = () => {
			return list[randomIndex()];
		};
		return enable(f);
	}

	alternative(list) {
		let randomFactory = this.choice(list);
		var f = () => {
			this.group();
			let factory = randomFactory();
			let result = factory();
			this.ungroup();
			return result;
		};
		return enable(f);
	}

	array(count, randomItem) {
		var f = () => {
			this.group();
			let n = (typeof count === 'function') ? count() : count;
			let a = [];
			for (let i = 0; i < n; i++) {
				a.push(randomItem());
			}
			this.ungroup();
			return a;
		};
		return enable(f);
	}

	object(template) {
		var f = () => {
			this.group();
			let obj = {};
			for (let key in template) {
				obj[key] = (typeof template[key] === 'function') ? template[key]() : template[key];
			}
			this.ungroup();
			return obj;
		};
		return enable(f);
	}

	phrase(wordCount) {
		if (!wordCount) {
			throw new Error('missing required argument: wordCount');
		}
		if (['function', 'number'].indexOf(typeof wordCount) < 0) {
			throw new Error('invalid value for argument: wordCount');
		}
		var f = () => {
			this.group();
			let phrase = lorem({
				count: (typeof wordCount === 'function') ? wordCount() : wordCount,
				units: 'words',
				random: this.gen.random
			});
			this.ungroup();
			return phrase;
		};
		return enable(f);
	}

	sentence() {
		var f = () => {
			this.group();
			let sentence = lorem({
				count: 1,
				units: 'sentences',
				random: this.gen.random
			});
			this.ungroup();
			return sentence;
		};
		return enable(f);
	}

	paragraph() {
		var f = () => {
			this.group();
			let paragraph = lorem({
				count: 1,
				units: 'paragraphs',
				random: this.gen.random
			});
			this.ungroup();
			return paragraph;
		};
		return enable(f);
	}

	date(min, max) {
		let randomInteger = this.integer(Number(min), Number(max));
		var f = () => {
			return new Date(randomInteger());
		};
		return enable(f);
	}

	permutation(count, list) {
		var f = () => {
			this.group();
			let reserve = list.slice();
			let perm = [];
			let n = typeof count === 'function' ? count() : count;
			while (perm.length < n && reserve.length > 0) {
				let index = this.integer(0, reserve.length - 1)();
				let item = reserve.splice(index, 1)[0];
				perm.push(item);
			}
			this.ungroup();
			return perm;
		};
		return enable(f);
	}

}

module.exports = Randomizer;