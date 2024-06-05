// Charting/mapping tool
// Michael
// Started 5/8/24
//stole a lot from "budgeterraria" and "why not" from my other repo
//recycled code yippee, why redo something I have already done before?

let chart; //this is the magical table of yes theres a note there not to be confused with livenotes which tracks active notes with information
let cellSize;
const beats = 120; //how long the thing is... it hurts that im making incredibly long arrays, especially when offbeats are involved
let bpm = 500; //am I sure melody salad is 278 bpm?
let trueBpm = 125; //this is the actual bpm of the song, not the functional one
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
let liveNotes = []; //these are the spawned notes
let skyFortress, melodySalad, isolation, beGone; //these are the songs

function preload(){
  //skyFortress = loadSound("audio/Sky Fortress.mp3");
  //isolation = loadSound("audio/Isolation.mp3");
  //melodySalad = loadSound("audio/Melody Salad.mp3");
  beGone = loadSound("audio/You'll Be Gone.mp3"); //gonna remove this eventually altogether
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
    player.y = 0;
    state = "test";
    beGone.play(); //sounds a bit fuzzy?
  }
  else if(key === "k" && state === "paint"){ //start at hovered area
    state = "test";
    beGone.play(0, 0, 100, 60/bpm * player.y);
  } //seconds, each tile is bpm/60th of a second   125/60
  else if(key === " " && state === "test"){
    state = "paint";
    liveNotes = [];
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
  fill("blue"); //this is the scrollbar (nonclickable), math probably tastes like pasta tho
  rect(windowWidth - 85, (player.y+1) * (windowHeight/beats - windowHeight/beats), 5, VISIBLE_GRID_SIZE.h * (windowHeight/beats));
}

function rabbit(){ //the function being named this is a reference to marathon pacekeepers who are informally nicknamed "rabbits" according to wikipedia
  if (millis() - lastUpdate >= 1000/(bpm/60)){
    translator();
    movePlayer(player.y + 1);
    lastUpdate = millis();
  }
}

function translator(){ //turns notes from the map into live notes
  for(let x = 0; x < lanes; x++){ //gonna change these to nicer numbers which arent magical
    if(chart[player.y][x] !== 0){
      let tempNote = {
        speed: 10, //im so lost
        lane: x,
        distance: 0,
      };
      liveNotes.push(tempNote);
    }

  } //lets say it needs to travel 800 pix over 8 beats (800 will be switched for dist to arrows)
  // 800/number of required frames to get there
  //
}

function arrowMan(){ //different than the arrowman in scene, will have to change scene arrowman
  for(let i = liveNotes.length-1; i > 0; i--){ //rewrote it to be read backwards
    fill("white");
    rect(windowWidth/2-120 + 240 / lanes * liveNotes[i].lane + 120/lanes, liveNotes[i].distance, 60, 60);
    liveNotes[i].distance += liveNotes[i].speed;
  }
}


//THINGS I NEED TO DO
//make it sync with audio, add visual simulation for notes, make playback mid song work properly
//after that I can work on the main thing and maps
//learn about promises and callbacks? p5party? Also eval?
//gonna have to do a multi prep-beat thing for the game itself
//WEBGL has 0, 0 at the middle like scratch. Use it if implementing eye candy
//find chiller music for a tutorial lol but not smth boring, I dont want the notation to feel watered down (NCS candyland?)
//abandon yon, dig through waterflame and camellia music? SASS
//find/make hit sounds
//im gonna add such a silly song (SASS) as an easter egg (if time permits)
//implement game of life for a joke map?
//get betatest help from someone who doesnt do compsci, and someone who does
//man I'm just lost in thinking about my other idea for a game, but it wouldnt work out in JS :(