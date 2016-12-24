var should = require('should');
var Randomizer = require('../');

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

		it('should fail without seed', ()=> {
			should(()=>Randomizer.create()).throwError();
		});

		it('should return defined value', ()=> {
			should(random).be.ok();
		});

		describe('.numbers', ()=> {

			it('should return function', ()=> {
				should(random.numbers(1, 10)).be.a.Function();
			});

			it('should fail with no arguments', ()=> {
				should(()=>random.numbers()).throwError();
			});

			it('should fail with only 1 argument', ()=> {
				should(()=>random.numbers(1)).throwError();
			});

			it('should fail with invalid second argument', ()=> {
				should(()=>random.numbers(1, 'awawa')).throwError();
			});

			it('should fail with no range', ()=> {
				should(()=>random.numbers(1, 1)).throwError();
			});

			it('should fail with negative range', ()=> {
				should(()=>random.numbers(5, 3)).throwError();
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

			describe('from 0 to 2', ()=> {

				var randomInteger;

				beforeEach(()=> {
					randomInteger = random.integers(0, 2);
				});

				describe('counts', ()=> {
					var counts, numTrials;
					beforeEach(()=> {
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

					it('should have about the same amount of 0s as 1s', ()=> {
						should(counts[0]).be.approximately(counts[1], numTrials / 10);
					});

					it('should have about the same amount of 1s as 2s', ()=> {
						should(counts[1]).be.approximately(counts[2], numTrials / 10);
					})
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
					var values, numTrials;
					beforeEach(()=> {
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
					it('should sometimes return true', ()=> {
						should(values['true']).be.greaterThan(0);
					});
					it('should sometimes return false', ()=> {
						should(values['false']).be.greaterThan(0);
					});
					it('should never return value other than true or false', ()=> {
						should(values['other']).equal(0);
					});
					it('should have about as many true and false', ()=> {
						should(values['true']).be.approximately(values['false'], numTrials / 10);
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

			describe('with 3/4 bias towards true', ()=> {
				var ratio, randomBoolean;
				beforeEach(()=> {
					ratio = 0.75;
					randomBoolean = random.booleans(ratio);
				});
				it('should return true 3/4 of the time', ()=> {
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

		describe('.choices', ()=> {

			describe('among a few possible states', ()=> {

				var states, randomState;

				beforeEach(()=> {
					states = ['guest', 'member', 'vip'];
					randomState = random.choices(states);
				});

				it('should return one of the possible states', ()=> {
					for (let i = 0; i < 1000; i++) {
						let x = randomState();
						should(states).containEql(x);
					}
				});

			});

		});

		describe('.alternatives', ()=> {

			describe('with two random functions', ()=> {

				var randomAlt, minInteger, maxInteger, choices;

				beforeEach(()=> {
					minInteger = 0;
					maxInteger = 9;
					choices = 'abcdef'.split('');
					let randomInteger = random.integers(minInteger, maxInteger);
					let randomLetter = random.choices(choices);
					randomAlt = random.alternatives([randomInteger, randomLetter]);
				});

				it('should be a function', ()=> {
					should(randomAlt).be.a.Function();
				});

				it('should return appropriate values', ()=> {
					for (let i = 0; i < 1000; i++) {
						let r = randomAlt();
						let validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
						should(validValues).containEql(r);
					}
				});

				it('should alternate evenly', ()=> {
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

			describe('grouping', ()=> {
				it('should create new seed', ()=> {
					let seed = 'unit testing seed for grouping alternatives';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.numbers(0, 1);
					let randomNumberB = randomB.numbers(0, 1);
					let randomThingA = randomA.alternatives([
						randomA.numbers(100, 200),
						randomA.numbers(300, 400)
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

		describe('.arrays', ()=> {

			describe('of 10 numbers from 5 to 7', ()=> {

				var randomArray, length;

				beforeEach(()=> {
					length = 10;
					randomArray = random.arrays(length, random.numbers(5, 7));
				});

				it('should be a function', ()=> {
					should(randomArray).be.a.Function();
				});

				describe('value', ()=> {
					var array;
					beforeEach(()=> {
						array = randomArray();
					});
					it('should be an array', ()=> {
						should(array).be.an.Array();
					});
					it('should have correct length', ()=> {
						should(array.length).equal(length);
					});
					it('should contain correct types of items', ()=> {
						for (let item of array) {
							should(item).be.a.Number();
							should(item).not.be.lessThan(5);
							should(item).be.lessThan(7);
						}
					});
				});

			});

			describe('of random number of items', ()=> {

				var minLength, maxLength, randomArray;

				beforeEach(()=> {
					minLength = 5;
					maxLength = 7;
					randomArray = random.arrays(random.integers(minLength, maxLength), random.booleans());
				});

				describe('returns', ()=> {
					var array;
					beforeEach(()=> {
						array = randomArray();
					});

					it('should have length in correct range', ()=> {
						should(array.length).not.be.lessThan(minLength);
						should(array.length).not.be.greaterThan(maxLength);
					});

					it('should contain only booleans', ()=> {
						for (let item of array) {
							should(item).be.a.Boolean();
						}
					});
				});

			});

			describe('of random numbers from 0 to 99', ()=> {

				var random1, random2;

				beforeEach(()=> {
					let seed = 'Common test seed 159.';
					random1 = Randomizer.create(seed);
					random2 = Randomizer.create(seed);
				});

				it('should increment only once for a complex data structure', ()=> {
					let randomNumber1 = random1.numbers(0, 99);
					let randomNumber2 = random2.numbers(0, 99);
					let randomArray1 = random1.arrays(2, randomNumber1);
					let list1 = [randomNumber1(), randomArray1(), randomNumber1()];
					let list2 = [randomNumber2(), randomNumber2(), randomNumber2()];
					should(list1[0]).equal(list2[0]);
					should(list1[2]).equal(list2[2]);
				});

			});

		});

		describe('.objects', ()=> {

			describe('with 2 constant properties', ()=> {

				var randomObject;

				beforeEach(()=> {
					randomObject = random.objects({
						foo: 1,
						bar: 'two'
					});
				});

				it('should be a function', ()=> {
					should(randomObject).be.a.Function();
				});

				describe('returns', ()=> {
					var value;
					beforeEach(()=> {
						value = randomObject();
					});
					it('should be an Object', ()=> {
						should(value).be.an.Object();
					});
					it('should have correct keys', ()=> {
						should(Object.keys(value)).eql(['foo', 'bar']);
					});
				});

			});

			describe('with 2 dynamic properties', ()=> {

				var minAge, maxAge, sexes, randomObject;

				beforeEach(()=> {
					minAge = 18;
					maxAge = 34;
					sexes = ['M', 'F'];
					randomObject = random.objects({
						age: random.integers(minAge, maxAge),
						sex: random.choices(sexes)
					});
				});

				describe('returns', ()=> {
					var value;
					beforeEach(()=> {
						value = randomObject();
					});
					it('should have correct keys', ()=> {
						should(Object.keys(value)).eql(['age', 'sex']);
					});
					it('should have integer for age property', ()=> {
						should(value.age).be.a.Number();
					});
					it('should have string for sex property', ()=> {
						should(value.sex).be.a.String();
					});
				});

			});

			describe('with 2 dynamic integer property', ()=> {

				var random1, random2;

				beforeEach(()=> {
					let seed = 'Example object Seed~';
					random1 = Randomizer.create(seed);
					random2 = Randomizer.create(seed);
					randomInteger1 = random1.integers(0, 99);

					randomInteger2 = random2.integers(0, 99);

					randomObject1 = random1.objects({
						foo: random.integers(0, 99),
						bar: random.integers(0, 99)
					});
				});

				it('should increment random sequence the same regardless of object groupings', ()=> {
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

		describe('.phrases', ()=> {

			it('should throw error without word count', ()=> {
				should(()=>random.phrases()).throw();
			});

			it('should throw error given invalid word count', ()=> {
				should(()=>random.phrases('t')).throw();
			});

			describe('with constant word count', ()=> {

				var randomPhrase, wordCount;

				beforeEach(()=> {
					wordCount = 3;
					randomPhrase = random.phrases(wordCount);
				});

				it('should return a function', ()=> {
					should(randomPhrase).be.a.Function();
				});

				it('should return a string', ()=> {
					should(randomPhrase()).be.a.String();
				});

				it('should have correct word count', ()=> {
					var phrase = randomPhrase();
					var words = phrase.split(' ');
					should(words.length).equal(wordCount);
				});

				it('should return different value each time', ()=> {
					var x1 = randomPhrase();
					var x2 = randomPhrase();
					should(x1).not.eql(x2);
				});

			});

			describe('grouping', ()=> {

				it('should use separate seed for phrase', ()=> {
					var seed = 'Phrase grouping test';
					var randomA = new Randomizer(seed);
					var randomB = new Randomizer(seed);
					var randomNumberA = randomA.numbers(0, 1);
					var listA = [
						randomNumberA(),
						randomNumberA()
					];
					var randomNumberB = randomB.numbers(0, 1);
					var randomPhraseB = randomB.phrases(3);
					var listB = [
						randomPhraseB(),
						randomNumberB()
					];
					should(listA[1]).equal(listB[1]);
				});
			});

			describe('with dynamic word count', ()=> {
				var minWordCount, maxWordCount, randomPhrase;
				beforeEach(()=> {
					minWordCount = 3;
					maxWordCount = 5;
					randomPhrase = random.phrases(random.integers(minWordCount, maxWordCount));
				});
				it('should return string', ()=> {
					should(randomPhrase()).be.a.String();
				});
				it('should always return string in calculated word count range', ()=> {
					for (let i = 0; i < 1000; i++) {
						var phrase = randomPhrase();
						var words = phrase.split(' ');
						should(words.length).be.greaterThan(minWordCount - 1);
						should(words.length).be.lessThan(maxWordCount + 1);
					}
				});
			});

		});

		describe('.sentences', ()=> {

			var randomSentence;
			beforeEach(()=> {
				randomSentence = random.sentences();
			});

			it('should return function', ()=> {
				should(randomSentence).be.a.Function();
			});

			it('should generate strings', ()=> {
				let sentence = randomSentence();
				should(sentence).be.a.String();
			});

			it('should generate non-empty strings', ()=> {
				should(randomSentence()).be.ok();
			});

			it('should generate different strings each time', ()=> {
				should(randomSentence()).not.equal(randomSentence());
			});

			describe('grouping', ()=> {
				it('should use different seed for each sentence', ()=> {
					let seed = 'abcd';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.numbers(0, 1);
					let randomNumberB = randomB.numbers(0, 1);
					let randomSentenceA = randomA.sentences();
					randomSentenceA();
					randomNumberB();
					let a = randomNumberA();
					let b = randomNumberB();
					should(a).equal(b);
				});
			});

		});

		describe('.paragraphs', ()=> {

			var randomParagraph;
			beforeEach(()=> {
				randomParagraph = random.paragraphs();
			});

			it('should return function', ()=> {
				should(randomParagraph).be.a.Function();
			});

			it('should generate strings', ()=> {
				let paragraph = randomParagraph();
				should(paragraph).be.a.String();
			});

			it('should generate non-empty strings', ()=> {
				should(randomParagraph()).be.ok();
			});

			it('should generate different strings each time', ()=> {
				should(randomParagraph()).not.equal(randomParagraph());
			});

			it('should generate multiple sentences', ()=> {
				let p = randomParagraph();
				let sentences = p.split('. ');
				should(sentences.length).be.greaterThan(1);
			});

			describe('grouping', ()=> {
				it('should use different seed for each paragraph', ()=> {
					let seed = 'abcd';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.numbers(0, 1);
					let randomNumberB = randomB.numbers(0, 1);
					let randomParagraphA = randomA.paragraphs();
					randomParagraphA();
					randomNumberB();
					let a = randomNumberA();
					let b = randomNumberB();
					should(a).equal(b);
				});
			});

		});

		describe('.dates', ()=> {

			it('should throw error if given zero arguments', ()=> {
				should(()=>random.dates()).throw();
			});

			it('should throw error if given one argument', ()=> {
				should(()=>random.dates(new Date(1e12))).throw();
			});

			it('should throw error if given two arguments with an invalid value', ()=> {
				should(()=>random.dates('t', 'u')).throw();
			});

			it('should throw error if given two valid arguments with negative range', ()=> {
				should(()=>random.dates(new Date(1.1e12), new Date(1e12))).throw();
			});

			describe('in certain date range', ()=> {

				var min, max, randomDate;

				beforeEach(()=> {
					min = 1e12;
					max = 1.1e12;
					let minDate = new Date(min);
					let maxDate = new Date(max);
					randomDate = random.dates(minDate, maxDate);
				});

				it('should return a function', ()=> {
					should(randomDate).be.a.Function();
				});

				it('should generate Date instances', ()=> {
					let date = randomDate();
					should(date).be.instanceOf(Date);
				});

				it('should always generate Date within range', ()=> {
					for (let i = 0; i < 1000; i++) {
						let d = randomDate();
						let n = Number(d);
						should(n).not.be.lessThan(min);
						should(n).not.be.greaterThan(max);
					}
				});

			});

		});

		describe('.transformations', ()=> {

			it('should fail when given no arguments', ()=> {
				should(()=>random.transformations()).throw();
			});

			it('should fail when given one valid argument', ()=> {
				let facs = [
					()=> {
					}
				];
				should(()=>random.transformations(facs)).throw();
			});

			describe('with one non-random argument', ()=> {

				var randomTransformation;

				beforeEach(()=> {
					randomTransformation = random.transformations([
						1.5
					], (x) => {
						return {x: x};
					});
				});

				it('should be a function', ()=> {
					should(randomTransformation).be.a.Function();
				});

				describe('return', ()=> {

					var result;

					beforeEach(()=> {
						result = randomTransformation();
					});

					it('should have been transformed', ()=> {
						should(result).eql({
							x: 1.5
						});
					});

				});

			});

			describe('with 2 random arguments', ()=> {

				var randomTransformation;

				beforeEach(()=> {
					randomTransformation = random.transformations([
						random.numbers(1, 2),
						random.numbers(3, 4)
					], (x, y) => {
						return {
							x: x,
							y: y
						};
					})
				});

				it('should be a function', ()=> {
					should(randomTransformation).be.a.Function();
				});

				it('should always return appropriate value', ()=> {
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

			describe('grouping', ()=> {

				it('should create new seed', ()=> {
					let seed = 'transformations grouping test';
					let randomA = Randomizer.create(seed);
					let randomB = Randomizer.create(seed);
					let randomNumberA = randomA.numbers(0, 1);
					let randomNumberB = randomB.numbers(0, 1);
					let randomThingA = randomA.transformations([
						randomA.numbers(1, 2),
						randomA.numbers(3, 4)
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

			});

		});

		describe('.composites', ()=> {

			it('should fail when given no arguments', ()=> {
				should(()=>random.composites()).throw();
			});

			it('should fail when first argument is invalid-falsy', ()=> {
				should(()=>random.composites(null, 3, 'children', {})).throw();
			});

			it('should fail when second argument is invalid', ()=> {
				should(()=>random.composites(2, null, 'children', {})).throw();
			});

			it('should fail when third argument is falsy', ()=> {
				should(()=>random.composites(2, 3, null, {})).throw();
			});

			it('should fail when fourth argument is not an object', ()=> {
				should(()=>random.composites(2, 3, 'children', null)).throw();
			});

			describe('with branch count 0 and max depth greater than 0', ()=> {

				var randomComposite;

				beforeEach(()=> {
					randomComposite = random.composites(0, 3, 'children', {
						id: random.integers(1, 10000)
					});
				});

				describe('return', ()=> {
					var result;
					beforeEach(()=> {
						result = randomComposite();
					});
					it('should be defined', ()=> {
						should(result).be.ok();
					});
					it('should have appropriate id', ()=> {
						should(result.id).be.greaterThan(0);
						should(result.id).be.lessThan(10001);
					});
					it('should have empty list of children', ()=> {
						should(result.children).eql([]);
					});
				});

			});

			describe('with branch count greater than 0 and max depth 0', ()=> {

				var randomComposite;

				beforeEach(()=> {
					randomComposite = random.composites(2, 0, 'children', {
						id: random.integers(1, 10000)
					});
				});

				describe('result', ()=> {
					var result;
					beforeEach(()=> {
						result = randomComposite();
					});
					it('should be ok', ()=> {
						should(result).be.ok();
					});
					it('should have appropriate id', ()=> {
						should(result.id).be.a.Number();
					});
					it('should have empty list of children', ()=> {
						should(result.children).eql([]);
					});
				});

			});

			describe('with dynamic branch count and constant max depth', ()=> {

				var randomComposite, minBranchCount, maxBranchCount, maxDepth;

				beforeEach(()=> {
					minBranchCount = 2;
					maxBranchCount = 3;
					let branchCount = random.integers(minBranchCount, maxBranchCount);
					maxDepth = 3;
					randomComposite = random.composites(branchCount, maxDepth, 'children', {
						id: random.integers(1, 10000)
					});
				});

				it('should be a function', ()=> {
					should(randomComposite).be.a.Function();
				});

				describe('returns', ()=> {
					var result;
					beforeEach(()=> {
						result = randomComposite();
					});
					it('should be defined', ()=> {
						should(result).be.ok();
					});
					it('should have id', ()=> {
						should(result.id).be.a.Number();
					});
					it('should have children', ()=> {
						should(result.children).be.an.Array();
					});
					it('should have correct number of children', ()=> {
						should(result.children.length).be.greaterThan(minBranchCount - 1);
						should(result.children.length).be.lessThan(minBranchCount + 1);
					});
					it('should have correct structure', ()=> {
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

			describe.skip('with constant branch count and ranged max depth', () => {

				var randomComposite, branchCount, minDepth, maxDepth;

				beforeEach(()=> {
					branchCount = 2;
					minDepth = 3;
					maxDepth = 5;
					randomComposite = random.composites(branchCount, random.integers(minDepth, maxDepth), 'children', {});
				});

				it('should be a function', ()=> {
					should(randomComposite).be.a.Function();
				});

				describe('returns', ()=> {

					var result;

					beforeEach(()=> {
						result = randomComposite();
					});

					it('should be defined', ()=> {
						should(result).be.ok();
					});

					it('should have children array', ()=> {
						should(result.children).be.an.Array();
					});

					it.skip('should have appropriate number of children', ()=> {
						should(result.children.length).be.greaterThan(minDepth - 1);
						should(result.children.length).be.lessThan(maxDepth + 1);
					});

				});

			});

			describe('with constant branch count and constant max depth', ()=> {

				var randomComposite, branchCount, maxDepth;

				beforeEach(()=> {
					branchCount = 2;
					maxDepth = 3;
					randomComposite = random.composites(branchCount, maxDepth, 'children', {
						id: random.integers(1, 10000)
					});
				});

				it('should be a function', ()=> {
					should(randomComposite).be.a.Function();
				});

				describe('returns', ()=> {
					var result;
					beforeEach(()=> {
						result = randomComposite();
					});
					it('should be defined', ()=> {
						should(result).be.ok();
					});
					it('should have id', ()=> {
						should(result.id).be.a.Number();
					});
					it('should have children', ()=> {
						should(result.children).be.an.Array();
					});
					it('should have correct number of children', ()=> {
						should(result.children.length).equal(branchCount);
					});
					it('should have correct structure', ()=> {
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

		});
	});

});