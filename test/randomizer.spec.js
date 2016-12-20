var should = require('should');
var Randomizer = require('../lib/randomizer');

describe('Randomizer', ()=> {

	it('should be defined', ()=> {
		should(Randomizer).be.ok();
	});

	describe('.create', ()=> {

		var random, seed;

		beforeEach(()=> {
			seed = 'Example seed.';
			random = Randomizer.create(seed);
		});

		it('should return defined value', ()=> {
			should(random).be.ok();
		});

		describe('.numbers', ()=> {

			it('should return function', ()=> {
				should(random.numbers(1, 10)).be.a.Function();
			});

			describe('sequence', ()=> {

				it('should return same value per seed', ()=> {
					var randomNumber = random.numbers(1, 10);
					var random2 = Randomizer.create(seed);
					var randomNumber2 = random2.numbers(1, 10);
					var x = randomNumber();
					var x2 = randomNumber2();
					should(x).equal(x2);
				});

				it('should return different value for different seeds', function () {
					var randomNumber = random.numbers(1, 10);
					var random2 = Randomizer.create(seed + 'x');
					var randomNumber2 = random2.numbers(1, 10);
					var x = randomNumber();
					var x2 = randomNumber2();
					should(x).not.equal(x2);
				});

			});

			describe('from 1 to 10', ()=> {

				var min, max, randomNumber;

				beforeEach(()=> {
					min = 1;
					max = 10;
					randomNumber = random.numbers(min, max);
				});

				it('should return number', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.a.Number();
					}
				});

				it('should return value not less than min', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).not.be.lessThan(min);
					}
				});

				it('should return value less than max', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.lessThan(max);
					}
				});

			});

			describe('from 1.25 to 1.75', ()=> {

				var min, max, randomNumber;

				beforeEach(()=> {
					min = 1.25;
					max = 1.75;
					randomNumber = random.numbers(min, max);
				});

				it('should return value not less than min', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).not.be.lessThan(min);
					}
				});

				it('should return value less than max', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.lessThan(max);
					}
				});

			});

			describe('from 0 to 100 by 7', ()=> {

				var min, max, step, randomNumber;

				beforeEach(()=> {
					min = 0;
					max = 100;
					step = 7;
					randomNumber = random.numbers(min, max, step);
				});

				it('should return value not less than min', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).not.be.lessThan(min);
					}
				});

				it('should return value less than max', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.lessThan(max);
					}
				});

				it('should return value divisible by interval', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber() % step).equal(0);
					}
				});

			});

		});

		describe('.integers', ()=> {

			describe('from 0 to 1', ()=> {

				var randomInteger;

				beforeEach(()=> {
					randomInteger = random.integers(0, 1);
				});

				it('should be a function', ()=> {
					should(randomInteger).be.a.Function();
				});

				describe('values', ()=> {
					var values;
					beforeEach(()=> {
						values = {};
						for (let i = 0; i < 1000; i++) {
							let x = randomInteger();
							if (!values.hasOwnProperty(x)) {
								values[x] = 0;
							}
							values[x]++;
						}
					});
					it('should sometimes return 0', ()=> {
						should(values[0]).be.ok();
					});
					it('should sometimes return 1', ()=> {
						should(values[1]).be.ok();
					});
				});

			});

			describe('25 to 50', ()=> {
				var min, max, randomInteger;
				beforeEach(()=> {
					min = 25;
					max = 50;
					randomInteger = random.integers(min, max);
				});
				it('should always return value not less than min', ()=> {
					for (var i = 0; i < 1000; i++) {
						should(randomInteger()).not.be.lessThan(min);
					}
				});
				it('should always return value not greater than max', ()=> {
					for (let i = 0; i < 1000; i++) {
						should(randomInteger()).not.be.greaterThan(max);
					}
				});
				it('should always return value rounded to nearest 1', ()=> {
					for (let i = 0; i < 1000; i++) {
						var x = randomInteger();
						var y = Math.round(x);
						should(x).equal(y);
					}
				});
			});

		});

		describe('.booleans', ()=> {

			describe('with default split', ()=> {
				var randomBoolean;
				beforeEach(()=> {
					randomBoolean = random.booleans();
				});
				describe('values', ()=> {
					var values;
					beforeEach(()=> {
						values = {
							'true': 0,
							'false': 0,
							'other': 0
						};
						for (let i = 0; i < 1000; i++) {
							let x = randomBoolean();
							if (x === true) {
								values['true']++;
							}
							else if (x === false) {
								values['false']++;
							}
							else {
								values['other']++;
							}
						}
					});
					it('should sometimes return true', ()=> {
						should(values['true']).be.greaterThan(0);
					});
					it('should sometimes return false', ()=> {
						should(values['false']).be.greaterThan(0);
					});
					it('should never return value other than true or false', ()=> {
						should(values['other']).equal(0);
					});
				});
			});

			describe('with full bias towards false', ()=> {

				var randomBoolean;
				beforeEach(()=> {
					randomBoolean = random.booleans(0);
				});
				it('should always return false', ()=> {
					for (let i = 0; i < 1000; i++) {
						should(randomBoolean()).eql(false);
					}
				});
			});

			describe('with full bias towards true', ()=> {
				var randomBoolean;
				beforeEach(()=> {
					randomBoolean = random.booleans(1);
				});
				it('should always return false', ()=> {
					for (let i = 0; i < 1000; i++) {
						should(randomBoolean()).eql(true);
					}
				});
			});

		});

		describe('.seeds', ()=> {

			var randomSeed;
			beforeEach(()=> {
				randomSeed = random.seeds();
			});

			it('should always return a string', ()=> {
				for (let i = 0; i < 1000; i++) {
					should(randomSeed()).be.a.String();
				}
			});

			it('should generate distinct string every time', ()=> {
				let values = {}, n = 1000;
				for (let i = 0; i < n; i++) {
					var seed = randomSeed();
					values[seed] = true;
				}
				let distinctSeeds = Object.keys(values);
				should(distinctSeeds.length).equal(n);
			});
		});

	});

});