// Charting/mapping tool
// Michael
// Started 5/8/24
//stole a lot from "budgeterraria" and "why not" from my other repo
//recycled code yippee, why redo something I have already done before?

let chart; //this is the magical table of yes theres a note there
let cellSize;
const beats = 120; //how long the thing is... it hurts that im making incredibly long arrays, especially when offbeats are involved
let bpm = 125; //am I sure melody salad is 278 bpm?
let lastUpdate = 0; //yay counting
let multiplier = 1; //this will be used to account for the aforementioned offbeats later
const lanes = 4;
const VISIBLE_GRID_SIZE = { //keep it at 4
  w: 4, //width
  h: 12, //height
};
let state = "paint";
let player = { //gonna need to change this
  y: 0,
};
let skyFortress, melodySalad, isolation, beGone; //these are the songs

function preload(){
  skyFortress = loadSound("audio/Sky Fortress.mp3");
  //isolation = loadSound("audio/Isolation.mp3");
  //melodySalad = loadSound("audio/Melody Salad.mp3");
  beGone = loadSound("audio/You'll Be Gone.mp3");
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
  }
}

function keyPressed() { //causes various things to happen when keys are pressed

  if (key === "e") { //clears
    chart = generateEmptyGrid(lanes, beats);
  }
  if (key === " " && state === "menu"){
    state = "paint";
  }
  else if(key === " " && state === "paint"){
    player.y = 6;
    state = "test";
    beGone.play(); //sounds a bit fuzzy?
  }
  else if(key === "k" && state === "paint"){
    state = "test";
    beGone.play(0, 0, 100, (bpm/60)); //gonna edit this to start at the hovered section
  } //seconds, each tile is bpm/60th of a second   125/60
  else if(key === " " && state === "test"){
    state = "paint";
    beGone.stop();
  }
}

function mouseWheel(event) { //I effectively copied stuff from the p5js reference here since I hadnt played with the scrollwheel
  if (event.delta >= 0){
    movePlayer(player.y + 1);
  }
  else{
    movePlayer(player.y - 1); 
  }
}

function mousePressed() { //places notes
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  let offsety = 0;
  // if (player.y < VISIBLE_GRID_SIZE.h){//FIX THHISSSSSSSSSSSSSS
  offsety = VISIBLE_GRID_SIZE.hf;
  // }
  if (player.y >= beats - VISIBLE_GRID_SIZE.hf){
    offsety = beats-player.y-VISIBLE_GRID_SIZE.hc;
  }
  y += player.y - VISIBLE_GRID_SIZE.hf + offsety;

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
    player.y = y;
  }
}

function displayVisGrid(){ //paints just a section of the notes
  for (let y = 0; y < VISIBLE_GRID_SIZE.h; y++){
    for (let x = 0; x < VISIBLE_GRID_SIZE.w; x++){

      if (chart[y+player.y][x] === 1) {
        fill("black");
      }
      else if (chart[y+player.y][x] === 0){
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
      if (chart[y][x] === 1){
        fill("black");
      }
      else if (chart[y][x] === 0){
        fill("white");
      }
      rect(windowWidth - 80 + x * 20, y * windowHeight / (beats-1), 20);
      noStroke();
    }
  }
  fill("blue"); //this is the scrollbar (nonclickable), probably tastes like pasta tho
  rect(windowWidth - 85, player.y * windowHeight / (beats-1) - windowHeight/beats*6, 5, VISIBLE_GRID_SIZE.h * (windowHeight/beats));
}

function rabbit(){ //the function being named this is a reference to marathon pacekeepers who are informally nicknamed "rabbits" according to wikipedia

  if (millis() - lastUpdate >= 1000/(bpm/60)){
    movePlayer(player.y + 1);
    lastUpdate = millis();
  }
}

//todo: make it sync with audio, add visual simulation for notes, make playback mid song work properly
//
//after that I can work on the main thing and maps
//learn about promises and callbacks? p5party?

//to play sounds do soundFile.play(delay if needed); and to stop it do soundFile.stop();
//gonna have to do a multi prep-beat thing
//WEBGL has 0, 0 at the middle like scratch