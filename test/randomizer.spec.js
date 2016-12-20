var should = require('should');
var Randomizer = require('../lib/randomizer');

describe('Randomizer', ()=> {

	it('should be defined', ()=> {
		should(Randomizer).be.ok();
	});

	describe('.create', ()=> {

		var random;

		beforeEach(()=> {
			random = Randomizer.create('Example seed.');
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
					var random2 = Randomizer.create('Example seed.');
					var randomNumber2 = random2.numbers(1, 10);
					var x = randomNumber();
					var x2 = randomNumber2();
					should(x).equal(x2);
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

		});

	});

});