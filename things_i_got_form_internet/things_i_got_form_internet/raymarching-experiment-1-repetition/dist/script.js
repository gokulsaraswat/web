console.clear();

// This is a Shadertoy-like environment I created with Regl.
// The core fragment shader code is declared in the HTML tab, while all the boilerplate is here.
// Some differences from Shadertoy:
// - iMouse values range from 0.0 to 1.0, with (0, 0) being the top-left of canvas.

// On high-dpi screens, render halfway between a dpr of 1.0 and the full high-res dpr.
const pixelRatio = window.devicePixelRatio > 1 ? ((window.devicePixelRatio - 1) / 2 + 1) : 1;

const regl = createREGL({ pixelRatio });

// Read fragment shader text from HTML tab, and make substitutions from URL params.
function readFragmentShader() {
	let shader = document.getElementById('frag-shader').textContent;
	const params = new URLSearchParams(location.search);
	// reflection bounces replacement is special since it's a #define value
	const REFLECT_BOUNCES = params.get('REFLECT_BOUNCES');
	if (REFLECT_BOUNCES) {
		shader = shader.replace(/#define REFLECT_BOUNCES \d/, `#define REFLECT_BOUNCES ${REFLECT_BOUNCES}`);
	}
	// replace constants
	[
		'CAMERA_SPIN',
		'INNER_SPHERE_RADIUS',
		'STAR_RADIUS',
		'STAR_RADIUS_2',
		'GEM_RADIUS',
		'GEM_MAT_RADIUS',
		'GEM_SPIN',
		'FRESNEL_FACTOR'
	].forEach(name => {
		const paramValue = params.get(name);
		if (paramValue) {
			shader = shader.replace(new RegExp(`${name} = .+?;`), `${name} = ${paramValue};`);
		}
	});
	
	return shader;
}

const drawColors = regl({
	depth: { enable: false },
	blend: {
		enable: true,
		func: {
			src: 'src alpha',
			dst: 'one'
		}
	},
	vert: `
		precision highp float;

		attribute vec2 a_position;

		void main() {
			gl_Position = vec4(a_position, 0, 1);
		}
	`,
	frag: `
		precision highp float;

		uniform float iTime;
		uniform vec3 iResolution;
		uniform vec4 iMouse;
		uniform sampler2D iColorRamp;

		${readFragmentShader()}
		
		void main() {
			mainImage(gl_FragColor, gl_FragCoord.xy);
		}
	`,
	attributes: {
		// two triangles that cover screen
		a_position: regl.buffer([
			// tri 1
			[-1, 1],
			[1, 1],
			[-1, -1],
			// tri 2
			[1, -1],
			[-1, -1],
			[1, 1]
		])
	},
	uniforms: {
		iTime: regl.context('time'),
		iResolution: (context) => [context.framebufferWidth, context.framebufferHeight, 1],
		iMouse: regl.prop('iMouse'),
		iColorRamp: regl.prop('iColorRamp')
	},
	count: 6
});


// Create color ramp texture

const gradient = (function GradientSamplerFactory() {
	// Based on: https://codepen.io/MillerTime/pen/NXxxma
	// The instance to be returned.
	const sampler = {};

	const colors = [
	{ "r": 255, "g": 32,  "b": 64  },
	{ "r": 242, "g": 121, "b": 2   },
	{ "r": 242, "g": 164, "b": 0   },
	{ "r": 200, "g": 212, "b": 0   },
	{ "r": 44,  "g": 228, "b": 46  },
	{ "r": 0,   "g": 180, "b": 141 },
	{ "r": 24,  "g": 100,  "b": 255 },
	{ "r": 255,  "g": 255,  "b": 255 }
];

	const colorCount = colors.length;
	const colorSpans = colorCount - 1;
	const spanSize = 1 / colorSpans;

	// Helper to interpolate between two numbers
	function interpolate(a, b, p) {
		return (b - a) * p + a;
	};

	sampler.sample = function sample(position) {
		// Normalize position to 0..1 scale (inclusive of 0, exlusive of 1).
		position -= position | 0;
		if (position < 0) position = 1 - position * -1;

		const startIndex = position * colorSpans | 0;
		const startColor = colors[startIndex];
		const endColor = colors[startIndex + 1];
		// Compute relative position between two chosen color stops.
		const innerPosition = (position - (startIndex / colorSpans)) / spanSize;

		const r = interpolate(startColor.r, endColor.r, innerPosition) | 0;
		const g = interpolate(startColor.g, endColor.g, innerPosition) | 0;
		const b = interpolate(startColor.b, endColor.b, innerPosition) | 0;

		return { r, g, b };
	};

	return sampler;
})();

const texSize = 64; // Number of pixels in color ramp, also used in shader
const channels = 3;
const texData = new Uint8Array(texSize * channels);
for (let i=0; i<texSize; i++) {
	const offset = i * channels;
	const color = gradient.sample(i / (texSize - 1));
	texData[offset] = color.r;
	texData[offset+1] = color.g;
	texData[offset+2] = color.b;
}

const colorRampTexture = regl.texture({
	width: texSize,
	height: 1,
	format: 'rgb',
	data: texData,
	mag: 'linear',
	min: 'linear',
	wrapS: 'clamp',
	wrapT: 'clamp'
});


const clearState = {
	color: [0, 0, 0, 1]
};

let play = true;
// window.onclick = () => play = !play;

let mouseX = 0;
let mouseY = 0;
['pointerdown', 'pointermove'].forEach(eventName => {
	document.querySelector('canvas').addEventListener(eventName, event => {
		mouseX = event.pageX / window.innerWidth;
		mouseY = event.pageY / window.innerHeight;
	});
});

regl.frame((context) => {
	if (play) {
		regl.clear(clearState);
		drawColors({
			// Use vec4 for iMouse, so we can add button down states later if desirable
			// (without breaking old code)
			iMouse: [mouseX, mouseY, 0.0, 0.0],
			iColorRamp: colorRampTexture
		});
	}
});