var con = console;

var bmp = require("./bitmap_parser.js")();
bmp.loadImage(() => {
	init();
	con.log("init done");
});


var isMouseDown = false;

var camera, scene, renderer;
var mouse = {x: 0, y: 0};
var camPos = {x: 0, y: 0, z: 10};

var sw = window.innerWidth, sh = window.innerHeight;

var cols = 128;
var rows = 126;
var gap = 0;
var size = {
	width: 10,
	height: 10,
	depth: 1,
}
// var allRowsDepth = rows * (size.depth + gap);
// var allColsWidth = cols * (size.depth + gap);

function num(min, max) { return Math.random() * (max - min) + min; }

function draw(props) {

	// var material = new THREE.MeshPhongMaterial( {
	// 	color: props.colour,
	// 	specular: props.colour,
	// 	shininess: 1,
	// 	shading: THREE.SmoothShading
	// });

	var material = new THREE.MeshBasicMaterial({
		color: props.colour
	})

	var geometry = new THREE.BoxGeometry(props.width, props.height, props.depth);
	var object = new THREE.Mesh(geometry, material);
	return object;
}

function init() {

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xffffff, 0.001);

	camera = new THREE.PerspectiveCamera( 100, sw / sh, 1, 10000 );
	scene.add( camera );

	var lightAbove = new THREE.DirectionalLight(0xffff80, 1);
	lightAbove.position.set(-1, 1, 0.25).normalize();
	scene.add( lightAbove );

	var lightAbove2 = new THREE.DirectionalLight(0xff80ff, 1);
	lightAbove2.position.set(1, 1, 0.25).normalize();
	scene.add( lightAbove2 );

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( sw, sh );
	renderer.setClearColor( scene.fog.color );


	var pixels = bmp.getPixels(num(0, 50));
	var blocks = [];
	function createBox(index) {
		var pixel = pixels[index];
		if (pixel === null) return;

		var xi = index % cols;
		var yi = Math.floor(index / cols);
		var x = (-xi + cols / 2) * (size.width + gap);
		var y = (-yi + rows / 2) * (size.height + gap);
		var z = -2000;

		var box = draw({
			colour: (pixel << 16 | pixel << 8 | pixel),
			depth: size.depth,
			height: size.height,
			width: size.width
		});

		blocks.push(box);

		var object = {
			x: x,
			y: y,
			z: z
		};

		box.position.set(object.x, object.y, object.z);

		TweenMax.to(object, num(0.5, 1.5), {
			// x: x,
			// y: y,
			z: 1200,
			delay: num(0.2, 1.5),
			onUpdate: () => {
				box.position.set(object.x, object.y, object.z);
			}
		});

		scene.add(box);

	}

	for (var i = 0, il = pixels.length; i < il; i++) {
		createBox(i);
	};

	document.body.appendChild(renderer.domElement);


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


	camPos.x -= (camPos.x - mouse.x * 400) * 0.02;
	camPos.y -= (camPos.y - mouse.y * 150) * 0.05;
	camPos.z = -100;
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