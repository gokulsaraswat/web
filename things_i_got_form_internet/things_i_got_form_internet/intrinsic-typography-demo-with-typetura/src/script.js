// The Typetura script can be found at
// https://github.com/Typetura/Typetura

// The following is NOT the Typetura script. This is for the Typetura visualizer. Click on a headline to view it.

var cssTarget = ".primary-headline";

var css = document.createElement("style");
document.body.appendChild(css);

var p1 = [65, 100];
var p2 = [50, 0];

var fontFamily = "Roslindale";
var maxSize = 84;
var area = 900;
var activeWidth = 0;

var easing = document.getElementById("easing");

var easeStart = document.getElementById("ease-start");
var easeEnd = document.getElementById("ease-end");

var path = document.getElementById("tt-path");
var lineStart = document.getElementById("tt-line-start");
var lineEnd = document.getElementById("tt-line-end");

var ttModal = document.querySelector(".tt-configuration");
var inputFontFamily = document.getElementById("fontFamily");
var inputMaxSize = document.getElementById("maxSize");
var inputArea = document.getElementById("area");
var textMarker = document.getElementById("tt-marker");
var cuttentPX = document.getElementById("tt-currentpx");

var selectedEliment = document.querySelector(cssTarget);

inputFontFamily.value = fontFamily;
inputMaxSize.value = maxSize;
inputArea.value = area;

var xDif = 0;
var yDif = 0;

var moveMode = null;

// INIT

easeStart.setAttribute("cx", p1[0]);
easeStart.setAttribute("cy", p1[1]);
lineStart.setAttribute("x2", p1[0]);
lineStart.setAttribute("y2", p1[1]);
easeEnd.setAttribute("cx", p2[0]);
easeEnd.setAttribute("cy", p2[1]);
lineEnd.setAttribute("x2", p2[0]);
lineEnd.setAttribute("y2", p2[1]);
path.setAttribute(
  "d",
  `M0 100 C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} 100 0`
);

// Functions

function ttOpen() {
  ttModal.classList.add("active");
}
function ttClose() {
  ttModal.classList.remove("active");
}

function writeCurve(p1, p2) {
  fontFamily = inputFontFamily.value;
  maxSize = inputMaxSize.value;
  area = inputArea.value;

  css.innerHTML = `
  ${cssTarget} {
    font-family: ${fontFamily};
    --tt-max: ${area};
    --tt-ease: cubic-bezier(${p1[0] / 100},${1 - p1[1] / 100},${
    p2[0] / 100
  },${1 - p2[1] / 100});
  }
  @keyframes primary-headline {
    0% {
      line-height: 1.1;
      font-size: .75rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      font-variation-settings: "opsz" 16;
      font-stretch: 50%;
    }

    80% {
      font-variation-settings: "opsz" 48;
    }

    100% {
      line-height: 1.03;
      font-size: ${maxSize}px;
      font-weight: 500;
      letter-spacing: 0.01em;
      font-variation-settings: "opsz" 48;
      font-stretch: 90%;
    }
  }
  `;
  moveMarker(selectedEliment.offsetWidth);
}

function moveMarker(width) {
  textMarker.setAttribute("x", (width / area) * 100 - 0.5);
  cuttentPX.setAttribute("x", (width / area) * 100 - 10);
  cuttentPX.innerHTML =
    parseInt(
      window
        .getComputedStyle(selectedEliment)
        .getPropertyValue("font-size")
        .replace("px", "")
    ) + "px";
}

const resizeObserver = new ResizeObserver((entries) => {
  moveMarker(selectedEliment.offsetWidth);
});

resizeObserver.observe(selectedEliment);

var cssTargets = document.querySelectorAll(cssTarget);
for (var i = 0; i < cssTargets.length; i++) {
  const el = cssTargets[i];
  cssTargets[i].addEventListener("mousedown", (e) => {
    selectedEliment = el;
    moveMarker(selectedEliment.offsetWidth);
    ttOpen();
  });
}

function initStart(event) {
  moveMode = "start";
  xDif = event.clientX;
  yDif = event.clientY;
  document.onmousemove = moveStart;
  event.preventDefault();
}

function initEnd(event) {
  moveMode = "end";
  xDif = event.clientX;
  yDif = event.clientY;
  document.onmousemove = moveEnd;
  event.preventDefault();
}

function moveStart(event) {
  var x = (event.clientX - xDif) / 1.4;
  var y = (event.clientY - yDif) / 1.4;
  var p1a = p1[0] + x;
  var p1b = p1[1] + y;
  easeStart.setAttribute("cx", p1a);
  easeStart.setAttribute("cy", p1b);
  lineStart.setAttribute("x2", p1a);
  lineStart.setAttribute("y2", p1b);
  path.setAttribute(
    "d",
    `M0 100 C ${p1a} ${p1b} ${p2[0]} ${p2[1]} 100 0`
  );
  writeCurve([p1a, p1b], p2);
}

function moveEnd(event) {
  var x = (event.clientX - xDif) / 1.4;
  var y = (event.clientY - yDif) / 1.4;
  var p2a = p2[0] + x;
  var p2b = p2[1] + y;
  easeEnd.setAttribute("cx", p2a);
  easeEnd.setAttribute("cy", p2b);
  lineEnd.setAttribute("x2", p2a);
  lineEnd.setAttribute("y2", p2b);
  path.setAttribute(
    "d",
    `M0 100 C ${p1[0]} ${p1[1]} ${p2a} ${p2b} 100 0`
  );
  writeCurve(p1, [p2a, p2b]);
}

function endBoth(event) {
  if (moveMode === "start") {
    var x = (event.clientX - xDif) / 1.4;
    var y = (event.clientY - yDif) / 1.4;
    p1[0] = p1[0] + x;
    p1[1] = p1[1] + y;
  } else if (moveMode === "end") {
    var x = (event.clientX - xDif) / 1.4;
    var y = (event.clientY - yDif) / 1.4;
    p2[0] = p2[0] + x;
    p2[1] = p2[1] + y;
  }

  moveMode = null;
  document.onmousemove = null;
}

const container = document.querySelector(".container");
const view = document.querySelector(".view");

easeStart.onmousedown = initStart;
easeEnd.onmousedown = initEnd;
document.onmouseup = endBoth;
