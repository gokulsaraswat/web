const { sqrt, pow } = Math;
const animation = {
  rotation: 0,
  display: 0,
  isRotate: true
};
const tilt = 0;
let i = 0;
let { innerHeight: height, innerWidth: width } = window;
let currentCountry = 0;
let currentCountryName = "";
let p1, r1, ip, iv, minZoom;
const canvas = document.getElementById("c");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
const data = mapData.features;

const shuffle = (a) => {
  const temp = a.slice(0);
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
};

const map = (value, sMin, sMax, dMin, dMax) => {
  return dMin + ((value - sMin) / (sMax - sMin)) * (dMax - dMin);
};

const countriesShuffled = shuffle(countries);
console.log(countriesShuffled.length * 5);

const projection = d3
  .geoOrthographic()
  .scale(sqrt(width) * 15, sqrt(width) * 15)
  .translate([width / 2, height / 2]);

const pathGenerator = d3.geoPath(projection, ctx);

const createMarker = ([long, lat], r) => {
  const [x, y] = projection([long, lat]);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(97, 177, 90,${r / 10})`;
  ctx.fill();
};

const animate = (arc, t, isDisplay) => {
  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  pathGenerator({ type: "Sphere" });
  ctx.strokeStyle = "yellow";
  ctx.fillStyle = "#b5d0d0";
  ctx.fill();

  let matchedCountry = null;

  data.forEach((item, index) => {
    if (item.properties.name === currentCountryName) {
      matchedCountry = item;
    }
    ctx.beginPath();
    pathGenerator(item);
    ctx.fillStyle = `#f2efe9`;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#d09ccb";
    ctx.stroke();
  });

  if (matchedCountry && isDisplay) {
    ctx.beginPath();
    pathGenerator(matchedCountry);
    ctx.fillStyle = `rgba(190, 219, 187, ${t})`;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#da9ff9";
    ctx.stroke();
  }

  if (arc) {
    ctx.beginPath();
    pathGenerator({ type: "LineString", coordinates: arc });
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#61b15a66";
    ctx.stroke();
  }
};

const getRotation = (p) => [-p[0], tilt - p[1], 0];

let p2 = countriesShuffled[0][1];
let r2 = getRotation(p2);

const getDist = (p1, p2) => {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const dist = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
  return dist;
};

const updateCountry = () => {
  currentCountry = (currentCountry + 1) % countriesShuffled.length;
  const country = countriesShuffled[currentCountry];

  p1 = p2;
  r1 = r2;

  p2 = country[1];
  currentCountryName = country[0];
  document.getElementById("info").innerHTML = currentCountryName;
  r2 = getRotation(p2);

  ip = d3.geoInterpolate(p1, p2);
  iv = Versor.interpolateAngles(r1, r2);
  minZoom = map(getDist(p1, p2), 0, 200, sqrt(width) * 30, sqrt(width) * 15);
};

updateCountry();

const tl = gsap.timeline({
  repeat: -1,
  onRepeat: () => {
    updateCountry();
  }
});

tl.to(animation, {
  duration: 2,
  rotation: 1,
  isRotate: false,
  ease: "sine.inOut"
});
tl.to(animation, { duration: 1, display: 1 });
tl.to(".info", { duration: 1, opacity: 1, y: 0 }, 2.5);
tl.to(".info", { duration: 1, opacity: 0, y: 100 });

const animateGlobe = () => {
  if (animation.isRotate) {
    const t = animation.rotation;
    const s = map(Math.abs(t - 0.5), 0, 0.5, minZoom, sqrt(width) * 30);
    projection.rotate(iv(t)).scale(s, s);
    animate([p1, ip(t)], t, false);
    createMarker(p1, (1 - t) * 10);
  } else {
    const t = animation.display;
    animate([p2, ip(t)], t, true);
    createMarker(p2, t * 10);
  }

  requestAnimationFrame(animateGlobe);
};

animateGlobe();
