const constants = require("./constants.js");
// let rand = require("./rand.js");
import {num} from "./rand.js";

let transitions = (() => {
	let con = console;

	let getXY = (index, modifier = {}) => {
		var gapX = modifier.gapX || constants.gap;
		var gapY = modifier.gapY || constants.gap;

		// con.log(gapX, gapY);

		var xi = index % constants.cols;
		var yi = Math.floor(index / constants.cols);
		var x = (-xi + constants.cols / 2) * (constants.size.width + gapX);
		var y = (-yi + constants.rows / 2) * (constants.size.height + gapY);
		var z = -2000;
		return {
			x: x,
			y: y
		};
	};


	let animateIn = (box, index) => {
		var style = 2;//int(0,1);

		switch(style) {
			case 0 : // standard transition in to varying y depths, then stabilise
				var pos = getXY(index);
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

			case 1 : // zoom in with gaps then circular to centre
				var pos = getXY(index, {gapX: 2, gapY: 2});
				pos.z = -2000;
				box.position.set(pos.x, pos.y, pos.z);

				var finalPos = getXY(index);
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



			case 2 : // horizontal pan
				var pos = getXY(index);
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

	let animateOut = (box, index) => {

	}

	return {
		animateIn: animateIn,
		animateOut: animateOut
	}
})();

module.exports = transitions;