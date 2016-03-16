const constants = require("./constants.js");
// let rand = require("./rand.js");
import {num, int} from "./rand.js";

let transitions = (() => {
	let con = console;

	let getXY = (pixel, modifier = {}) => {
		var gapX = modifier.gapX || constants.gap;
		var gapY = modifier.gapY || constants.gap;
		var x = (-pixel.x + constants.cols / 2) * (constants.size.width + gapX);
		var y = (-pixel.y + constants.rows / 2) * (constants.size.height + gapY);
		var z = -2000;
		return {
			x: x,
			y: y
		};
	};


	let animateIn = (box, pixel, style) => {
		if (style === 0) con.warn("animateIn - you are passing in style which is 0!");
		style = style || 0; // int(0,1);

		switch(style) {

			case 1 : // standard transition in to varying y depths, then stabilise
				var pos = getXY(pixel);
				pos.z = -2000;
				box.position.set(pos.x, pos.y, pos.z);

				var time = num(0.5, 1.5), delay = num(0.2, 1.5);

				var anim0 = TweenMax.to(pos, time, {
					z: num(-25, 25),
					delay: delay,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				var anim1 = TweenMax.to(pos, 0.3, {
					z: 0,
					delay: 3,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;

			case 2 : // zoom in with gaps then circular to centre
				var pos = getXY(pixel, {gapX: 2, gapY: 2});
				pos.z = -2000;
				box.position.set(pos.x, pos.y, pos.z);

				var finalPos = getXY(pixel);
				var time = 1.5, delay = Math.sqrt(finalPos.x * finalPos.x + finalPos.y * finalPos.y) * 0.01;
				var anim0 = TweenMax.to(pos, time, {
					z: 0,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				var anim1 = TweenMax.to(pos, 2.3, {
					x: finalPos.x,
					y: finalPos.y,
					delay: delay,
					// ease: "Bounce.easeOut",
					ease: "Elastic.easeInOut",
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;



			case 3 : // horizontal pan
				var pos = getXY(pixel);
				pos.z = -2000;
				box.position.set(pos.x, pos.y, pos.z);

				var time = 2, delay = (pos.y * 0.2 + pos.x + constants.cols / 2) * 0.01;
				var anim0 = TweenMax.to(pos, time, {
					z: 0,
					delay: delay,
					ease: "Bounce.easeOut",
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;


		}



		// setTimeout(() => {
		// 	con.log("now... ");
		// 	anim.timeScale( 0.2 ); //sets timeScale to half-speed
		// }, 1000)

		// TweenMax.to(pos, num(0.5, 1.5), {
		// 	// x: x,
		// 	// y: y,
		// 	z: num(50, 100),
		// 	delay: num(0.2, 1.5),
		// 	onUpdate: () => {
		// 		box.position.set(pos.x, pos.y, pos.z);
		// 	}
		// });

	}

	let animateBetween = (box, pixel, style) => {
		if (style === 0) con.warn("animateBetween - you are passing in style which is 0!");
		// style = style;// || int(0, 1);
		// con.log("animateBetween");

		switch(style) {
			case 1 : // wiggle to new position.
				var pos = {
					x: box.position.x,
					y: box.position.y,
					z: box.position.z
				};


				var finalPos = getXY(pixel);

				// con.log("animateBetween");

				var time = 2, delay = num(0.2, 1);
				var anim0 = TweenMax.to(pos, time, {
					x: finalPos.x,
					y: finalPos.y,
					z: -100,
					delay: delay,
					// ease: "Bounce.easeOut",
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;
			}

	}


	let animateOut = (box, pixel, style) => {
		if (style === 0) con.warn("animateOut - you are passing in style which is 0!");
	}

	return {
		animateIn: animateIn,
		animateBetween: animateBetween,
		animateOut: animateOut
	}
})();

module.exports = transitions;