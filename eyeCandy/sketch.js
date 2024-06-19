// eye candy for SASS
//the goal is to make cool looking things lol

let particles  = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i < 20; i++){
    spawnObject();
  }
}

function draw() {
  background(0);
  transformObjects();
}

function spawnObject(objectType) { //this creates particles
  let tempObject = {
    x: random(0, windowWidth),
    y: random(0, windowHeight),
    num: random(),
    type: "who cares",
  };
  particles.push(tempObject);
}

function transformObjects() {
  for (let i = 0; i  < particles.length; i++){
    swirlObject(i);
  }
}

function swirlObject(i) { //this makes particles swirl around the screen
  particles[i].num += 0.02;
  fill("white");
  particles[i].x = sin(particles[i].num) * windowWidth*0.8 + windowWidth/2;
  square(particles[i].x, particles[i].y, 100);
}