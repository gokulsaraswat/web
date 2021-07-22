    // This script is dependant on p5.js
    var gui = new dat.GUI({name: 'GUI'});

    var system = {
      text: "Codepen",
      flow: 2,
      topSpeed: 500,
      lifeSpan: 1000,
      flowOffset: 0,
      gravity:{
        direction:90,
        force:0
      }
    };

    var f_b = gui.addFolder('Base');
    f_b.open();
    f_b.add(system, "text")
      .onChange(init)
      f_b.add(system, 'flow', 0, 100);
      f_b.add(system, 'topSpeed', 10, 1000);
      f_b.add(system, 'lifeSpan', 100, 2000);
      f_b.add(system, 'flowOffset', 0, Math.PI*2);

    var f_g = gui.addFolder('Gravity');
    f_g.open();
    f_g.add(system.gravity, "direction").min(0).max(360)
      .onChange(setGravity)
      f_g.add(system.gravity, "force").min(0).max(100)
        .onChange(setGravity)




    let colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
      '#FF5722'
    ];
    class Particle {
      constructor(x, y, size, index) {
        this.base_size = size;
        this.index = index || 0;
        this.spawn = createVector(x, y);
        this.init();
      }
      init() {
        this.size = this.base_size * random(0.5, 1.5);

        this.start = millis();
        this.position = this.spawn.copy();
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.duration = system.lifeSpan * random(0.2,1.2);
        this.drag = random(0.9, 1);
        this.addForce(
          new p5.Vector.fromAngle(random(TWO_PI), random(10))
        );
        this.color = random(colors);

      }
      display() {
        let s = 1;
        if (millis() - this.start < this.duration * 0.1) {
          s = map(millis() - this.start, 0, this.duration * 0.1, 0, 1);
        } else if (millis() - this.start > this.duration * 0.5) {
          s = map(millis() - this.start, this.duration * 0.5, this.duration, 1, 0);
        }
        fill(this.color);
        circle(this.position.x, this.position.y, this.size * s * map(this.velocity.mag(),0,system.topSpeed,0.5,1.2));
      }
      update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(system.topSpeed);
        this.velocity.mult(this.drag);
        this.position.add(this.velocity.copy().mult(1 / _targetFrameRate));
        this.acceleration.mult(0);
        if (this.position.y > height || millis() - this.start > this.duration) {
          this.init();
        }
      }
      addForce(vector) {
        this.acceleration.add(vector);
      }
    }

    let particles = [], field = [], fieldStep,
      gravity;
    function setGravity(){
      gravity = new p5.Vector.fromAngle(radians(system.gravity.direction),system.gravity.force);
    }
    function setup() {
      createCanvas(windowWidth, windowHeight);
      setGravity();
      init();
      frameRate(60);
      noStroke();
      colorMode(HSL, 100);
    }
    function windowResized() {
      resizeCanvas(windowWidth, windowHeight);
      init();
    }
    function init() {
      clear();
      fill(0);
      textSize(12);
      textStyle(BOLD);
      let text_box_width = min(width, 1200) * 0.8;
      let minSizeW = 12 / textWidth(system.text) * text_box_width;
      textSize(minSizeW);
      text(system.text, width / 2 - text_box_width / 2, height / 2);
      // Scan the canvas searching for black pixels
      // particles will spawn from there :)
      noFill();
      particles = [];
      let step = floor(max(width,height)/min(160,min(width,height)));
      let i = 0;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {

          let target_x = x + step / 2,
            target_y = y + step / 2;
          let alpha = get(target_x, target_y)[3];
          if (alpha > 0.5) {
            particles.push(new Particle(target_x, target_y, step * 3, i));
            i++;
          }
        }
      }
      field = {};
      clear();
      step = fieldStep = floor(max(width,height)/min(20,min(width,height)));
      i = 0;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          i++;
          let a = noise(i)*TWO_PI;
          field[`${x}-${y}`] = a;
          translate(x,y);
          rotate(a);
          rect(-step/4,-step/2,step/2,step)
          resetMatrix();
        }
      }

      clear();
    }

    function draw() {
      background(255);
      particles.forEach((particle, i) => {
        particle.addForce(gravity);
        // search field
        particle.addForce(
          new p5.Vector.fromAngle(
            field[`${particle.position.x - (particle.position.x%fieldStep)}-${particle.position.y - (particle.position.y%fieldStep)}`] + system.flowOffset,
            system.flow
          )
        );
        particle.update();
        particle.display();
      });
    }
