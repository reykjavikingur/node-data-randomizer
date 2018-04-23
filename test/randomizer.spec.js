var should = require('should');
var Randomizer = require('../');

describe('Randomizer', () => {

	it('should be defined', () => {
		should(Randomizer).be.ok();
	});

	describe('.create', () => {

		var random, seed;

		beforeEach(() => {
			seed = 'Example seed.';
			random = Randomizer.create(seed);
		});

		it('should fail without seed', () => {
			should(() => Randomizer.create()).throwError();
		});

		it('should return defined value', () => {
			should(random).be.ok();
		});

		describe('.number', () => {

			it('should return function', () => {
				should(random.number(1, 10)).be.a.Function();
			});

			it('should have return value in generator', () => {
				var randomNumber = random.number(1, 10);
				should(randomNumber.generator).equal(randomNumber);
			});

			it('should fail with no arguments', () => {
				should(() => random.number()).throwError();
			});

			it('should fail with only 1 argument', () => {
				should(() => random.number(1)).throwError();
			});

			it('should fail with invalid second argument', () => {
				should(() => random.number(1, 'awawa')).throwError();
			});

			it('should fail with no range', () => {
				should(() => random.number(1, 1)).throwError();
			});

			it('should fail with negative range', () => {
				should(() => random.number(5, 3)).throwError();
			});

			describe('sequence', () => {

				it('should return same value per seed', () => {
					var randomNumber = random.number(1, 10);
					var random2 = Randomizer.create(seed);
					var randomNumber2 = random2.number(1, 10);
					var x = randomNumber();
					var x2 = randomNumber2();
					should(x).equal(x2);
				});

				it('should return different value for different seeds', function () {
					var randomNumber = random.number(1, 10);
					var random2 = Randomizer.create(seed + 'x');
					var randomNumber2 = random2.number(1, 10);
					var x = randomNumber();
					var x2 = randomNumber2();
					should(x).not.equal(x2);
				});

			});

			describe('from 1 to 10', () => {

				var min, max, randomNumber;

				beforeEach(() => {
					min = 1;
					max = 10;
					randomNumber = random.number(min, max);
				});

				it('should return number', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.a.Number();
					}
				});

				it('should return value not less than min', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).not.be.lessThan(min);
					}
				});

				it('should return value less than max', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.lessThan(max);
					}
				});

			});

			describe('from 1.25 to 1.75', () => {

				var min, max, randomNumber;

				beforeEach(() => {
					min = 1.25;
					max = 1.75;
					randomNumber = random.number(min, max);
				});

				it('should return value not less than min', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).not.be.lessThan(min);
					}
				});

				it('should return value less than max', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.lessThan(max);
					}
				});

			});

			describe('from 0 to 100 by 7', () => {

				var min, max, step, randomNumber;

				beforeEach(() => {
					min = 0;
					max = 100;
					step = 7;
					randomNumber = random.number(min, max, step);
				});

				it('should return value not less than min', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).not.be.lessThan(min);
					}
				});

				it('should return value less than max', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber()).be.lessThan(max);
					}
				});

				it('should return value divisible by interval', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomNumber() % step).equal(0);
					}
				});

			});

			describe('from 3 to 5', () => {

				var min, max, randomNumber;

				beforeEach(() => {
					min = 3;
					max = 5;
					randomNumber = random.number(min, max);
				});

				it('should always return a value in range', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomNumber();
						should(x).not.be.lessThan(min);
						should(x).be.lessThan(max);
					}
				});

				describe('.shift', () => {

					describe('with positive offset', () => {

						var offset, shiftedRandomNumber;

						before(() => {
							offset = 1;
							shiftedRandomNumber = randomNumber.shift(offset);
						});

						it('should be a function', () => {
							should(shiftedRandomNumber).be.a.Function();
						});

						it('should return values in new range', () => {
							for (let i = 0; i < 1000; i++) {
								let x = shiftedRandomNumber();
								should(x).not.be.lessThan(min + offset);
								should(x).be.lessThan(max + offset);
							}
						});

					});

					describe('with positive offset and limit not affecting range', () => {

						var offset, limit, shiftedRandomNumber;

						beforeEach(() => {
							offset = 1;
							limit = 10;
							shiftedRandomNumber = randomNumber.shift(offset, limit);
						});

						it('should return values in new range', () => {
							for (let i = 0; i < 1000; i++) {
								let x = shiftedRandomNumber();
								should(x).not.be.lessThan(min + offset);
								should(x).be.lessThan(max + offset);
							}
						});

					});

					describe('with positive offset and limit partly affecting range', () => {

						var offset, limit, shiftedRandomNumber;

						beforeEach(() => {
							offset = 1;
							should(max - min).be.greaterThan(offset); // sanity check
							limit = max;
							shiftedRandomNumber = randomNumber.shift(offset, limit);
						});

						it('should return values in new range', () => {
							for (let i = 0; i < 1000; i++) {
								let x = shiftedRandomNumber();
								should(x).not.be.lessThan(min + offset);
								should(x).be.lessThan(Math.min(max + offset, limit));
							}
						});

					});

					describe('with positive offset and limit completely exceeding range', () => {

						var offset, limit, shiftedRandomNumber;

						beforeEach(() => {
							offset = 10;
							limit = 6;
							should(min + offset).be.greaterThan(limit); // sanity check
							shiftedRandomNumber = randomNumber.shift(offset, limit);
						});

						it('should not be defined', () => {
							should(shiftedRandomNumber).not.be.ok();
						});

					});

				});

			});

		});

		describe('.integer', () => {

			describe('when min and max are the same', () => {

				var m, randomInteger;

				beforeEach(() => {
					m = 3;
					randomInteger = random.integer(m, m);
				});

				it('should be a function', () => {
					should(randomInteger).be.a.Function();
				});

				it('should have generator', () => {
					should(randomInteger.generator).equal(randomInteger);
				});

				it('should always return appropriate values', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomInteger();
						should(x).equal(m);
					}
				});

				describe('.shift', () => {

					describe('with offset -1', () => {

						it('should always return appropriate values', () => {
							let shiftedRandomInteger = randomInteger.shift(-1);
							for (let i = 0; i < 1000; i++) {
								let x = shiftedRandomInteger();
								should(x).equal(m - 1);
							}
						});

					});

					describe('with offset and limit reaching out of range', () => {

						it('should return null', () => {
							let shiftedRandomInteger = randomInteger.shift(-1, m);
							should(shiftedRandomInteger).not.be.ok();
						});

					});

				})

			});

			describe('from 0 to 1', () => {

				var randomInteger;

				beforeEach(() => {
					randomInteger = random.integer(0, 1);
				});

				it('should be a function', () => {
					should(randomInteger).be.a.Function();
				});

				describe('values', () => {
					var values;
					beforeEach(() => {
						values = {};
						for (let i = 0; i < 1000; i++) {
							let x = randomInteger();
							if (!values.hasOwnProperty(x)) {
								values[x] = 0;
							}
							values[x]++;
						}
					});
					it('should sometimes return 0', () => {
						should(values[0]).be.ok();
					});
					it('should sometimes return 1', () => {
						should(values[1]).be.ok();
					});
				});

			});

			describe('25 to 50', () => {
				var min, max, randomInteger;
				beforeEach(() => {
					min = 25;
					max = 50;
					randomInteger = random.integer(min, max);
				});
				it('should always return value not less than min', () => {
					for (var i = 0; i < 1000; i++) {
						should(randomInteger()).not.be.lessThan(min);
					}
				});
				it('should always return value not greater than max', () => {
					for (let i = 0; i < 1000; i++) {
						should(randomInteger()).not.be.greaterThan(max);
					}
				});
				it('should always return value rounded to nearest 1', () => {
					for (let i = 0; i < 1000; i++) {
						var x = randomInteger();
						var y = Math.round(x);
						should(x).equal(y);
					}
				});
			});

			describe('from 0 to 2', () => {

				var randomInteger;

				beforeEach(() => {
					randomInteger = random.integer(0, 2);
				});

				describe('counts', () => {
					var counts, numTrials;
					beforeEach(() => {
						numTrials = 1000;
						counts = {
							0: 0,
							1: 0,
							2: 0
						};
						for (let i = 0; i < numTrials; i++) {
							let x = randomInteger();
							counts[x]++;
						}
					});

					it('should have about the same amount of 0s as 1s', () => {
						should(counts[0]).be.approximately(counts[1], numTrials / 10);
					});

					it('should have about the same amount of 1s as 2s', () => {
						should(counts[1]).be.approximately(counts[2], numTrials / 10);
					})
				});

			});

			describe('from 3 to 5', () => {

				var min, max, randomInteger;

				beforeEach(() => {
					min = 3;
					max = 5;
					randomInteger = random.integer(min, max);
				});

				describe('.shift', () => {

					describe('by -1 towards 0', () => {

						var offset, limit, shiftedRandomInteger;

						beforeEach(() => {
							offset = -1;
							limit = 0;
							shiftedRandomInteger = randomInteger.shift(-1, 0);
						});

						it('should be a function', () => {
							should(shiftedRandomInteger).be.a.Function();
						});

						it('should always return a value in appropriate range', () => {
							let values = [2, 3, 4];
							for (let i = 0; i < 1000; i++) {
								let x = shiftedRandomInteger();
								should(values).containEql(x);
							}
						});

						describe('range of values', () => {
							var counts, n;
							beforeEach(() => {
								n = 1000;
								counts = {};
								for (let i = 0; i < n; i++) {
									let x = shiftedRandomInteger();
									if (!counts.hasOwnProperty(x)) {
										counts[x] = 0;
									}
									counts[x]++;
								}
							});

							it('should have about same amount of each value', () => {
								console.log('counts', counts);
								let first = counts[Object.keys(counts)[0]];
								for (let i in counts) {
									should(counts[i]).be.approximately(first, n / 5);
								}
							});

						});

					});

					describe('by -4 to 0', () => {

						var offset, limit, shiftedRandomInteger;

						beforeEach(() => {
							offset = -4;
							limit = 0;
							shiftedRandomInteger = randomInteger.shift(offset, limit);
						});

						it('should return within expected range', () => {
							let values = [0, 1];
							for (let i = 0; i < 1000; i++) {
								let x = shiftedRandomInteger();
								should(values).containEql(x);
							}
						});

						it('should cover expected range', () => {
							let counts = {0: 0, 1: 0};
							let n = 1000;
							for (let i = 0; i < n; i++) {
								let x = shiftedRandomInteger();
								counts[x]++;
							}
							should(counts[0]).be.approximately(counts[1], n / 5);
						});

					});

					describe('by -5 to 0', () => {

						var offset, limit, shiftedRandomInteger;

						beforeEach(() => {
							offset = -5;
							limit = 0;
							shiftedRandomInteger = randomInteger.shift(offset, limit);
						});

						it('should not be defined', () => {
							should(shiftedRandomInteger).not.be.ok();
						});

					});

				});

			})

		});

		describe('.boolean', () => {

			describe('with default split', () => {
				var randomBoolean;
				beforeEach(() => {
					randomBoolean = random.boolean();
				});
				it('should have generator set to return value', () => {
					should(randomBoolean.generator).equal(randomBoolean);
				});
				describe('values', () => {
					var values, numTrials;
					beforeEach(() => {
						values = {
							'true': 0,
							'false': 0,
							'other': 0
						};
						numTrials = 1000;
						for (let i = 0; i < numTrials; i++) {
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
					it('should sometimes return true', () => {
						should(values['true']).be.greaterThan(0);
					});
					it('should sometimes return false', () => {
						should(values['false']).be.greaterThan(0);
					});
					it('should never return value other than true or false', () => {
						should(values['other']).equal(0);
					});
					it('should have about as many true and false', () => {
						should(values['true']).be.approximately(values['false'], numTrials / 10);
					});
				});
			});

			describe('.transform', () => {
				var randomStatus;
				beforeEach(() => {
					randomStatus = random.boolean().transform(x => x ? 'ok' : 'no');
				});
				describe('values', () => {
					var values, numTrials;
					beforeEach(() => {
						values = {};
						numTrials = 1000;
						for (let i = 0; i < numTrials; i++) {
							let x = randomStatus();
							if (!values.hasOwnProperty(x)) {
								values[x] = 0;
							}
							values[x]++;
						}
					});
					it('should sometimes transform true', () => {
						should(values['ok']).be.greaterThan(0);
					});
					it('should sometimes transform false', () => {
						should(values['no']).be.greaterThan(0);
					});
					it('should never transform value other than true or false', () => {
						should(Object.keys(values).length).eql(2);
					});
					it('should have about as many true and false', () => {
						should(values['ok']).be.approximately(values['no'], numTrials / 10);
					});
				});
			});

			describe('with full bias towards false', () => {

				var randomBoolean;
				beforeEach(() => {
					randomBoolean = random.boolean(0);
				});
				it('should always return false', () => {
					for (let i = 0; i < 1000; i++) {
						should(randomBoolean()).eql(false);
					}
				});
			});

			describe('with full bias towards true', () => {
				var randomBoolean;
				beforeEach(() => {
					randomBoolean = random.boolean(1);
				});
				it('should always return false', () => {
					for (let i = 0; i < 1000; i++) {
						should(randomBoolean()).eql(true);
					}
				});
			});

			describe('with 3/4 bias towards true', () => {
				var ratio, randomBoolean;
				beforeEach(() => {
					ratio = 0.75;
					randomBoolean = random.boolean(ratio);
				});
				it('should return true 3/4 of the time', () => {
					let n = 1000, count0 = 0, count1 = 0;
					for (let i = 0; i < n; i++) {
						let x = randomBoolean();
						if (x) {
							count1++;
						}
					}
					should(count1).be.approximately(n * ratio, n / 20);
				});
			});

		});

		describe('.seed', () => {

			var randomSeed;
			beforeEach(() => {
				randomSeed = random.seed();
			});

			it('should always return a string', () => {
				for (let i = 0; i < 1000; i++) {
					should(randomSeed()).be.a.String();
				}
			});

			it('should put generator in return value', () => {
				should(randomSeed.generator).equal(randomSeed);
			});

			it('should generate distinct string every time', () => {
				let values = {}, n = 1000;
				for (let i = 0; i < n; i++) {
					var seed = randomSeed();
					values[seed] = true;
				}
				let distinctSeeds = Object.keys(values);
				should(distinctSeeds.length).equal(n);
			});
		});

		describe('.choice', () => {

			describe('among a few possible states', () => {

				var states, randomState;

				beforeEach(() => {
					states = ['guest', 'member', 'vip'];
					randomState = random.choice(states);
				});

				it('should return one of the possible states', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomState();
						should(states).containEql(x);
					}
				});

				it('should set generator to return value', () => {
					should(randomState.generator).equal(randomState);
				});

			});

		});

		describe('.alternative', () => {

			describe('with two random functions', () => {

				var randomAlt, minInteger, maxInteger, options;

				beforeEach(() => {
					minInteger = 0;
					maxInteger = 9;
					options = 'abcdef'.split('');
					let randomInteger = random.integer(minInteger, maxInteger);
					let randomLetter = random.choice(options);
					randomAlt = random.alternative([randomInteger, randomLetter]);
				});

				it('should be a function', () => {
					should(randomAlt).be.a.Function();
				});

				it('should set generator to return value', () => {
					should(randomAlt.generator).equal(randomAlt);
				});

				it('should return appropriate values', () => {
					for (let i = 0; i < 1000; i++) {
						let r = randomAlt();
						let validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
						should(validValues).containEql(r);
					}
				});

				it('should alternate evenly', () => {
					let numIntegers = 0, numLetters = 0;
					let n = 1000;
					for (let i = 0; i < n; i++) {
						let r = randomAlt();
						if (typeof r === 'number') {
							numIntegers++;
						}
						if (typeof r === 'string') {
							numLetters++;
						}
					}
					should(numIntegers).be.approximately(numLetters, n / 10);
				});

			});

			describe('grouping', () => {
				it('should create new seed', () => {
					let seed = 'unit testing seed for grouping alternatives';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.number(0, 1);
					let randomNumberB = randomB.number(0, 1);
					let randomThingA = randomA.alternative([
						randomA.number(100, 200),
						randomA.number(300, 400)
					]);

					randomNumberA();
					randomNumberB();

					randomThingA();
					randomNumberB();

					let a = randomNumberA();
					let b = randomNumberB();

					should(a).equal(b);
				});
			});

		});

		describe('.array', () => {

			describe('of 10 numbers from 5 to 7', () => {

				var randomArray, length;

				beforeEach(() => {
					length = 10;
					randomArray = random.array(length, random.number(5, 7));
				});

				it('should be a function', () => {
					should(randomArray).be.a.Function();
				});

				it('should set generator to return value', () => {
					should(randomArray.generator).equal(randomArray);
				});

				describe('value', () => {
					var array;
					beforeEach(() => {
						array = randomArray();
					});
					it('should be an array', () => {
						should(array).be.an.Array();
					});
					it('should have correct length', () => {
						should(array.length).equal(length);
					});
					it('should contain correct types of items', () => {
						for (let item of array) {
							should(item).be.a.Number();
							should(item).not.be.lessThan(5);
							should(item).be.lessThan(7);
						}
					});
				});

			});

			describe('of random number of items', () => {

				var minLength, maxLength, randomArray;

				beforeEach(() => {
					minLength = 5;
					maxLength = 7;
					randomArray = random.array(random.integer(minLength, maxLength), random.boolean());
				});

				describe('returns', () => {
					var array;
					beforeEach(() => {
						array = randomArray();
					});

					it('should have length in correct range', () => {
						should(array.length).not.be.lessThan(minLength);
						should(array.length).not.be.greaterThan(maxLength);
					});

					it('should contain only booleans', () => {
						for (let item of array) {
							should(item).be.a.Boolean();
						}
					});
				});

			});

			describe('of random numbers from 0 to 99', () => {

				var random1, random2;

				beforeEach(() => {
					let seed = 'Common test seed 159.';
					random1 = Randomizer.create(seed);
					random2 = Randomizer.create(seed);
				});

				it('should increment only once for a complex data structure', () => {
					let randomNumber1 = random1.number(0, 99);
					let randomNumber2 = random2.number(0, 99);
					let randomArray1 = random1.array(2, randomNumber1);
					let list1 = [randomNumber1(), randomArray1(), randomNumber1()];
					let list2 = [randomNumber2(), randomNumber2(), randomNumber2()];
					should(list1[0]).equal(list2[0]);
					should(list1[2]).equal(list2[2]);
				});

			});

		});

		describe('.object', () => {

			describe('with 2 constant properties', () => {

				var randomObject;

				beforeEach(() => {
					randomObject = random.object({
						foo: 1,
						bar: 'two'
					});
				});

				it('should be a function', () => {
					should(randomObject).be.a.Function();
				});

				it('should set generator to return value', () => {
					should(randomObject.generator).equal(randomObject);
				});

				describe('returns', () => {
					var value;
					beforeEach(() => {
						value = randomObject();
					});
					it('should be an Object', () => {
						should(value).be.an.Object();
					});
					it('should have correct keys', () => {
						should(Object.keys(value)).eql(['foo', 'bar']);
					});
				});

			});

			describe('with 2 dynamic properties', () => {

				var minAge, maxAge, sexes, randomObject;

				beforeEach(() => {
					minAge = 18;
					maxAge = 34;
					sexes = ['M', 'F'];
					randomObject = random.object({
						age: random.integer(minAge, maxAge),
						sex: random.choice(sexes)
					});
				});

				describe('returns', () => {
					var value;
					beforeEach(() => {
						value = randomObject();
					});
					it('should have correct keys', () => {
						should(Object.keys(value)).eql(['age', 'sex']);
					});
					it('should have integer for age property', () => {
						should(value.age).be.a.Number();
					});
					it('should have string for sex property', () => {
						should(value.sex).be.a.String();
					});
				});

			});

			describe('with 2 dynamic integer property', () => {

				var random1, random2;

				beforeEach(() => {
					let seed = 'Example object Seed~';
					random1 = Randomizer.create(seed);
					random2 = Randomizer.create(seed);
					randomInteger1 = random1.integer(0, 99);

					randomInteger2 = random2.integer(0, 99);

					randomObject1 = random1.object({
						foo: random.integer(0, 99),
						bar: random.integer(0, 99)
					});
				});

				it('should increment random sequence the same regardless of object groupings', () => {
					let x1 = randomInteger1();
					let y1 = randomObject1();
					let z1 = randomInteger1();
					let x2 = randomInteger2();
					let y2 = randomInteger2();
					let z2 = randomInteger2();
					should(x1).equal(x2);
					should(z1).equal(z2);
				});

			});

		});

		describe('.phrase', () => {

			it('should throw error without word count', () => {
				should(() => random.phrase()).throw();
			});

			it('should throw error given invalid word count', () => {
				should(() => random.phrase('t')).throw();
			});

			describe('with constant word count', () => {

				var randomPhrase, wordCount;

				beforeEach(() => {
					wordCount = 3;
					randomPhrase = random.phrase(wordCount);
				});

				it('should return a function', () => {
					should(randomPhrase).be.a.Function();
				});

				it('should set generator to return value', () => {
					should(randomPhrase.generator).equal(randomPhrase);
				});

				it('should return a string', () => {
					should(randomPhrase()).be.a.String();
				});

				it('should have correct word count', () => {
					var phrase = randomPhrase();
					var words = phrase.split(' ');
					should(words.length).equal(wordCount);
				});

				it('should return different value each time', () => {
					var x1 = randomPhrase();
					var x2 = randomPhrase();
					should(x1).not.eql(x2);
				});

			});

			describe('pseudo-randomness', () => {

				var random1, random2, randomPhrase1, randomPhrase2;

				beforeEach(() => {
					let seed = 'phrases seed 1020';
					random1 = Randomizer.create(seed);
					random2 = Randomizer.create(seed);
					randomPhrase1 = random1.phrase(3);
					randomPhrase2 = random2.phrase(3);
				});

				it('should be consistent on the first time', () => {
					should(randomPhrase1()).eql(randomPhrase2());
				});

			});

			describe('grouping', () => {

				it('should use separate seed for phrase', () => {
					var seed = 'Phrase grouping test';
					var randomA = new Randomizer(seed);
					var randomB = new Randomizer(seed);
					var randomNumberA = randomA.number(0, 1);
					var listA = [
						randomNumberA(),
						randomNumberA()
					];
					var randomNumberB = randomB.number(0, 1);
					var randomPhraseB = randomB.phrase(3);
					var listB = [
						randomPhraseB(),
						randomNumberB()
					];
					should(listA[1]).equal(listB[1]);
				});
			});

			describe('with dynamic word count', () => {
				var minWordCount, maxWordCount, randomPhrase;
				beforeEach(() => {
					minWordCount = 3;
					maxWordCount = 5;
					randomPhrase = random.phrase(random.integer(minWordCount, maxWordCount));
				});
				it('should return string', () => {
					should(randomPhrase()).be.a.String();
				});
				it('should always return string in calculated word count range', () => {
					for (let i = 0; i < 1000; i++) {
						var phrase = randomPhrase();
						var words = phrase.split(' ');
						should(words.length).be.greaterThan(minWordCount - 1);
						should(words.length).be.lessThan(maxWordCount + 1);
					}
				});
			});

		});

		describe('.sentence', () => {

			var randomSentence;
			beforeEach(() => {
				randomSentence = random.sentence();
			});

			it('should return function', () => {
				should(randomSentence).be.a.Function();
			});

			it('should set generator to return value', () => {
				should(randomSentence.generator).equal(randomSentence);
			});

			it('should generate strings', () => {
				let sentence = randomSentence();
				should(sentence).be.a.String();
			});

			it('should generate non-empty strings', () => {
				should(randomSentence()).be.ok();
			});

			it('should generate different strings each time', () => {
				should(randomSentence()).not.equal(randomSentence());
			});

			describe('grouping', () => {
				it('should use different seed for each sentence', () => {
					let seed = 'abcd';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.number(0, 1);
					let randomNumberB = randomB.number(0, 1);
					let randomSentenceA = randomA.sentence();
					randomSentenceA();
					randomNumberB();
					let a = randomNumberA();
					let b = randomNumberB();
					should(a).equal(b);
				});
			});

			describe('pseudo-randomness', () => {

				it('should be consistent', () => {
					let seed = 'sentence test seed';
					let random1 = Randomizer.create(seed);
					let random2 = Randomizer.create(seed);
					let randomSentence1 = random1.sentence();
					let randomSentence2 = random2.sentence();
					let s1 = randomSentence1();
					let s2 = randomSentence2();
					should(s1).be.ok();
					should(s1).equal(s2);
				});

			});

		});

		describe('.paragraph', () => {

			var randomParagraph;
			beforeEach(() => {
				randomParagraph = random.paragraph();
			});

			it('should return function', () => {
				should(randomParagraph).be.a.Function();
			});

			it('should set generator to return value', () => {
				should(randomParagraph.generator).equal(randomParagraph);
			});

			it('should generate strings', () => {
				let paragraph = randomParagraph();
				should(paragraph).be.a.String();
			});

			it('should generate non-empty strings', () => {
				should(randomParagraph()).be.ok();
			});

			it('should generate different strings each time', () => {
				should(randomParagraph()).not.equal(randomParagraph());
			});

			it('should generate multiple sentences', () => {
				let p = randomParagraph();
				let sentences = p.split('. ');
				should(sentences.length).be.greaterThan(1);
			});

			describe('grouping', () => {
				it('should use different seed for each paragraph', () => {
					let seed = 'abcd';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.number(0, 1);
					let randomNumberB = randomB.number(0, 1);
					let randomParagraphA = randomA.paragraph();
					randomParagraphA();
					randomNumberB();
					let a = randomNumberA();
					let b = randomNumberB();
					should(a).equal(b);
				});
			});

			describe('pseudo-randomness', () => {

				it('should be consistent', () => {
					let seed = 'sentence test seed';
					let random1 = Randomizer.create(seed);
					let random2 = Randomizer.create(seed);
					let randomParagraph1 = random1.paragraph();
					let randomParagraph2 = random2.paragraph();
					let p1 = randomParagraph1();
					let p2 = randomParagraph2();
					should(p1).be.ok();
					should(p1).equal(p2);
				});

			});

		});

		describe('.date', () => {

			it('should throw error if given zero arguments', () => {
				should(() => random.date()).throw();
			});

			it('should throw error if given one argument', () => {
				should(() => random.date(new Date(1e12))).throw();
			});

			it('should throw error if given two arguments with an invalid value', () => {
				should(() => random.date('t', 'u')).throw();
			});

			it('should throw error if given two valid arguments with negative range', () => {
				should(() => random.date(new Date(1.1e12), new Date(1e12))).throw();
			});

			describe('in certain date range', () => {

				var min, max, randomDate;

				beforeEach(() => {
					min = 1e12;
					max = 1.1e12;
					let minDate = new Date(min);
					let maxDate = new Date(max);
					randomDate = random.date(minDate, maxDate);
				});

				it('should return a function', () => {
					should(randomDate).be.a.Function();
				});

				it('should set generator to return value', () => {
					should(randomDate.generator).equal(randomDate);
				});

				it('should generate Date instances', () => {
					let date = randomDate();
					should(date).be.instanceOf(Date);
				});

				it('should always generate Date within range', () => {
					for (let i = 0; i < 1000; i++) {
						let d = randomDate();
						let n = Number(d);
						should(n).not.be.lessThan(min);
						should(n).not.be.greaterThan(max);
					}
				});

			});

		});

		describe('.transformation', () => {

			it('should fail when given no arguments', () => {
				should(() => random.transformation()).throw();
			});

			it('should fail when given one valid argument', () => {
				let facs = [
					() => {
					}
				];
				should(() => random.transformation(facs)).throw();
			});

			describe('with one non-random argument', () => {

				var randomTransformation;

				beforeEach(() => {
					randomTransformation = random.transformation([
						1.5
					], (x) => {
						return {x: x};
					});
				});

				it('should be a function', () => {
					should(randomTransformation).be.a.Function();
				});

				describe('return', () => {

					var result;

					beforeEach(() => {
						result = randomTransformation();
					});

					it('should have been transformed', () => {
						should(result).eql({
							x: 1.5
						});
					});

				});

			});

			describe('with 2 random arguments', () => {

				var randomTransformation;

				beforeEach(() => {
					randomTransformation = random.transformation([
						random.number(1, 2),
						random.number(3, 4)
					], (x, y) => {
						return {
							x: x,
							y: y
						};
					})
				});

				it('should be a function', () => {
					should(randomTransformation).be.a.Function();
				});

				it('should always return appropriate value', () => {
					for (let i = 0; i < 1000; i++) {
						let r = randomTransformation();
						should(r.hasOwnProperty('x'));
						should(r.hasOwnProperty('y'));
						should(r.x).be.a.Number();
						should(r.y).be.a.Number();
						should(r.x).not.be.lessThan(1);
						should(r.x).be.lessThan(2);
						should(r.y).not.be.lessThan(3);
						should(r.y).be.lessThan(4);
					}
				});

			});

			describe('grouping', () => {

				it('should create new seed', () => {
					let seed = 'transformations grouping test';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.number(0, 1);
					let randomNumberB = randomB.number(0, 1);
					let randomThingA = randomA.transformation([
						randomA.number(1, 2),
						randomA.number(3, 4)
					], (x, y) => {
						return {x: x, y: y};
					});

					randomNumberA();
					randomNumberB();

					randomThingA();
					randomNumberB();

					let a = randomNumberA();
					let b = randomNumberB();

					should(a).equal(b);
				});

				it('should create new seed even when random factory is called in transform function', () => {
					let seed = 'transformations grouping test';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.number(0, 1);
					let randomNumberB = randomB.number(0, 1);
					let randomThingA = randomA.transformation([
						randomA.number(1, 2),
						randomA.number(3, 4)
					], (x, y) => {
						return {
							x: x,
							y: y,
							z: randomNumberA()
						};
					});

					randomNumberA();
					randomNumberB();

					randomThingA();
					randomNumberB();

					let a = randomNumberA();
					let b = randomNumberB();

					should(a).equal(b);
				});

			});

		});

		describe('.transform', () => {

			let randomSquareNumber;

			beforeEach(() => {
				randomSquareNumber = random.integer(1, 100).transform(x => x * x);
			});

			it('should return a function', () => {
				should(randomSquareNumber).be.a.Function();
			});

			it('should return different value each time', () => {
				let a = randomSquareNumber();
				let b = randomSquareNumber();
				should(a).not.equal(b);
			});

			it('should call the function each time', () => {
				for (let i = 0; i < 1000; i++) {
					let x = randomSquareNumber();
					let sqrtX = Math.sqrt(x);
					should(sqrtX).equal(Math.floor(sqrtX));
				}
			})

		});

		describe('.composite', () => {

			it('should fail when given no arguments', () => {
				should(() => random.composite()).throw();
			});

			it('should fail when first argument is invalid-falsy', () => {
				should(() => random.composite(null, 3, 'children', {})).throw();
			});

			it('should fail when second argument is invalid', () => {
				should(() => random.composite(2, null, 'children', {})).throw();
			});

			it('should fail when third argument is falsy', () => {
				should(() => random.composite(2, 3, null, {})).throw();
			});

			it('should fail when fourth argument is not an object', () => {
				should(() => random.composite(2, 3, 'children', null)).throw();
			});

			describe('with branch count 0 and max depth greater than 0', () => {

				var randomComposite;

				beforeEach(() => {
					randomComposite = random.composite(0, 3, 'children', {
						id: random.integer(1, 10000)
					});
				});

				describe('return', () => {
					var result;
					beforeEach(() => {
						result = randomComposite();
					});
					it('should be defined', () => {
						should(result).be.ok();
					});
					it('should have appropriate id', () => {
						should(result.id).be.greaterThan(0);
						should(result.id).be.lessThan(10001);
					});
					it('should have empty list of children', () => {
						should(result.children).eql([]);
					});
				});

			});

			describe('with branch count greater than 0 and max depth 0', () => {

				var randomComposite;

				beforeEach(() => {
					randomComposite = random.composite(2, 0, 'children', {
						id: random.integer(1, 10000)
					});
				});

				describe('result', () => {
					var result;
					beforeEach(() => {
						result = randomComposite();
					});
					it('should be ok', () => {
						should(result).be.ok();
					});
					it('should have appropriate id', () => {
						should(result.id).be.a.Number();
					});
					it('should have empty list of children', () => {
						should(result.children).eql([]);
					});
				});

			});

			describe('with dynamic branch count and constant depth', () => {

				var randomComposite, minBranchCount, maxBranchCount, maxDepth;

				beforeEach(() => {
					minBranchCount = 2;
					maxBranchCount = 3;
					let branchCount = random.integer(minBranchCount, maxBranchCount);
					maxDepth = 3;
					randomComposite = random.composite(branchCount, maxDepth, 'children', {
						id: random.integer(1, 10000)
					});
				});

				it('should be a function', () => {
					should(randomComposite).be.a.Function();
				});

				it('should set generator to return value', () => {
					should(randomComposite.generator).equal(randomComposite);
				});

				describe('return value', () => {
					var result;
					beforeEach(() => {
						result = randomComposite();
					});
					it('should be defined', () => {
						should(result).be.ok();
					});
					it('should have id', () => {
						should(result.id).be.a.Number();
					});
					it('should have children', () => {
						should(result.children).be.an.Array();
					});
					it('should have correct number of children', () => {
						should(result.children.length).be.greaterThan(minBranchCount - 1);
						should(result.children.length).be.lessThan(maxBranchCount + 1);
					});
					it('should have correct structure', () => {
						testComposite(result, 0);
					});
				});

				function testComposite(value, depth) {
					should(value.id).be.a.Number();
					should(value.children).be.an.Array();
					if (depth < maxDepth) {
						let numChildren = value.children.length;
						should(numChildren).be.greaterThan(minBranchCount - 1);
						should(numChildren).be.lessThan(maxBranchCount + 1);
						for (let i = 0; i < numChildren; i++) {
							testComposite(value.children[i], depth + 1);
						}
					}
					else {
						should(value.children.length).equal(0);
					}
				}

			});

			describe('with constant branch count and ranged max depth', () => {

				var randomComposite, branchCount, minDepth, maxDepth;

				beforeEach(() => {
					branchCount = 2;
					minDepth = 3;
					maxDepth = 5;
					randomComposite = random.composite(branchCount, random.integer(minDepth, maxDepth), 'children', {});
				});

				it('should be a function', () => {
					should(randomComposite).be.a.Function();
				});

				describe('return value', () => {

					var result;

					beforeEach(() => {
						result = randomComposite();
					});

					it('should be defined', () => {
						should(result).be.ok();
					});

					it('should have children array', () => {
						should(result.children).be.an.Array();
					});

					it('should have appropriate number of children', () => {
						should(result.children.length).equal(2);
					});

				});

			});

			describe('with constant branch count and constant max depth', () => {

				var randomComposite, branchCount, maxDepth;

				beforeEach(() => {
					branchCount = 2;
					maxDepth = 3;
					randomComposite = random.composite(branchCount, maxDepth, 'children', {
						id: random.integer(1, 10000)
					});
				});

				it('should be a function', () => {
					should(randomComposite).be.a.Function();
				});

				describe('returns', () => {
					var result;
					beforeEach(() => {
						result = randomComposite();
					});
					it('should be defined', () => {
						should(result).be.ok();
					});
					it('should have id', () => {
						should(result.id).be.a.Number();
					});
					it('should have children', () => {
						should(result.children).be.an.Array();
					});
					it('should have correct number of children', () => {
						should(result.children.length).equal(branchCount);
					});
					it('should have correct structure', () => {
						testComposite(result, 0);
					});
				});

				function testComposite(value, depth) {
					should(value.id).be.a.Number();
					should(value.children).be.an.Array();
					if (depth < maxDepth) {
						let numChildren = value.children.length;
						should(numChildren).equal(branchCount);
						for (let i = 0; i < numChildren; i++) {
							testComposite(value.children[i], depth + 1);
						}
					}
					else {
						should(value.children.length).equal(0);
					}
				}

			});

			describe('grouping', () => {

				it('should create new seed', () => {
					let seed = 'composite grouping test';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.number(0, 1);
					let randomNumberB = randomB.number(0, 1);
					let randomCompositeA = randomA.composite(randomA.integer(2, 4), randomA.integer(2, 7), 'children', {
						id: random.integer(10000, 20000),
						name: random.phrase(random.integer(2, 6))
					});

					randomNumberA();
					randomNumberB();

					randomCompositeA();
					randomNumberB();

					let a = randomNumberA();
					let b = randomNumberB();

					should(a).equal(b);
				});

			});

		});

		describe('.permutation', () => {

			describe('given empty list', () => {
				var randomPermutation;
				beforeEach(() => {
					randomPermutation = random.permutation(3, []);
				});
				it('should be function', () => {
					should(randomPermutation).be.a.Function();
				});
				it('should set generator to return value', () => {
					should(randomPermutation.generator).equal(randomPermutation);
				});
				it('should return empty array', () => {
					should(randomPermutation()).eql([]);
				});
			});

			describe('given constant length and non-empty list', () => {
				var list, randomPermutation;
				beforeEach(() => {
					list = ['foo', 'bar', 'baz', 'quux', 'corge'];
					randomPermutation = random.permutation(3, list);
				});
				it('should always return array', () => {
					for (let i = 0; i < 1000; i++) {
						let r = randomPermutation();
						should(r).be.an.Array();
					}
				});
				it('should always return array of correct length', () => {
					for (let i = 0; i < 1000; i++) {
						let r = randomPermutation();
						should(r.length).equal(3);
					}
				});
				it('should always return array containing items in list', () => {
					for (let i = 0; i < 1000; i++) {
						let r = randomPermutation();
						for (let x of r) {
							should(list).containEql(x);
						}
					}
				});
				it('should always return array containing distinct items', () => {
					for (let i = 0; i < 1000; i++) {
						let r = randomPermutation();
						let len = r.length;
						for (let j = 0; j < len; j++) {
							for (let k = 0; k < len; k++) {
								if (j !== k) {
									should(r[j]).not.eql(r[k]);
								}
							}
						}
					}
				});
				it('should return different array each time', () => {
					let a = randomPermutation();
					let b = randomPermutation();
					should(b).not.eql(a);
				});
			});

			describe('given non-empty list and constant count representing full list', () => {

				var list, randomPermutation;

				beforeEach(() => {
					list = ['foo', 'bar', 'baz', 'quux', 'corge'];
					randomPermutation = random.permutation(list.length, list);
				});

				it('should always return array with correct length', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						should(x.length).equal(list.length);
					}
				});
				it('should always return array containing items from list', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						for (let item of x) {
							should(list).containEql(item);
						}
					}
				});
				it('should always return array containing every item from list', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						for (let item of list) {
							should(x).containEql(item);
						}
					}
				});
				it('should return different values each time', () => {
					let a = randomPermutation();
					let b = randomPermutation();
					should(a).not.eql(b);
				});
			});

			describe('given non-empty list and constant count greater than list size', () => {

				var list, randomPermutation;

				beforeEach(() => {
					list = ['foo', 'bar', 'baz', 'quux', 'corge'];
					randomPermutation = random.permutation(list.length + 1, list);
				});

				it('should always return array with correct length', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						should(x.length).equal(list.length);
					}
				});
				it('should always return array containing items from list', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						for (let item of x) {
							should(list).containEql(item);
						}
					}
				});
				it('should always return array containing every item from list', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						for (let item of list) {
							should(x).containEql(item);
						}
					}
				});
			});

			describe('given non-empty list and dynamic count', () => {

				var minCount, maxCount, list, randomPermutation;

				beforeEach(() => {
					list = ['foo', 'bar', 'baz', 'quux', 'corge'];
					minCount = 2;
					maxCount = 4;
					should(maxCount).be.lessThan(list.length);
					should(minCount).be.lessThan(maxCount);
					should(minCount).be.greaterThan(0);
					count = random.integer(minCount, maxCount);
					randomPermutation = random.permutation(count, list);
				});

				it('should always return array with appropriate length', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						should(x.length).be.greaterThanOrEqual(minCount);
						should(x.length).be.lessThanOrEqual(maxCount);
					}
				});
				it('should always return array containing items from list', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						for (let item of x) {
							should(list).containEql(item);
						}
					}
				});
				it('should always return array containing distinct items', () => {
					for (let i = 0; i < 1000; i++) {
						let x = randomPermutation();
						for (let j in x) {
							for (let k in x) {
								if (j !== k) {
									should(x[j]).not.eql(x[k]);
								}
							}
						}
					}
				});
			});

			describe('consistency', () => {
				var randomA, randomB, randomPermA, randomPermB;
				beforeEach(() => {
					let seed = 'permutations consistency test seed alkdjaf';
					randomA = Randomizer.create(seed);
					randomB = Randomizer.create(seed);
					let count = 3;
					let list = ['foo', 'bar', 'baz', 'quux', 'corge'];
					randomPermA = randomA.permutation(count, list);
					randomPermB = randomB.permutation(count, list);
				});
				it('should always have same results for same seed', () => {
					for (let i = 0; i < 1000; i++) {
						let a = randomPermA();
						let b = randomPermB();
						should(a).eql(b);
					}
				});
			});

			describe('grouping', () => {
				var randomA, randomB, randomPermA, randomNumberA, randomNumberB;
				beforeEach(() => {
					let seed = 'permutuations grouping testing seed alc908qw';
					randomA = Randomizer.create(seed);
					randomB = Randomizer.create(seed);
					let count = 3;
					let list = ['foo', 'bar', 'baz', 'quux', 'corge'];
					randomPermA = randomA.permutation(count, list);
					randomNumberA = randomA.number(0, 1000);
					randomNumberB = randomB.number(0, 1000);
				});
				it('should keep permutation values atomic', () => {
					let a1 = randomNumberA();
					let b1 = randomNumberB();
					let a2 = randomPermA();
					let b2 = randomNumberB();
					let a3 = randomNumberA();
					let b3 = randomNumberB();
					should(b3).equal(a3);
				});
			});

		});

	});

});