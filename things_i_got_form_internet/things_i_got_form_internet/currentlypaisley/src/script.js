//This is a draft and should really get redone with a class
//click to add more
let pArrayX = [];
let pArrayY = [];
let pArrayT = [];
let pArrayS = [];
let n = 40;
let alph = 200;
redF = 60;
function setup() {
	createCanvas(windowWidth, windowHeight);
	noFill();
	angleMode(DEGREES);
	paisleyArray();
}

function draw() {
	t = frameCount / 200;
	redF = abs(200 * sin(t * 50));
	translate(width / 2, height / 2);
	background(50 + redF, 225, 245);
	paisleyLoop();
}

function paisleyDrop(r) {
	beginShape();
	for (let i = 270; i > 90; i--) {
		a = r * sin(i);
		b = r * cos(i);
		vertex(a, b);
	}
	for (let i = 270; i < 450; i++) {
		a = 2 * r + r * sin(i);
		b = r * cos(i);
		vertex(a, b);
	}
	for (let i = 90; i < 270; i++) {
		a = r + 2 * r * sin(i);
		b = 2 * r * cos(i);
		vertex(a, b);
	}
	endShape(CLOSE);
}
function paisleyOne(r) {
	stroke(0 + redF, 90, 100);
	strokeWeight(3);
	fill(20 + redF, 170, 190, alph);
	paisleyDrop(100);
	fill(80 + redF, 240, 270, alph);
	push();
	translate(5, -20);
	scale(1.15, 1.1);
	paisleyDrop(90);
	pop();
	noFill();
	strokeWeight(5);
	stroke(10 + redF, 90, 100);
	circle(212, -30, 160);
	push();
	translate(212, -30);
	for (let i = 0; i < 12; i++) {
		c = 80 * sin(30 * i);
		d = 80 * cos(30 * i);
		circle(c, d, 40);
	}
	fill(10 + redF, 90, 100, alph);
	circle(0, 0, 100);
	pop();
	fill(10 + redF, 90, 100, alph);
	circle(140, -150, 80);
	circle(60, -160, 50);
	circle(7, -150, 30);
	circle(-30, -135, 20);
}

function paisleyTwo() {
	stroke(255);
	strokeWeight(1);
	fill(10 + redF, 90, 100, alph);
	paisleyDrop(100);
	push();
	translate(100, 0);
	noStroke();
	for (let i = 0; i < 9; i++) {
		tx = 90 * sin(90 + i * 13) - i * 10;
		ty = 135 * cos(90 + i * 13);
		fill(80 + redF, 240, 270, alph);
		circle(tx + 10, ty, 140 - i * 12);
		fill(10 + redF, 90, 100, alph);
		circle(tx + 25, ty - 5, 120 - (i - 1) * 9);
	}
	pop();
}

function paisleyThree() {
	stroke(10 + redF, 90, 100);
	strokeWeight(3);
	beginShape();
	noFill();
	r = 100;
	for (let i = 0; i < 18; i++) {
		a = r * sin(270 - i * 10);
		b = r * cos(270 - i * 10);
		vertex(a, b);
		circle(a, b, 20);
	}
	for (let i = 0; i < 18; i++) {
		a = 2 * r + r * sin(270 + i * 10);
		b = r * cos(270 + i * 10);
		vertex(a, b);
		circle(a, b, 20);
	}
	for (let i = 0; i < 36; i++) {
		a = r + 2 * r * sin(90 + i * 5);
		b = 2 * r * cos(90 + i * 5);
		vertex(a, b);
		circle(a, b, 20);
	}
	endShape(CLOSE);
	fill(255, 255, 255, alph);
	paisleyDrop(100);
}
function paisleyArray() {
	pArray = [];
	for (let i = 0; i < n; i++) {
		pArrayX[i] = random(-width / 2, width / 2);
		pArrayY[i] = random(-height / 2, height / 2);
		pArrayT[i] = floor(random(0, 4));
		pArrayS[i] = random(0.05, 1.2);
	}
}

function paisleyLoop() {
	for (let i = 0; i < n; i++) {
		push();
		rotate(t * 100 + pArrayX[i] + pArrayY[i]);
		translate(
			pArrayX[i] + 100 * sin(t * pArrayX[i]),
			pArrayY[i] + 100 * cos(t * pArrayY[i])
		);
		scale(pArrayS[i], pArrayS[i]);
		if (pArrayT[i] === 0) {
			paisleyOne();
		} else if (pArrayT[i] === 1) {
			paisleyTwo();
		} else if (pArrayT[i] === 2) {
			paisleyThree();
		}
		pop();
	}
}

function mousePressed() {
	if (n < 100) {
		for (let i = n; i < n + 5; i++) {
			pArrayX[i] = random(-width / 2, width / 2);
			pArrayY[i] = random(-height / 2, height / 2);
			pArrayT[i] = floor(random(0, 4));
			pArrayS[i] = random(0.05, 1.2);
		}
		n += 5;
	}
	if (n >= 90) {
		pArray = [];
		n = 10;
		paisleyArray();
	}
}
