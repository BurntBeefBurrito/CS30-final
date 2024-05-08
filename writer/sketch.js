// Charting/mapping tool
// Michael
// Started 5/8/24
//stealing a lot from "budgeterraria" and "why not" from my other repo
//recycled code yippee, why redo something I have already done before?

let grid;
let cellSize;
const beats = 20; //how long the thing is
const lanes = 4;
const VISIBLE_GRID_SIZE = { //odd numbers strongly recommended
  w: 4, //width
  h: 9, //height
};
const PLAYER = 9;
let state = "menu";
let player = { //gonna remove the non essential parts of player (everything except y)
  x: 0,
  y: 0,
  ontile: 0,
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = generateEmptyGrid(lanes, beats);
  grid[player.y][player.x] = PLAYER;
  noSmooth();
  VISIBLE_GRID_SIZE.wf = Math.floor(VISIBLE_GRID_SIZE.w/2); //width floor these were useful in the past
  VISIBLE_GRID_SIZE.wc = Math.ceil(VISIBLE_GRID_SIZE.w/2); //width ceiling
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
    background("black");
    text("hit space to start the thing, use wasd, e, r, t and left click to do stuff", windowWidth/2 - 150, windowHeight/2);
  }
  else{
    background(135, 196, 235);
    displayVisGrid();
  }



}

function keyPressed() { //causes various things to happen when keys are pressed

  if (key === "e") {
    grid = generateEmptyGrid(lanes, beats);
  }
  if (key === "w") {
    movePlayer(player.x + 0, player.y -1); //0 on x, -1 on y...
  }
  if (key === "s") {
    movePlayer(player.x, player.y + 1);
  }
  if (key === " " && state === "menu"){
    state = "thing";
  }
}

function mousePressed() { //transforms tiles when clicked on, please improve
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  let offsetx = 0;
  let offsety = 0;
  if (player.x < VISIBLE_GRID_SIZE.wf){
    offsetx = VISIBLE_GRID_SIZE.wf-player.x;  
  }
  if (player.y < VISIBLE_GRID_SIZE.hf){
    offsety = VISIBLE_GRID_SIZE.hf-player.y;
  }
  if (player.y >= beats -VISIBLE_GRID_SIZE.hf){
    offsety = beats-player.y-VISIBLE_GRID_SIZE.hc;
  }
  if (player.x >= lanes -VISIBLE_GRID_SIZE.wf){
    offsetx = lanes-player.x-VISIBLE_GRID_SIZE.wc;
  }
  x += player.x - VISIBLE_GRID_SIZE.wf + offsetx;
  y += player.y - VISIBLE_GRID_SIZE.hf + offsety;

  toggleCell(x, y);
}

function toggleCell(x, y) {
  //toggle the cells type
  if (x < lanes && y < beats && x >=0 && y >= 0) {
    if (grid[y][x] === 0) {
      grid[y][x] = 1;
    }
    else if(grid[y][x] !== 0 && grid[y][x] !== PLAYER){
      grid[y][x] = 0;
    }
  }
}

function generateEmptyGrid(cols, rows) { //make an empty grid, handy for testing screensizes
  let emptyArray = [];
  for (let y = 0; y < rows; y++) {
    emptyArray.push([]);
    for (let x = 0; x < cols; x++) {
      emptyArray[y].push(0);
    }
  }
  emptyArray[player.y][player.x] = PLAYER;
  return emptyArray;
}

function movePlayer(x, y){ //moves the player
  if (x < lanes && y < beats && x >=0 && y >= 0) { //this keeps it on the grid
    let ontile = grid[y][x]; //remembers what tile the player is standing on
    let oldX = player.x;
    let oldY = player.y;

    player.x = x;
    player.y = y;

    grid[player.y][player.x] = PLAYER;
    grid[oldY][oldX] = player.ontile;
    player.ontile = ontile;
  }
}

function displayVisGrid(){ //paints pretty pictures
  for (let y = 0; y < VISIBLE_GRID_SIZE.h; y++){
    for (let x = 0; x < VISIBLE_GRID_SIZE.w; x++){
      let offsetx = 0;
      let offsety = 0;
      if (player.x < VISIBLE_GRID_SIZE.wf){
        offsetx = VISIBLE_GRID_SIZE.wf-player.x;  //gonna need to do something about the miracle numbers
      }
      if (player.y < VISIBLE_GRID_SIZE.hf){
        offsety = VISIBLE_GRID_SIZE.hf-player.y;
      }
      if (player.y >= beats -VISIBLE_GRID_SIZE.hf){
        offsety = beats-player.y-VISIBLE_GRID_SIZE.hc;
      }
      if (player.x >= lanes -VISIBLE_GRID_SIZE.wf){
        offsetx = lanes-player.x-VISIBLE_GRID_SIZE.wc;
      }

      if (grid[y+player.y-VISIBLE_GRID_SIZE.hf+offsety][x+player.x-VISIBLE_GRID_SIZE.wf+offsetx] === 1) {
        fill("black");
      }
      else if (grid[y+player.y-VISIBLE_GRID_SIZE.hf+offsety][x+player.x-VISIBLE_GRID_SIZE.wf+offsetx] === 0){
        fill("white");
      }
      else if (grid[y+player.y-VISIBLE_GRID_SIZE.hf+offsety][x+player.x-VISIBLE_GRID_SIZE.wf+offsetx] === 9){
        fill("green");
      }
      rect(x * cellSize, y * cellSize, cellSize);
    }
  }
} //  ) *matches your unmatched parenthesis*