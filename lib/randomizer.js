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
			return (shiftedMin < shiftedMax) ? this.number(shiftedMin, shiftedMax, step) : null;
		};
		return f;
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
		return ()=> {
			return toss() < split ? true : false;
		};
	}

	seed() {
		let randomNumber = this.number(0, 1);
		return () => {
			return String(randomNumber());
		};
	}

	choice(list) {
		let randomIndex = this.integer(0, list.length - 1);
		return () => {
			return list[randomIndex()];
		};
	}

	alternative(list) {
		let randomFactory = this.choice(list);
		return () => {
			this.group();
			let factory = randomFactory();
			let result = factory();
			this.ungroup();
			return result;
		};
	}

	array(count, randomItem) {
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

	object(template) {
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

	composite(branchCount, depth, recursivePropertyName, baseStructure) {
		let argErrorMessage = 'invalid arguments -- must be (Number|Function, Number|Function, String, Object)';
		assert(['number', 'function'].indexOf(typeof branchCount) >= 0, argErrorMessage);
		assert(typeof depth === 'number' || typeof depth === 'function', argErrorMessage);
		if (typeof depth === 'function') {
			assert(typeof depth.shift === 'function', 'function value for `depth` argument must be generated from `integer` method');
		}
		assert(typeof recursivePropertyName === 'string', argErrorMessage);
		assert(typeof baseStructure === 'object' && Boolean(baseStructure), argErrorMessage);

		let randomBase = this.object(baseStructure);

		if (typeof depth === 'number') {
			depth = this.integer(depth, depth);
		}

		return this.transformation([randomBase, depth], (base, d) => {
			let randomChildren = () => [];
			if (d > 0) {
				let nextDepth = depth.shift(-1, 0);
				if (Boolean(nextDepth)) {
					randomChildren = this.array(branchCount, this.composite(branchCount, nextDepth, recursivePropertyName, baseStructure));
				}
			}
			base[recursivePropertyName] = randomChildren();
			return base;
		});
	}

	phrase(wordCount) {
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
				random: this.gen.random
			});
			this.ungroup();
			return phrase;
		};
	}

	sentence() {
		return ()=> {
			this.group();
			let sentence = lorem({
				count: 1,
				units: 'sentences',
				random: this.gen.random
			});
			this.ungroup();
			return sentence;

		};
	}

	paragraph() {
		return ()=> {
			this.group();
			let paragraph = lorem({
				count: 1,
				units: 'paragraphs',
				random: this.gen.random
			});
			this.ungroup();
			return paragraph;
		};
	}

	date(min, max) {
		let randomInteger = this.integer(Number(min), Number(max));
		return ()=> {
			return new Date(randomInteger());
		};
	}

	transformation(factories, f) {
		if (!factories || !f) {
			throw new Error('invalid or missing arguments: should be (Array, Function)');
		}
		return ()=> {
			this.group();
			let args = factories.map(
				(factory) => (typeof factory === 'function') ? factory() : factory
			);
			let result = f.apply(null, args);
			this.ungroup();
			return result;
		};
	}

	// TODO deprecate in favor of 'transform' chain method
	call(f, randomFactory) {
		return ()=> {
			return f(randomFactory());
		};
	}


	permutation(count, list) {
		return () => {
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
	}

}

module.exports = Randomizer;