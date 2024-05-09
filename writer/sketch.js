// Charting/mapping tool
// Michael
// Started 5/8/24
//stealing a lot from "budgeterraria" and "why not" from my other repo
//recycled code yippee, why redo something I have already done before?

let grid;
let cellSize;
const beats = 40; //how long the thing is
const lanes = 4;
const VISIBLE_GRID_SIZE = { //odd numbers strongly recommended
  w: 4, //width
  h: 12, //height
};
let state = "menu";
let player = {
  y: 6,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = generateEmptyGrid(lanes, beats);
  noSmooth();
  VISIBLE_GRID_SIZE.hf = Math.floor(VISIBLE_GRID_SIZE.h/2); //height floor
  VISIBLE_GRID_SIZE.hc = Math.ceil(VISIBLE_GRID_SIZE.h/2); //height ceiling
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
    text("this is a mapping thing, made for my convenience not yours. But nonetheless, click stuff and use w and d to scroll up and down, also hit E to save ;)", windowWidth/2 - 350, windowHeight/2);
  }
  else{
    background(35, 36, 80);
    displayVisGrid();
  }
}

function keyPressed() { //causes various things to happen when keys are pressed

  if (key === "e") { //clears
    grid = generateEmptyGrid(lanes, beats);
  }
  if (key === "w") { //moves view up
    movePlayer(player.y -1); 
  }
  if (key === "s") { //moves view down
    movePlayer(player.y + 1);
  }
  if (key === " " && state === "menu"){
    state = "thing";
  }
}

function mousePressed() { //places notes
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  let offsety = 0;
  if (player.y < VISIBLE_GRID_SIZE.hf){
    offsety = VISIBLE_GRID_SIZE.hf-player.y;
  }
  if (player.y >= beats -VISIBLE_GRID_SIZE.hf){
    offsety = beats-player.y-VISIBLE_GRID_SIZE.hc;
  }
  y += player.y - VISIBLE_GRID_SIZE.hf + offsety;

  toggleCell(x, y);
}

function toggleCell(x, y) {
  //toggle the cells type
  if (x < lanes && y < beats && x >=0 && y >= 0) {
    if (grid[y][x] === 0) {
      grid[y][x] = 1;
    }
    else if (grid[y][x] === 1) {
      grid[y][x] = 0;
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
  if (y < beats-VISIBLE_GRID_SIZE.hf && y >= VISIBLE_GRID_SIZE.hf) { //this keeps it on the grid
    player.y = y;
  }
}

function displayVisGrid(){ //paints pretty pictures
  for (let y = 0; y < VISIBLE_GRID_SIZE.h; y++){
    for (let x = 0; x < VISIBLE_GRID_SIZE.w; x++){

      if (grid[y+player.y-VISIBLE_GRID_SIZE.hf][x] === 1) {
        fill("black");
      }
      else if (grid[y+player.y-VISIBLE_GRID_SIZE.hf][x] === 0){
        fill("white");
      }
      rect(x * cellSize, y * cellSize, cellSize);
    }
  }
}