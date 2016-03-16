function bitmapParser() {
	let con = console;
	let img = new Image();
	// let montageWidth = 768, montageHeight = 630;
	let montageWidth = 384, montageHeight = 126;
	var canvas, ctx;
	let loadImage = (callback) => {
		img.onload = () => {

			// con.log("loaded");

			canvas = document.createElement("canvas");
			canvas.width = montageWidth;
			canvas.height = montageHeight;
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
		// let maxImages = 30, cols = 6; // 6 x 5 matrix of client images
		let maxImages = 3, cols = 3; // 3 x 1 matrix of client images
		index %= maxImages;
		let x = index % cols;
		let y = Math.floor(index / cols);
		var bmpWidth = 128, bmpHeight = 126, sx = bmpWidth * x, sy = bmpHeight * y;
		var pixels = ctx.getImageData(sx, sy, bmpWidth, bmpHeight).data;
		var parsed = [];
		for (var i = 0, il = pixels.length; i < il; i += 4) {
			var pixelIndex = i / 4;
			var red = pixels[i];
			var xp = (pixelIndex % bmpWidth);
			var yp = Math.floor(pixelIndex / bmpWidth);
			// ctx2.fillStyle = rgb;
			// ctx2.fillRect(x, y, size, size);

			if (red < 254) {
				parsed.push({r: red, x: xp, y: yp});
			}
		}
		return parsed;
	}

	return {
		getPixels: getPixels,
		loadImage: loadImage
	}
}

module.exports = bitmapParser;