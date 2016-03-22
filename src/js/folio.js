var con = console;

const constants = require("./constants.js");

let rand = require("./rand.js");
// let num = rand.num;
// con.log(rand, num);
// import {num} from "./rand.js";

let transitions = require("./transitions.js");
let bmp = require("./bitmap_parser.js")();
bmp.loadImage(() => {
	init();
	con.log("init done");
});


var isMouseDown = false;

var camera, scene, renderer;
var mouse = {x: 0, y: 0};
var camPos = {x: 0, y: 0, z: 10};

var sw = window.innerWidth, sh = window.innerHeight;

var backdrop = [];

// var cols = 128;
// var rows = 126;
// var gap = 0;

// var allRowsDepth = rows * (size.depth + gap);
// var allColsWidth = cols * (size.depth + gap);


function draw(props) {

	// var material = new THREE.MeshPhongMaterial( {
	// 	color: props.colour,
	// 	specular: props.colour,
	// 	shininess: 1,
	// 	shading: THREE.SmoothShading
	// });

	var material = props.material || "MeshBasicMaterial";

	var material = new THREE[material]({
		color: props.colour
	})

	var geometry = new THREE.BoxGeometry(props.width, props.height, props.depth);
	var object = new THREE.Mesh(geometry, material);
	return object;
}


let newBackdrop = () => {
	var colour = rand.int(80, 150);
	var size = rand.int(30, 150);
	var obj = draw({
		colour: colour << 16 | colour << 8 | colour,
		depth: size,
		height: size,
		width: size,
		material: "MeshPhongMaterial"
	});
	obj.position.set(rand.num(-1000, 1000), rand.num(-1000, 1000), 1000);
	scene.add(obj);
	obj.motion = {
		rotation: {
			x: rand.num(-1, 1) * 0.01,
			y: rand.num(-1, 1) * 0.01,
			z: rand.num(-1, 1) * 0.01,
		},
		speed: rand.num(1, 5)
	}
	backdrop.push(obj);
}







function init() {

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xffffff, 0.001);

	camera = new THREE.PerspectiveCamera(60, sw / sh, 1, 10000);
	scene.add( camera );

	var lightAbove = new THREE.DirectionalLight(0xffffff, 1);
	lightAbove.position.set(-1, 1, 0.25).normalize();
	scene.add( lightAbove );

	var lightAbove2 = new THREE.DirectionalLight(0xffffff, 2);
	lightAbove2.position.set(1, 1, 0.25).normalize();
	scene.add( lightAbove2 );

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( sw, sh );
	renderer.setClearColor( scene.fog.color );



	var blocks = [], blocksMax = 0;

	let renderLogo = (logoIndex) => {

		var pixels = rand.shuffleArray(bmp.getPixels(logoIndex));

		let createBox = (index, pixel) => {
			var box;
			if (blocks[index]) {
				box = blocks[index];
				transitions.animateBetween(index, box, pixel, 3);
			} else {
				box = draw({
					colour: pixel.colour,
					depth: constants.size.depth,
					height: constants.size.height,
					width: constants.size.width
				});
				blocks.push(box);
				scene.add(box);
				transitions.animateIn(index, box, pixel, 1);
			}
		}

		let killBox = (index) => {
			if (blocks[index]) {
				var box = blocks[index];
				transitions.animateOut(index, box, null, 1);
			} else {
				con.log("not found!");
			}
		}

		var pixelsMax = pixels.length;
		for (var i = 0, il = pixelsMax; i < il; i++) {
			createBox(i, pixels[i]);
		};
		blocksMax = Math.max(blocks.length, blocksMax);
		if (pixelsMax < blocksMax) {
			for (i = il, il = blocksMax; i < il; i++) {
				killBox(i);
			};
		}


		con.log("blocks", blocksMax);

		setTimeout(() => {
			renderLogo(++logoIndex);
		}, 4000);


	};

	// var centre = draw({
	// 	colour: 0xff00ff,
	// 	depth: 50,
	// 	height: 150,
	// 	width: 600
	// });
	// centre.position.set(0, 0, 100);
	// scene.add(centre);

	newBackdrop();


	document.body.appendChild(renderer.domElement);



	var logoIndex = 2;//rand.int(0, 4);
	renderLogo(logoIndex);



	function listen(eventNames, callback) {
		for (var i = 0; i < eventNames.length; i++) {
			window.addEventListener(eventNames[i], callback);
		}
	}
	listen(["resize"], function(e){
		sw = window.innerWidth;
		sh = window.innerHeight
		camera.aspect = sw / sh;
		camera.updateProjectionMatrix();
		renderer.setSize(sw, sh);
	});
	listen(["mousedown", "touchstart"], function(e) {
		e.preventDefault();
		isMouseDown = true;
	});
	listen(["mousemove", "touchmove"], function(e) {
		e.preventDefault();
		if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
		mouse.x = (e.clientX / sw) * 2 - 1;
		mouse.y = -(e.clientY / sh) * 2 + 1;
	});
	listen(["mouseup", "touchend"], function(e) {
		e.preventDefault();
		isMouseDown = false;
	});

	render(0);

}




function move(x, y, z) {
	// TweenMax.to(box.position, 0.5, {
	// 	y: yi * planeOffset
	// });
}


function render(time) {
	// con.log("render");

	if (Math.random() > 0.99) {
		newBackdrop();
	}
	for (var i = 0, il = backdrop.length; i < il; i++) {
		var obj = backdrop[i];
		obj.position.z -= obj.motion.speed;
		obj.rotation.x += obj.motion.rotation.x;
		obj.rotation.y += obj.motion.rotation.y;
		obj.rotation.z += obj.motion.rotation.z;
	};

	camPos.x -= (camPos.x - mouse.x * 1200) * 0.05;
	camPos.y -= (camPos.y - mouse.y * 150) * 0.05;
	camPos.z = -1000;
	camera.position.set(camPos.x, camPos.y, camPos.z);

	camera.lookAt( scene.position );

	// // camera.rotation.z = time * 0.0001;
	// camera.rotation.y = camPos.x / -1000;
	// camera.rotation.x = camPos.y / 1000;
	// // camera.rotation.z = camPos.x / -2000;
	// camera.rotation.z = (camPos.x - mouse.x * 400) / 2000;

	renderer.render( scene, camera );

	// con.log(camPos);



	requestAnimationFrame( render );
}

// init();

// listening to shakta now... thanks seb!