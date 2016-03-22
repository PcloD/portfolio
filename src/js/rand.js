module.exports = (() => {
	let num = (min, max) => {
		return Math.random() * (max - min) + min;
	};
	let int = (min, max) => {
		return Math.round(num(min, max));
	};


	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}



	return {
		shuffleArray: shuffleArray,
		num: num,
		int: int
	}
})();