const assert = require('assert');

function enable(f) {
	assert(typeof f === 'function', 'invalid argument to enable must be a function');
	f.generator = f;
	f.transform = t => {
		return enable(() => t(f()));
	};
	return f;
}

module.exports = enable;
