let random = require('../').create('categories seed 7');

var randomCategory = random.composites(random.integers(2, 3), 3, 'subCategories', {
	id: random.integers(10000, 20000),
	name: random.phrases(random.integers(3, 6))
});

let n = 1;

for (let i = 0; i < n; i++) {
	let category = randomCategory();
	console.log(categoryToString(category));
}

function categoryToString(category, prefix) {
	if (!prefix) {
		prefix = '';
	}
	return [

		prefix,

		'#', category.id, ' ', category.name, '\n',

		category.subCategories.map((child) => {
			return categoryToString(child, prefix + '    ');
		}).join('')

	].join('');

}