/*
  ★ Click anywhere to generate new 3D art ★
  
  What is creativity? 
  This is a tribute to messy ideas and my wandering mind.
  
  Typography designed by me in Blender, rest generated in three.js.
  
  ★ By Anna the Scavenger, March 2021 ★
  https://twitter.com/ouch_pixels
*/

import {
  
  WebGLRenderer, Scene, PerspectiveCamera, 
  Group, GammaEncoding, Mesh,
  MeshStandardMaterial, ShaderMaterial,
  DoubleSide, TextureLoader, DirectionalLight, HemisphereLight,
  SphereBufferGeometry, TorusBufferGeometry, PlaneBufferGeometry, TubeGeometry, ParametricGeometry, CatmullRomCurve3, BufferGeometry, CylinderGeometry,
  Vector2, Vector3, Color
 
} from "https://unpkg.com/three@0.127.0/build/three.module.js";

import { GLTFLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// ASSETS

let textureOldGoldURL = "https://assets.codepen.io/911157/matcapCop.jpg";
let modelURL = "https://assets.codepen.io/911157/creativityDoodle_by_Anna_the_Scavenger.glb";

// LANDSCAPE / PORTRAIT

let isMobile = /(Android|iPhone|iOS|iPod|iPad)/i.test(navigator.userAgent);
let windowRatio = window.innerWidth / window.innerHeight;
let isLandscape = (windowRatio > 1) ? true : false;

// MOUSE 

let mouse = new Vector2(0, 0); // -1 to 1 - interactivity
let mouseX = 0; // 0 to 1 - animation timeline 
let mouseY = 0; // 0 to 1 - animation timeline 

let lettersParams = {

  scale: 3.75,
  position: new Vector3(0, -10, 0),
  dotOffset: new Vector3(13, 24, 0),
  dotScale: 1,
  dot2Offset: new Vector3(41.5, 26.5, 0),
  dot2Scale: 1,

}

let doodleParams = {

  curve: new CatmullRomCurve3(),
  scale: 3.5,
  position: new Vector3(-36, -39, -10),
  tubeThickness: 0.25,
  tubeTubularSegments: 500,
  ballScale: 1

}

Sketch();

function Sketch() {
  
  let scene, camera, renderer;
  
  let container = document.body.querySelector("#scene-container");
  let airbrush1 = document.body.querySelector("#airbrush-1");
  let airbrush2 = document.body.querySelector("#airbrush-2");
  let airbrush3 = document.body.querySelector("#airbrush-3");
  
  // MATERIALS + COLOR PALETTE
  
  let materials = initMaterials();
  let currentPalette = getPalette();
  
  // MESHES
  
  let letters, dot, dot2;
  let ball;
  let sprinklesEndGroup = new Group();
  
  // ANIMATION TIMELINES
  
  let lettersTL;
  let sprinklesTL;
  
  creditsAnimation();
  updateSVGPalette();
  init();
  render();
  
  function init() {
    
    scene = new Scene();
    
    initRenderer();
    initCamera();
    initLights();
    
    loadModel();
    
    initSprinkles();
    initSprinklesTimeline();
    
    container.addEventListener("click", onButtonClick);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, false);
    window.addEventListener("resize", onWindowResize);
    
  }
  
  function creditsAnimation() {
    
    const credits = document.querySelector("#credits");
    credits.style.animation = "fadeIn 6s ease-in forwards";
    
  }
  
  function initCamera() {
    
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 150);
    camera.lookAt(0, 0, 0);
    camera.position.z = (windowRatio > 2) ? ((200 / windowRatio) + 80) : (250 / windowRatio);
    scene.add(camera);
        
  }
  
  function initLights() {
    
    const hemLight = new HemisphereLight(0xddeeff, 0x202020, 3);
    hemLight.position.set(0, 50, -150);
    scene.add(hemLight);
    
    const hemLight2 = new HemisphereLight(0xddeeff, 0x202020, 2);
    hemLight2.position.set(0, 50, 250);
    scene.add(hemLight2);

    const dirLight = new DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(-50, 50, 200);
    scene.add(dirLight);
    
    const dirLight2 = new DirectionalLight(0xffffff, 1.25);
    dirLight2.position.set(50, 0, 20);
    dirLight2.target.position.set(0, 100, 50);
    scene.add(dirLight2);

    const dirLight3 = new DirectionalLight(0xb200ff, 5);
    dirLight3.position.set(50, 10, 10);
    dirLight3.target.position.set(50, 150, -50);
    scene.add(dirLight3);
    
  }
  
  function initRenderer() {
    
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
	  renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = GammaEncoding;
    renderer.gammaFactor = 2.2;
    renderer.setPixelRatio(window.devicePixelRatio > 1.5 ? Math.min(window.devicePixelRatio, 1.4) : Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(renderer.domElement);
    
  }
  
  function initMaterials() {
    
    const green = new MeshStandardMaterial({
      color: 0x38b7b7,
      metalness: 0.5,
      roughness: 0.5
    });
    green.color.convertSRGBToLinear();
    
    const apricot2 = new MeshStandardMaterial({
      color: 0xfc997e,
      metalness: 0.1,
      roughness: 0
    });
    apricot2.color.convertSRGBToLinear();
    
    const greenClassic = new MeshStandardMaterial({
      color: 0x02664b, 
		  roughness: 0.0,
			metalness: 0.2,
			flatShading: false
	  });
    greenClassic.color.convertSRGBToLinear();
    
    const seagreen = new MeshStandardMaterial({
      color: 0x1bbaac,
      metalness: 0.3,
      roughness: 0.1
    });
    seagreen.color.convertSRGBToLinear();
    
    const black = new MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.5,
      roughness: 0
    });
    
    const white = new MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.4,
      roughness: 0.0,
      flatShading: false
    });
    white.color.convertSRGBToLinear();
    
    const purple = new MeshStandardMaterial({
      color: 0xce93ff,
      metalness: 0.3,
      roughness: 0.0
    });
    purple.color.convertSRGBToLinear();
    
    const blue = new MeshStandardMaterial({
      color: 0x7589c6,
      metalness: 0.35,
      roughness: 0.0
    });
    blue.color.convertSRGBToLinear();
        
    const brick = new MeshStandardMaterial({
      color: 0xbf3e24,
		  roughness: 0.1,
			metalness: 0.4,
      flatShading: false
	  });
    brick.color.convertSRGBToLinear();

    const lemon = new MeshStandardMaterial({
      color: 0xf7b23b,
		  roughness: 0.1,
			metalness: 0.3,
      flatShading: false
	  });
    lemon.color.convertSRGBToLinear();

    const textureOldGold = new TextureLoader().load(textureOldGoldURL);
    
    const gold = new ShaderMaterial({
      
      transparent: false,
      side: DoubleSide,
      uniforms: {
        tMatCap: {
          type: "t",
          value: textureOldGold
        }
      },
      vertexShader: document.querySelector("#vs-matcap").textContent,
      fragmentShader: document.querySelector("#fs-matcap").textContent  
      
    });
    
    return {
      
      white, black, lemon, brick, apricot2,
      blue, purple, green, seagreen, greenClassic,
      gold
      
    }
    
  }
  
  function getPalette() {
    
    let palettePastel = [materials.purple, materials.seagreen, materials.white, materials.black];
    let paletteFlamingo = [materials.purple, materials.apricot2, materials.white, materials.black, materials.seagreen];
    let paletteWarm = [materials.lemon, materials.brick, materials.blue, materials.green, materials.black, materials.gold];
    let paletteWarm2 = [materials.lemon, materials.brick, materials.blue, materials.green, materials.black, materials.gold, materials.white];
    let paletteWarm3 = [materials.lemon, materials.brick, materials.black, materials.greenClassic, materials.blue, materials.white];
    let paletteElegant = [materials.blue, materials.black, materials.gold, materials.lemon, materials.green, materials.black, materials.blue];
        
    let colorPalettes = [
      
      {
        materials: palettePastel,
        background: ["rgb(193, 181, 194)", "rgb(210, 175, 213)", "rgb(245, 224, 245)"],
        svg: ["rgb(87, 221, 202)", "rgb(154, 87, 221)"]
      },
      {
        materials: paletteFlamingo,
        background: ["rgb(43, 42, 42)", "rgb(255, 213, 213)"],
        svg: ["rgb(94, 208, 198)", "rgb(196, 113, 242)"]
      },
      {
        materials: paletteWarm,
        background: ["rgb(234, 215, 211)", "rgb(241, 212, 176)"],
        svg: ["rgb(232, 27, 17)", "rgb(117, 151, 232)"]
        
      },
      {
        materials: paletteWarm2,
        background: ["rgb(162, 169, 172)"],
        svg: ["rgb(99, 117, 255)", "rgb(255, 87, 59)"]
      },
      {
        materials: paletteWarm3,
        background: ["rgb(193, 178, 175)", "rgb(220, 207, 205)", "rgb(235, 188, 161)"],
        svg: ["rgb(68, 128, 86)", "rgb(67, 122, 227)"]
      },
      {
        materials: paletteElegant,
        background: ["#EAD7D3", "rgb(171, 178, 205)", "rgb(181, 182, 194)"],
        svg: ["rgb(255, 199, 112)", "#745bef"]
      }
      
    ];
    
    let chosenPalette = getRandomFromArr(colorPalettes);
        
    return chosenPalette;
    
  }
  
  function loadModel() {
   
    let loader = new GLTFLoader();

    loader.load(

      modelURL, function (gltf) {

        gltf.scene.traverse(function(child) {

          if (child instanceof Mesh) {
            
            child.geometry.computeVertexNormals();
            child.material = getRandomFromArr(currentPalette.materials);

          }

        });

        letters = gltf.scene;
        letters.position.copy(lettersParams.position);
        let scale = lettersParams.scale;
        letters.scale.set(scale, scale, scale);
        scene.add(letters);
        
        // DOTS FOR I'S
        
        let sphereGeom = new SphereBufferGeometry(4.25, 16, 16);
        let randomMat = getRandomFromArr(currentPalette.materials);
        let randomMat2 = getRandomFromArr(currentPalette.materials);
    
        dot = new Mesh(sphereGeom, randomMat);
        dot.position.x = lettersParams.position.x + lettersParams.dotOffset.x;
        dot.position.y = lettersParams.position.y + lettersParams.dotOffset.y;
        let dotScale = lettersParams.dotScale;
        dot.scale.set(dotScale, dotScale, dotScale);
        scene.add(dot);
    
        dot2 = dot.clone();
        dot2.material = randomMat2;
        dot2.position.x = lettersParams.position.x + lettersParams.dot2Offset.x;
        dot2.position.y = lettersParams.position.y + lettersParams.dot2Offset.y;
        let dot2Scale = lettersParams.dot2Scale;
        dot2.scale.set(dot2Scale, dot2Scale, dot2Scale);
        scene.add(dot2);
        
        initTube();
        
        initLettersTimeline();
       
      },

      function (xhr) {
        
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        
      },

      function (error) {
        
        console.log("GLTF loading error");
        
      }

    );
  }
  
  function initSprinkles() {
    
    const sphereGeom = new SphereBufferGeometry(0.5, 5, 5);
    const cylinderGeom = new CylinderGeometry(0.5, 0.5, 3.5, 10);
    
    let geoms = [sphereGeom, cylinderGeom];
    
    const randomMat = getRandomFromArr(currentPalette.materials);
    
    let radius = 14;
        
    for (let i = 0; i < 35; i++) {
      
      let c = new Mesh(getRandomFromArr(geoms), getRandomFromArr(currentPalette.materials));
      
      let u = Math.random();
      let v = Math.random();
      let theta = 2 * Math.PI * u;
      let phi = Math.acos(2 * v - 1);
      let x =  (radius * Math.sin(phi) * Math.cos(theta)) + getRandomInRange(0, 20);
      let y =  (radius * Math.sin(phi) * Math.sin(theta));
      let z =  (radius * Math.cos(phi));
      c.position.set(x, y, z);
      c.rotation.z = getRandomInRange(0, 2 * Math.PI);
      c.scale.set(0, 0, 0);
      sprinklesEndGroup.add(c);
      
    }
    
    sprinklesEndGroup.position.set(42, -37.5, -45);
    scene.add(sprinklesEndGroup);
    
  }
  
  function initTube() {
    
    // POINTS TUBE
    
    let points = getExportedPoints().curvePoints;
    
    const doodleMesh = closedCapsTube(points, doodleParams.tubeThickness, 20);
    const scale = doodleParams.scale;
    doodleMesh.scale.set(scale, scale, scale);
    doodleMesh.position.copy(doodleParams.position);
    scene.add(doodleMesh);
    
    let randomMat = getRandomFromArr(currentPalette.materials);
    
    ball = new Mesh(new SphereBufferGeometry(3.25, 12, 12), randomMat);
    ball.scale.set(doodleParams.ballScale, doodleParams.ballScale, doodleParams.ballScale);
    let pos = doodleParams.curve.getPointAt(1.0 - Math.abs(mouseX));
    pos.multiplyScalar(doodleParams.scale);
    ball.position.x = doodleParams.position.x + pos.x + 0.25;
    ball.position.y = doodleParams.position.y + pos.y + 0.25;
    ball.position.z = doodleParams.position.z + pos.z + 0.25;
    scene.add(ball);
    
  }
  
  function closedCapsTube(pts, thickness, segments) {  
  
    const closedTubeGroup = new Group();
    let tubeMat = getRandomFromArr(currentPalette.materials);
  
    // CURVE SHAPING THE SCULPTURE

    let points = pts;
    let pScale = 1.5;

    for (let i = 0; i < points.length; i++) {

      let x = points[i][0] * pScale;
      let y = points[i][1] * pScale;
      let z = points[i][2] * pScale;
      points[i] = new Vector3(x, z, -y);

    }
   
    let curve = new CatmullRomCurve3(points);
    let p = curve.getPoints(100);
    let curveSmooth = new CatmullRomCurve3(p);
    doodleParams.curve = curveSmooth;  
    let geom = new TubeGeometry(curveSmooth, doodleParams.tubeTubularSegments, thickness, 6, false);
    let tube = new Mesh(geom, tubeMat);
    closedTubeGroup.add(tube);
  
    // TUBE START POINTS
  
    let pos = geom.attributes.position;
    let startPoints = [];
    startPoints.push(curve.getPoint(0));
  
    for (let i = 0; i <= geom.parameters.radialSegments; i++) {

      startPoints.push(new Vector3().fromBufferAttribute(pos, i));

    }

    let pointsStartGeom = new BufferGeometry().setFromPoints(startPoints);
    let psgPos = pointsStartGeom.attributes.position;
    let indexStart = [];
  
    for (let i = 1; i < psgPos.count - 1; i++) {

      indexStart.push(0, i, i + 1);

    }
    pointsStartGeom.setIndex(indexStart);
    pointsStartGeom.computeVertexNormals();
  
    // CAP MESH START
  
    let capStart = new Mesh(pointsStartGeom, tubeMat);
    closedTubeGroup.add(capStart);
  
    // TUBE END POINTS

    let endPoints = [];
    endPoints.push(curve.getPoint(1));

    for (let i = (geom.parameters.radialSegments + 1) * geom.parameters.tubularSegments; i < pos.count; i++) {

      endPoints.push(new Vector3().fromBufferAttribute(pos, i));

    }

    let pointsEndGeom = new BufferGeometry().setFromPoints(endPoints);
    let pegPos = pointsEndGeom.attributes.position;
    let indexEnd = [];

    for (let i = 1; i < pegPos.count - 1; i++) {

      indexEnd.push(0, i + 1, i);

    }
    
    pointsEndGeom.setIndex(indexEnd);
    pointsEndGeom.computeVertexNormals();
  
    // CAP MESH END

    let capEnd = new Mesh(pointsEndGeom, tubeMat);
    closedTubeGroup.add(capEnd);
    
    return closedTubeGroup;
  
  }
  
  function render() {
    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    
    moveBallAlongCurve();
    
    sprinklesTL.progress(Math.abs(1.0 - mouseX));
    
    if ( letters ) {
      
      letters.rotation.x = -0.05 * Math.PI * (mouse.x);
      letters.rotation.y = -0.025 * Math.PI * (mouse.y);
      
    } else {
      
      return;
      
    }
    
  }
  
  // *** EVENT LISTENERS ***
  
  function onWindowResize() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
        
  }
  
  function onMouseMove() {
    
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseX = convertRange(mouse.x, [-1, 1], [0, 1]);
        
  }
  
  function onTouchMove(e) {
    
	  let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = (y / window.innerWidth) * 2 - 1;
    mouseX = convertRange(mouse.x, [-1, 1], [0, 1]);
      
  }
  
  function onButtonClick() {
    
    currentPalette = getPalette();
    
    document.body.style.background = getRandomFromArr(currentPalette.background);
    updateMaterialsPalette();
    updateSVGPalette();
     
  }
  
  function updateMaterialsPalette() {
        
    if (letters) {
      
      scene.traverse(function(child) {

        if (child instanceof Mesh) {
            
          child.material = getRandomFromArr(currentPalette.materials);
            
        }

      });
      
      let randomMat = getRandomFromArr(currentPalette.materials);
      
      lettersTL.play(0);
      
    } else {
      
      return;
      
    }
    
  }
  
  function updateSVGPalette() {
    
    airbrush1.style.fill = currentPalette.svg[0];
    airbrush2.style.fill = currentPalette.svg[1];
    airbrush3.style.fill = currentPalette.svg[1];
    
  }
  
  // *** ANIMATION ***
  
  function moveBallAlongCurve() {
    
    if (ball) {
      
      let pos = doodleParams.curve.getPointAt(1.0 - Math.abs(mouseX));
      pos.multiplyScalar(doodleParams.scale);
      ball.position.x = doodleParams.position.x + pos.x + 0.25;
      ball.position.y = doodleParams.position.y + pos.y + 0.25;
      ball.position.z = doodleParams.position.z + pos.z + 0.25;
      
    } else {
      
      return;
    
    }
  
  }
  
  function initLettersTimeline() {
  
    lettersTL = gsap.timeline({paused: true, yoyo: false, defaults: {ease: "elastic"}});
  
    lettersTL
      .add("typo")
      .to({}, {x: 4, duration: 2, ease: "elastic"}, "typo")
      .to(letters.scale, {x: 4, duration: 1.4}, "typo")
      .to(letters.scale, {y: 4, duration: 1.4}, "typo")
      .to(letters.scale, {z: 4, duration: 1.4}, "typo")
    
      .to(dot.position, {y: 16, duration: 1.0}, "typo+=0.2")
      .to(dot.scale, {x: 1.05, duration: 0.85}, "typo+=0.35")
      .to(dot.scale, {y: 1.05, duration: 0.85}, "typo+=0.35")
      .to(dot.scale, {z: 1.05, duration: 0.85}, "typo+=0.35")

      .to(dot2.position, {y: 19.25, duration: 1.0}, "typo+=0.4")
      .to(dot2.position, {x: 42, duration: 0.9, ease: "linear"}, "typo+=0.4")
      .to(dot2.scale, {x: 1.05, duration: 0.85}, "typo+=0.35")
      .to(dot2.scale, {y: 1.05, duration: 0.85}, "typo+=0.35")
      .to(dot2.scale, {z: 1.05, duration: 0.85}, "typo+=0.35")

    ;
    
  }
  
  function initSprinklesTimeline() {
    
    sprinklesTL = gsap.timeline({paused: true, yoyo: false, defaults: {ease: "power2.easeOut"}});
    let endScales = sprinklesEndGroup.children.map(a => a.scale);
    
    sprinklesTL
      .to({}, {x: 0, duration: 5, ease: "elastic" })
      .add("doodleEnd")
      .to(endScales, {x: 1, stagger: {amount: 2.5}}, "doodleEnd")
      .to(endScales, {y: 1, stagger: {amount: 2.5}}, "doodleEnd")
      .to(endScales, {z: 1, stagger: {amount: 2.5}}, "doodleEnd")
    ;
    
  }
  
}

// *** UTILS ***

function getRandomInRange(min, max) {
  
  return Math.random() * (max - min) + min; 

}

function getRandomFromArr(array) {
  
  let randomElement = array[Math.floor(Math.random() * array.length)];
  
  return randomElement;
  
}

function convertRange(value, r1, r2) { 
  
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
  
}


