var assert = require('assert');
var generator = require('random-seed');
var lorem = require('lorem-ipsum');

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
		f.shift = (offset, limit) => {
			let constrain;
			if (typeof limit === 'undefined') {
				constrain = (x) => x;
			}
			else if (offset > 0) {
				constrain = Math.min;
			}
			else {
				constrain = Math.max;
			}
			let shiftedMin = constrain(min + offset, limit);
			let shiftedMax = constrain(max + offset, limit);
			return (shiftedMin < shiftedMax) ? this.numbers(shiftedMin, shiftedMax, step) : null;
		};
		return f;
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

	alternatives(list) {
		let randomFactory = this.choices(list);
		return () => {
			this.group();
			let factory = randomFactory();
			let result = factory();
			this.ungroup();
			return result;
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

	objects(template) {
		return ()=> {
			this.group();
			let obj = {};
			for (let key in template) {
				obj[key] = (typeof template[key] === 'function') ? template[key]() : template[key];
			}
			this.ungroup();
			return obj;
		};
	}

	composites(branchCount, depth, recursivePropertyName, baseStructure) {
		let argErrorMessage = 'invalid arguments -- must be (Number|Function, Number, String, Object)';
		assert(['number', 'function'].indexOf(typeof branchCount) >= 0, argErrorMessage);
		assert(typeof depth === 'number', argErrorMessage);
		assert(typeof recursivePropertyName === 'string', argErrorMessage);
		assert(typeof baseStructure === 'object' && Boolean(baseStructure), argErrorMessage);

		let randomBase = this.objects(baseStructure);

		if (depth > 0) {
			let randomChildren = this.arrays(branchCount, this.composites(branchCount, depth - 1, recursivePropertyName, baseStructure));
			return this.transformations([randomBase], (base) => {
				base[recursivePropertyName] = randomChildren();
				return base;
			});
		}
		else {
			return this.transformations([randomBase], (base) => {
				base[recursivePropertyName] = [];
				return base;
			});
		}
	}

	phrases(wordCount) {
		if (!wordCount) {
			throw new Error('missing required argument: wordCount');
		}
		if (['function', 'number'].indexOf(typeof wordCount) < 0) {
			throw new Error('invalid value for argument: wordCount');
		}
		return ()=> {
			this.group();
			let phrase = lorem({
				count: (typeof wordCount === 'function') ? wordCount() : wordCount,
				units: 'words',
				random: this.gen.number
			});
			this.ungroup();
			return phrase;
		};
	}

	sentences() {
		return ()=> {
			this.group();
			let sentence = lorem({
				count: 1,
				units: 'sentences',
				random: this.gen.number
			});
			this.ungroup();
			return sentence;

		};
	}

	paragraphs() {
		return ()=> {
			this.group();
			let paragraph = lorem({
				count: 1,
				units: 'paragraphs',
				random: this.gen.number
			});
			this.ungroup();
			return paragraph;
		};
	}

	dates(min, max) {
		let randomInteger = this.integers(Number(min), Number(max));
		return ()=> {
			return new Date(randomInteger());
		};
	}

	transformations(factories, f) {
		if (!factories || !f) {
			throw new Error('invalid or missing arguments: should be (Array, Function)');
		}
		return ()=> {
			this.group();
			let args = factories.map(
				(factory) => (typeof factory === 'function') ? factory() : factory
			);
			this.ungroup();
			return f.apply(null, args);
		};
	}

}

module.exports = Randomizer;