let random = require('../').create('categories seed 14');

let branchCount = random.integers(2, 3);
let depth = random.integers(3, 5);//(2, 4);
var randomCategory = random.composites(branchCount, depth, 'subCategories', {
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