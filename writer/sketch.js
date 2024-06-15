// Charting/mapping tool
// Michael
// Started 5/8/24
//stole a lot from "budgeterraria" and "why not" from my other repo
//recycled code yippee, why redo something I have already done before?

let chart; //this is the magical table of yes theres a note there not to be confused with livenotes which tracks active notes with information
let cellSize;
const beats = 120; // 4:32
const bpm = 368; //the speed notes are read measures in BPM hence the name
const trueBpm = 184; //this is the actual bpm of the song, not the functional one
let lastUpdate = 0; //yay counting
const lanes = 4; //futureproofing
const VISIBLE_GRID_SIZE = { //keep it at 4
  w: 4, //width
  h: 12, //height
};
let state = "paint";
let player = { //remove y, to be scalped for info for 
  y: 0,
  bpm: bpm,
  trueBpm: trueBpm,
  beats: beats,
};
let position = 0;
let liveNotes = []; //these are the spawned notes
let skyFortress, melodySalad, isolation, beGone, memoryMerge; //these are the songs

function preload(){
  //skyFortress = loadSound("audio/Sky Fortress.mp3");
  //isolation = loadSound("audio/Isolation.mp3");
  //melodySalad = loadSound("audio/Melody Salad.mp3");
  memoryMerge = loadSound("audio/track.mp3"); //don't judge me
}

function setup() { 
  createCanvas(windowWidth, windowHeight);
  chart = generateEmptyGrid(lanes, beats);
  noSmooth();
  VISIBLE_GRID_SIZE.hf = Math.floor(VISIBLE_GRID_SIZE.h/2); //height floor
  VISIBLE_GRID_SIZE.hc = Math.ceil(VISIBLE_GRID_SIZE.h/2); //height ceiling
  frameRate(60);
}

function draw() {
  createCanvas(windowWidth, windowHeight);
  if(windowHeight < windowWidth){
    cellSize = height/VISIBLE_GRID_SIZE.h;
  }
  else{
    cellSize = width/VISIBLE_GRID_SIZE.w;
  }
  if (state === "menu"){
    background(50);
    text("this is made for my convenience not yours. Regardless, click stuff and use scrollwheel, also hit E to save ;)", windowWidth/2 - 350, windowHeight/2);
  }
  else if (state === "paint"){
    background(35, 36, 80);
    displayVisGrid();
    displayEverything();
  }
  else if (state === "test"){
    background(51, 20, 71);
    displayVisGrid();
    displayEverything();
    rabbit();
    arrowMan();
  }
}

function keyPressed() { //causes various things to happen when keys are pressed

  if (key === "e") { //clears
    chart = generateEmptyGrid(lanes, beats);
  }
  if (key === " " && state === "menu"){
    state = "paint";
  }
  else if(key === " " && state === "paint"){ //start at start
    position = 0;
    state = "test";
    memoryMerge.play(); //sounds a bit fuzzy?
  }
  else if(key === "k" && state === "paint"){ //start at hovered area
    state = "test";
    memoryMerge.play(0, 0, 100, 60/bpm * position);
  } //seconds, each tile is bpm/60th of a second   125/60
  else if(key === " " && state === "test"){
    state = "paint";
    liveNotes = [];
    memoryMerge.stop();
  }
}

function mouseWheel(event) { //I effectively copied stuff from the p5js reference here since I hadnt played with the scrollwheel
  if (event.delta >= 0){
    movePlayer(position + 1);
  }
  else{
    movePlayer(position - 1); 
  }
}

function mousePressed() { //places notes
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  let offsety = 0;
  offsety = VISIBLE_GRID_SIZE.hf;
  if (position >= beats - VISIBLE_GRID_SIZE.hf){
    offsety = beats-position-VISIBLE_GRID_SIZE.hc;
  }
  y += position - VISIBLE_GRID_SIZE.hf + offsety;

  toggleCell(x, y);
}

function toggleCell(x, y) { //could modify this to accomodate different note types
  //toggle the cells type
  if (x < lanes && y < beats && x >=0 && y >= 0) {
    if (chart[y][x] === 0) {
      chart[y][x] = 1;
    }
    else if (chart[y][x] === 1) {
      chart[y][x] = 0;
    }
  }
}

function generateEmptyGrid(cols, rows) { //makes an empty grid
  let emptyArray = [];
  for (let y = 0; y < rows; y++) {
    emptyArray.push([]);
    for (let x = 0; x < cols; x++) {
      emptyArray[y].push(0);
    }
  }
  return emptyArray;
}

function movePlayer(y){ //moves the player
  if (y < beats-VISIBLE_GRID_SIZE.h && y >= 0) { //this keeps it on the grid
    position = y;
  }
}

function displayVisGrid(){ //paints just a section of the notes
  for (let y = 0; y < VISIBLE_GRID_SIZE.h; y++){
    for (let x = 0; x < VISIBLE_GRID_SIZE.w; x++){

      if (chart[y+position][x] === 1) {
        fill("black");
      }
      else if (chart[y+position][x] === 0){
        fill("white");
      }
      rect(x * cellSize, y * cellSize, cellSize);
      
    }
  }
}

function displayEverything(){ //draws the entire map, "everything" here means every note in the full map, not everything everything
  for (let y = 0; y < beats; y++){
    for (let x = 0; x < lanes; x++){
      noStroke();
      if (chart[y][x] === 1){ //gonna need to add a "2" value for long notes. Someday.
        fill("black");
      }
      else if (chart[y][x] === 0){
        fill("white");
      }
      rect(windowWidth - 80 + x * 20, y * windowHeight / (beats-1), 20);
      noStroke();
    }
  }
  fill("blue"); //this is the scrollbar (nonclickable)
  rect(windowWidth - 85, position * (windowHeight/beats), 5, VISIBLE_GRID_SIZE.h * (windowHeight/beats));
} //close enough :shrug:

function rabbit(){ //the function being named this is a reference to marathon pacekeepers who are informally nicknamed "rabbits" according to wikipedia
  if (millis() - lastUpdate >= 1000/(bpm/60)){
    translator();
    movePlayer(position + 1);
    lastUpdate = millis();
  }
}

function translator(){ //turns notes from the map into live notes
  for(let x = 0; x < lanes; x++){ //may change these to nicer numbers which arent magical
    if(chart[position][x] !== 0){
      let tempNote = {
        speed: windowHeight/(60/(trueBpm/60))/4,
        lane: x,
        distance: 0,  //distance it needs to travel / frames
      };  //lets say 1 beat at 120 bpm at 60 fps one beat is 30 frames how do i know that? 
      liveNotes.push(tempNote); //120 bpm === 2 bps, 60fps/ bps = 30
    }
  }
}

function arrowMan(){ //different than the arrowman in scene, will have to change scene arrowman
  for(let i = liveNotes.length-1; i >= 0; i--){ //rewrote it to be read backwards
    fill("white");
    rect(windowWidth/2-120 + 240 / lanes * liveNotes[i].lane + 120/lanes, liveNotes[i].distance, 60, 60);
    liveNotes[i].distance += liveNotes[i].speed;
  }
}

//THINGS I NEED TO DO
//add visual simulation for notes, make playback mid song work properly
//after that I can work on the main thing and maps
//learn about promises and callbacks? p5party? Also eval?
//gonna have to do a multi prep-beat thing for the game itself
//WEBGL has 0, 0 at the middle like scratch. Use it if implementing eye candy
//find chiller music for a tutorial lol but not smth boring, I dont want the notation to feel watered down (NCS candyland?)
//abandon yon, dig through waterflame and camellia music? SASS
//implement game of life for a joke map?
//get betatest help from someone who doesnt do compsci, and someone who does
//for the final do all the quizzes, fancy object and non variable variable (object for example) stuff is something you should also be practicing