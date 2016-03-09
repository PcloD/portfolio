var con = console;
var img = new Image();
var bmpsize = 180;
img.onload = () => {
	con.log("loaded");

	var sx = 0, sy = 0, sw = bmpsize, sh = bmpsize;
	var canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d");

	// var canvas2 = document.createElement("canvas");
	// document.body.appendChild(canvas2);
	// var ctx2 = canvas2.getContext("2d");

	ctx.drawImage(img, 0, 0);
	var pixels = ctx.getImageData(sx, sy, sw, sh).data;

	// con.log(pixels);

	for (var i = 0, il = pixels.length; i < il; i += 4) {
		var pixelIndex = i / 4;
		var red = pixels[i];
		var green = pixels[i + 1];
		var blue = pixels[i + 2];
		var alpha = pixels[i + 3];
		var rgba = 'rgba(' + red + ',' + green +',' + blue + ',' + alpha + ')';

		// var color = document.createElement("div");
		// document.body.appendChild(color);
		// color.style.display = "inline-block";
		// color.style.background = rgba;
		// color.style.width = color.style.height = "3px"

		// var size = 2;
		// var x = (pixelIndex % bmpsize) * size;
		// var y = Math.floor(pixelIndex / bmpsize) * size;
		// ctx2.fillStyle = rgba;
		// ctx2.fillRect(x, y, size, size);
	}
};

img.src = "images/test.png";