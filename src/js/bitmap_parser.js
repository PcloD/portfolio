function bitmapParser() {
	let con = console;
	let img = new Image();
	let bmpwidth = 768, bmpheight = 630;
	var canvas, ctx;
	let loadImage = (callback) => {
		img.onload = () => {

			// con.log("loaded");

			canvas = document.createElement("canvas");
			canvas.width = bmpwidth;
			canvas.height = bmpheight;
			ctx = canvas.getContext("2d");

			// document.body.appendChild(canvas);

			// var size = 2;
			// var canvas2 = document.createElement("canvas");
			// canvas2.width = canvas2.height = size * bmpsize;
			// document.body.appendChild(canvas2);
			// var ctx2 = canvas2.getContext("2d");

			ctx.drawImage(img, 0, 0);
			callback();
		};

		img.src = "images/clients.png";
	}

	let getPixels = (index) => {
		index = Math.round(index);
		let maxImages = 30, cols = 6; // 6 x 5 matrix of client images
		index %= maxImages;
		let x = index % cols;
		let y = Math.floor(index / cols);
		var sw = 128, sh = 126, sx = sw * x, sy = sh * y;
		var pixels = ctx.getImageData(sx, sy, sw, sh).data;
		var parsed = [];
		for (var i = 0, il = pixels.length; i < il; i += 4) {
			var pixelIndex = i / 4;
			var red = pixels[i];

			// var x = (pixelIndex % bmpsize) * size;
			// var y = Math.floor(pixelIndex / bmpsize) * size;
			// ctx2.fillStyle = rgb;
			// ctx2.fillRect(x, y, size, size);

			parsed.push(red < 254 ? red : null);
		}
		return parsed;
	}

	return {
		getPixels: getPixels,
		loadImage: loadImage
	}
}

module.exports = bitmapParser;