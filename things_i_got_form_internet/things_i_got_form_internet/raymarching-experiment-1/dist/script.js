console.clear();

// This is a Shadertoy-like environment I created with Regl.
// The core fragment shader code is declared in the HTML tab, while all the boilerplate is here.
// Some differences from Shadertoy:
// - iMouse values range from 0.0 to 1.0, with (0, 0) being the top-left of canvas.

// On high-dpi screens, render halfway between a dpr of 1.0 and the full high-res dpr.
const pixelRatio = window.devicePixelRatio > 1 ? ((window.devicePixelRatio - 1) / 2 + 1) : 1;

const regl = createREGL({ pixelRatio });

const config = {
	// Number of reflection ray bounces. 0 = no reflections. Max = 2.
	// More bounces may cause lag.
	refl_bounces: 1,
	// How much the glancing angle of reflection rays influences reflection strength.
	// 1.0 = realistic reflection falloff; 0.0 = perfect mirror surfaces
	fresnel_factor: 1.0,
	// Outer sphere radius = 1.0; the following values are relative to that.
	radius_inner: 0.44,
	radius_star: 0.55, // distance from origin to end of capsules that form star
	radius_star2: 0.26, // radius of the capsules themselves
	radius_gem: 0.32,
	// Gem material is applied slightly beyond gem radius, to ensure gem tips are covered.
	// This also allow spreading the gem material out further, which is fun. Try setting to 0.4 :)
	radius_gem_mat: 0.33,
	spin_gem: 2.0, // radians/s
	spin_camera: 0.25 // radians/s
};

const gui = new dat.GUI();
gui.close();
gui.add(config, 'refl_bounces', 0, 2, 1);
gui.add(config, 'fresnel_factor', 0, 1, 0.01);
gui.add(config, 'radius_inner', 0, 1, 0.01);
gui.add(config, 'radius_star', 0, 1, 0.01);
gui.add(config, 'radius_star2', 0, 1, 0.01);
gui.add(config, 'radius_gem', 0, 1, 0.01);
gui.add(config, 'radius_gem_mat', 0, 1.1, 0.01);
gui.add(config, 'spin_gem', 0, 4, 0.01);
gui.add(config, 'spin_camera', 0, 1, 0.01);

// Read fragment shader text from HTML tab, and make substitution for reflection bounces
function readFragmentShader(refl_bounces) {
	let shader = document.getElementById('frag-shader').textContent;
	shader = shader.replace(/#define REFLECT_BOUNCES \d/, `#define REFLECT_BOUNCES ${refl_bounces}`);
	return shader;
}

// Compile a separate set of shaders lazily for each bounce level.
// This is done so that the shaders can be optimized as much as possible for each bounce level.
// Once compiled, the result is cached and this can be cheaply called each frame.
const programMap = new Map();
function getDrawProgram(refl_bounces) {
	if (programMap.has(refl_bounces)) {
		return programMap.get(refl_bounces);
	}
	const draw = regl({
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

			// config input
			uniform float iFresnelFactor;
			uniform float iRadiusInner;
			uniform float iRadiusStar;
			uniform float iRadiusStar2;
			uniform float iRadiusGem;
			uniform float iRadiusGemMat;
			uniform float iSpinGem;
			uniform float iSpinCamera;

			${readFragmentShader(refl_bounces)}

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
			iColorRamp: regl.prop('iColorRamp'),
			// config input
			iFresnelFactor: regl.prop('fresnel_factor'),
			iRadiusInner: regl.prop('radius_inner'),
			iRadiusStar: regl.prop('radius_star'),
			iRadiusStar2: regl.prop('radius_star2'),
			iRadiusGem: regl.prop('radius_gem'),
			iRadiusGemMat: regl.prop('radius_gem_mat'),
			iSpinGem: regl.prop('spin_gem'),
			iSpinCamera: regl.prop('spin_camera')
		},
		count: 6
	});
	programMap.set(refl_bounces, draw);
	return draw;
}


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

let pointerDown = false;
let pointerX = 0;
let pointerY = 0;
function setPointerPositionFromEvent(event) {
	pointerX = event.pageX / window.innerWidth;
	pointerY = event.pageY / window.innerHeight;
}
document.querySelector('canvas').addEventListener('pointerdown', event => {
	pointerDown = true;
	setPointerPositionFromEvent(event);
});
document.querySelector('canvas').addEventListener('pointermove', event => {
	if (pointerDown) {
		setPointerPositionFromEvent(event);
	}
});
['pointerup', 'pointercancel'].forEach(eventName => {
	document.querySelector('canvas').addEventListener(eventName, event => {
		pointerDown = false;
	});
});

regl.frame((context) => {
	if (play) {
		regl.clear(clearState);
		const draw = getDrawProgram(config.refl_bounces);
		draw({
			// Use vec4 for iMouse, so we can add button down states later if desirable
			// (without breaking old code)
			iMouse: [pointerX, pointerY, 0.0, 0.0],
			iColorRamp: colorRampTexture,
			...config
		});
	}
});