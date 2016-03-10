var con = console;

var bmp = require("./bitmap_parser.js")();
bmp.loadImage(() => {
	bmp.getPixels();
	init();
	con.log("init done");
});


var isMouseDown = false;

var camera, scene, renderer;
var mouse = {x: 0, y: 0};
var camPos = {x: 0, y: 0, z: 10};

var sw = window.innerWidth, sh = window.innerHeight;

var cols = 10;
var rows = 10;
var gap = 20;
var size = {
	width: 20,
	height: 20,
	depth: 20,
}
var allRowsDepth = rows * (size.depth + gap);
var allColsWidth = cols * (size.depth + gap);

function num(min, max) { return Math.random() * (max - min) + min; }

function draw(props) {

	var material = new THREE.MeshPhongMaterial( {
		// ambient: 0x030303,
		//color: colours[~~(Math.random() * colours.length)],
		//color: ~~(Math.random() * 0xffffff),
		color: 0x4444ff,
		specular: 0xffffff,
		shininess: 2, //~~(Math.random() * 200),
		shading: THREE.SmoothShading
	});

	// var material = new THREE.MeshBasicMaterial({
	// 	color: 0xff00ff
	// })

	var geometry = new THREE.BoxGeometry(props.width, props.height, props.depth);
	var object = new THREE.Mesh(geometry, material);
	return object;
}

function init() {

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x400000, 0.001);

	camera = new THREE.PerspectiveCamera( 100, sw / sh, 1, 10000 );
	scene.add( camera );

	// lights don't work either - out of the box anyway, not sure how to feed into shader
	var lightAbove = new THREE.DirectionalLight(0xff8080, 2);
	lightAbove.position.set(0, 1, 0.25).normalize();
	scene.add( lightAbove );

	var lightAbove2 = new THREE.DirectionalLight(0xff8080, 2);
	lightAbove2.position.set(1, 1, 0.25).normalize();
	scene.add( lightAbove2 );

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( sw, sh );
	renderer.setClearColor( scene.fog.color );

	function createBox() {
		var xi = Math.floor(Math.random() * cols);
		var yi = 0;
		var zi = Math.floor(Math.random() * rows);

		var x = (xi - cols / 2) * (size.width + gap);
		var y = yi;
		var z = zi * (size.depth + gap);

		var box = draw(size);
		box.position.x = x;
		box.position.y = y;
		box.position.z = z;

		// boxes[yai][zai][xai] = box;
		// boxes1d.push(box);

		// con.log(box);

		scene.add(box);
	}


	for (var i = 0, il = rows * cols; i < il; i++) {
		createBox();
	};

	document.body.appendChild(renderer.domElement);

/*
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
*/
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