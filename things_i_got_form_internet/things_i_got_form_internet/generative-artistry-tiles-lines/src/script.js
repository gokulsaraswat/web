console.clear();

// some utility functions
const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

// at some point refactor this to use viz colours
// const colourPalette = 

//~~~~~~~~~~~~~~~~~~~~~~~~~SOUNDCLOUD STUFF
// Massive thanks to @jake_albaugh for letting me use his key. Also a lot of the soundcloud stuff is influenced by https://codepen.io/jakealbaugh/pen/MyJXoK?editors=0010 which you should check out!
const track_id = "472062501";
const client_id = "787c22af89922d1be9202d2f0cc90586";
const src_url = "https://api.soundcloud.com/tracks/" + track_id + "/stream?client_id=" + client_id;

const controls = document.querySelector('button');
let track = new Audio();

function initTrack(url, trackInstance) {
	let trackInst = trackInstance;
	trackInst.src = url;
	trackInst.crossOrigin = "anonymous";
	trackInst.play();
}

function playPause(playing, trackInstance) {
	let trackInst = trackInstance;
	if (playing) {
		trackInst.pause();
	} else {
		trackInst.play();
	}
}

controls.addEventListener("click", function() {
	this.classList.toggle('button--on');
	
	// autoplay policy check
	if (audCtx.state === 'suspended') {
		audCtx.resume();
	}

	// first click - initiate soundcloud call
	if (this.dataset.playing === 'null') {
		initTrack(src_url, track);
		this.dataset.playing = "true";
		// and set up audio graph
		connectGraph(audCtx, track, analyserNode);
	} else { // toggle play
		let play = this.dataset.playing === "true" ? true : false;
		this.dataset.playing = this.dataset.playing === "true" ? "false" : "true";
		playPause(play, track);
	}
	
}, false);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AUDIO STUFF
// set up audio context & analyser
const binSize = 128;
let bin = new Uint8Array(binSize);
const audCtx = new (window.AudioContext || window.webkitAudioContext);
const analyserNode = new AnalyserNode(audCtx, {
  fftSize: binSize*2,
  maxDecibels: -25,
  minDecibels: -60,
  smoothingTimeConstant: 0.5,
});

function connectGraph(ctx, trackInstance, node) {
	let trackInst = trackInstance,
			audioCtx = ctx,
			analyserNode = node;
	const source = audioCtx.createMediaElementSource(trackInst);
	source.connect(analyserNode).connect(audioCtx.destination);
}

function analyse(node) {
	let analyserNode = node;
	analyserNode.getByteFrequencyData(bin);
	// console.log(bin);
}

//~~~~~~~~~~~~~~~~~~~~CANVAS STUFF
// draw the stuff!
const canvas = document.querySelector('canvas'),
			width = window.innerWidth,
			height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const canCtx = canvas.getContext('2d');
canCtx.strokeStyle = 'white';
canCtx.lineWidth = 2;

// visual setup
const step = 24; // size
const beatThreshold = 45; // average gain for change
const debounceRate = 5; // lower = higher frame count
let debounce = 0;

function draw(ctx) {
	requestAnimationFrame(draw);
	analyse(analyserNode);
	let newBin = bin.slice(0, binSize/2);
	// console.log(newBin);
	
	// if the first half of the array averages over 200, change lines
	let binAvg = arrAvg(newBin);
	// console.log(binAvg);
	// HERE NEITHER CLEARRECT NOR DRAWING A NEW ONE WORKS?
	if ( (binAvg > beatThreshold) && (debounce === 0) ) {
		canCtx.clearRect(0,0,width,height);
		makeSteps();
		debounce = debounceRate;
	}
	
	debounce > 0 ? debounce-- : debounce = 0;
	// each line is an item in the array
	// if the value goes above 200 flash
}

function makeSteps() {
	for( let x = 0; x < width; x += step) {
		for( let y = 0; y < height; y += step ) {
			makeLine(canCtx, x, y, step, step);
		}
	}
}

function makeLine(ctx, x, y, width, height) {
	let leftToRight = Math.random() >= 0.5;

	ctx.beginPath();
	
  if( leftToRight ) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height);    
  } else {
    ctx.moveTo(x + width, y);
    ctx.lineTo(x, y + height);
  }

	ctx.closePath();
  ctx.stroke();
}

draw(canCtx);

