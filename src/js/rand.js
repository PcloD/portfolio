module.exports = (() => {
	let num = (min, max) => {
		return Math.random() * (max - min) + min;
	};
	let int = (min, max) => {
		return Math.round(num(min, max));
	};
	return {
		num: num,
		int: int
	}
})();