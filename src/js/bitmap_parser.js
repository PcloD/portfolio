function bitmapParser() {
	var con = console;
	var parsed = [];
	var img = new Image();
	var bmpsize = 70; //180

	let loadImage = (callback) => {
		img.onload = () => {

			con.log("loaded");

			var sx = 0, sy = 0, sw = bmpsize, sh = bmpsize;
			var canvas = document.createElement("canvas");
			document.body.appendChild(canvas);
			var ctx = canvas.getContext("2d");

			var size = 2;
			var canvas2 = document.createElement("canvas");
			canvas2.width = canvas2.height = size * bmpsize;
			document.body.appendChild(canvas2);
			var ctx2 = canvas2.getContext("2d");

			ctx.drawImage(img, 0, 0);
			var pixels = ctx.getImageData(sx, sy, sw, sh).data;

			// con.log(pixels);
			for (var i = 0, il = pixels.length; i < il; i += 4) {
				var pixelIndex = i / 4;
				var red = pixels[i];
				// var green = pixels[i + 1];
				// var blue = pixels[i + 2];
				// var alpha = pixels[i + 3];
				// con.log(red);
				var rgb = 'rgb(' + red + ',' + red + ',' + red + ')';

				// var threshold = 254;
				// var off = red >= threshold && green >= threshold && blue >= threshold;
				// var color = document.createElement("div");
				// document.body.appendChild(color);
				// color.style.display = "inline-block";
				// color.style.background = rgba;
				// color.style.width = color.style.height = "3px"

				var x = (pixelIndex % bmpsize) * size;
				var y = Math.floor(pixelIndex / bmpsize) * size;
				ctx2.fillStyle = rgb;
				ctx2.fillRect(x, y, size, size);

				parsed.push(red < 250 ? red : null);
			}
			// con.log(parsed);
			callback();
		};

		img.src = "images/test.png";
	}

	return {
		getPixels: () => { return parsed; },
		loadImage: loadImage
	}
}

module.exports = bitmapParser;