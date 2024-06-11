// Rhythm Heaven't
// Michael Gorylev
// 3/27/24

//temporary sprites were taken from https://phighting.fandom.com/wiki/Stickers

//images for core gameplay
let boom, bumperImage, bumperDownImage;

//variables relating to notes and lanes
let lanes; // the number of lanes lol, dont use more than 4 yet
let accuracy; // how much distance do you have to hit the notes? bigger is easier
let noteSpeed; //how fast the notes go zoom, measured in pixels per frame
let tempNote; //this is to make coding new notes easier ig
let noteTraits = []; //the updated lane and distance array
let beat; //this will replace player.y

//variables in regards to mapchoosing
let hoveredMap; //which of the maps is being hovered
let songs; //list of all the internal map names, used to access the map folders
let mapData = [];
let artTest;

//misc variables
let state; // is it in a menu, or playing?
let subState; //what menu is it in, or is the map paused? May bake into state if it seems right
let binds; //keybindings the user presses

//visual variables, will probably be baked together into a single object or smth
let offsetx; //how offset are the lanes and things? This will be used for silly mechanics when i get around to them
let spacing; //how spaced are the lanes?

//THINGS TO DO (task amogus)
//make this read maps
//  if you wanna load a JSON file, do it almost like an image, eg file = loadJSON("file.json");
//add basic UI, for song selection for instance,  might write in an additional file
//adjust notespeed to match writer
//COPY PASTE COPY PASTE from writer
//get song info in separate folders for convenience (song, coverart, chart, bumf)
//for example, itll look like maps/isolation/chart.JSON
//then make the thing check for all the folders in maps, rather than predetermined ones
//make it look presentable
//Calling it SASS
//Make tutorial text 

//picture heaven
function preload(){
  bumperImage = loadImage("images/Slingshotwoah.jpg");
  boom = loadImage("images/Boomboxgg.jpg");
  bumperDownImage = loadImage("images/SlingshotGoodJob.jpg");
  artTest = loadImage("maps/isolation/art.png"); //how will I load an image/make a variable for every item in a list?
}

function setup() {
  angleMode(DEGREES);
  lanes = 4;
  createCanvas(windowWidth, windowHeight);
  state = "menu";
  subState = "main";
  songs = ["skyFortress", "isolation", "melodySalad"];
  for (let song in songs){
    let coverArt = "loadImage(\"maps/" + songs[song] + "/art.png\")"; //this was a hassle to figure out, believe me
    let tempMapInfo = {
      coverArt: eval(coverArt), //eval is considered a risk :P
    }; //do smth similar w/ the other map info, eg bpm and map itself

    mapData.push(tempMapInfo);
  }
  binds = [68, 70, 74, 75, 83, 76];
  accuracy = 80;
  noteSpeed = 6;
  offsetx = 0;
  hoveredMap = 0;
  spacing = 240; //use 240
  imageMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(220, 150, 220);
  if (state === "play"){
    playing();
  }
  if (state === "menu"){
    menuMan();
  } 
}

function menuMan(){ //...its a menu manager... 
  if(subState === "main"){
    mainMenu();
  }
  else if (subState === "mapSelect"){
    mapSelectMenu();
  }
  else if (subState === "settings"){
    settingsMenu();
  }
  else if (subState === "credits"){
    creditsMenu();
  }
  else{ //no idea if this will do anything, but I want to 
    subState === "main";
  }
}

function playing(){ //this manages other functions while playing the game
  bumperMan();
  arrowMan();
  if(random(0, 60) <= 3){ //this line will be replaced once I start mapping
    spawnNote();
  }

  //                                      THIS IS FOR ON SCREEN TEXT FEEL FREE TO CHANGE FOR TESTS
  text(noteTraits.length, 20, 20);

}

function bumperMan(){ //this draws the bumpers
  for(let i = 0; i < lanes; i++){

    if (keyIsDown(binds[i])){
      image(bumperDownImage, windowWidth/2-spacing/2 + spacing / lanes * i + offsetx + spacing/2/lanes, windowHeight*0.9, 90, 90);
    }
    else{
      image(bumperImage, windowWidth/2-spacing/2 + spacing / lanes * i + offsetx + spacing/2/lanes, windowHeight*0.9, 90, 90);
    }
  }
}

function keyPressed(){ //this deletes notes around a bumper when its pressed, only one at a time
  for(let q = 0; q < lanes; q++){
    if (keyCode === binds[q]){

      for(let possibleNotes = 0; possibleNotes < noteTraits.length; possibleNotes++){ 

        if (noteTraits[possibleNotes].distance >= windowHeight*0.9 - accuracy && noteTraits[possibleNotes].distance //checks each note to kill idfk wrote it a millenia ago
          <= windowHeight*0.9 + accuracy && noteTraits[possibleNotes].lane === q){
          noteTraits.splice(possibleNotes, 1);
          possibleNotes = noteTraits.length + 40;
        }
      }
    }
  }
}

function arrowMan(){ //this is an all you can eat buffet for note management, gonna rewrite this
  for(let note of noteTraits){ 
    image(boom, windowWidth/2-spacing/2 + spacing / lanes * note.lane + offsetx + spacing/2/lanes, note.distance, 90, 90); //draws notes
    note.distance += note.speed; //moves notes
  }

  for (let i = 0; i < noteTraits.length; i++){//kills notes
    if(noteTraits[i].distance >= windowHeight){ 
      noteTraits.splice(i, 1);
    }
  }
}

function spawnNote(){ //gonna need to put stuff in the brackets in the future
  let tempNote = {
    speed: noteSpeed,
    lane: round(random(0, lanes-1)),
    distance: round(windowHeight*0.9 - 800),

  };
  noteTraits.push(tempNote);
} //gonna need to switch this to webgl if I want to  rotate stuff :)

function mainMenu(){ //the menuMenu
  text("High budget menu. Left click for map select, RUN IN FULLSCREEN AND DONT CHANGE IT AT ALL COSTS AAAAAAAAAAAAAA", windowWidth/2 - 300, windowHeight/2);
  if (mouseIsPressed){
    subState = "mapSelect";
  }
}

function mapSelectMenu(){ //mmm choices
  text("map placeholder", windowWidth/2 - 150, windowHeight/2);
  for(let i = 0; i < songs.length; i++){
    image(mapData[i].coverArt, windowWidth/2 + i * 150 - 150 * hoveredMap -50, windowHeight/2, 100, 100); //cover art
  }
  if (mouseIsPressed && mouseX > windowWidth/2 - 100 && mouseX < windowWidth/2 + 0 //spaghetti code for boxes :D
  && mouseY > windowHeight / 2 - 50 && mouseY < windowHeight / 2 + 50){ 
    state = "play";
  }
}

function mouseWheel(event) { //this will come in handy :P
  if (state === "menu" && subState === "mapSelect"){
    if (event.delta >= 0 && hoveredMap < songs.length-1){
      hoveredMap += 1; 
    }
    else if (event.delta >= 0){
      hoveredMap = 0;
    }
    else if (event.delta <= 0 && hoveredMap > 0){
      hoveredMap -= 1;
    }
  }
}

function settingsMenu(){ //I cant wait for this to go unused and undeleted along with creditsMenu
  text("settings placeholder", windowWidth/2 - 150, windowHeight/2);
}

function creditsMenu(){ //gotta thank people
  text("credit placeholder", windowWidth/2 - 150, windowHeight/2);
}                                                                        //create buttonMan???

//this all has been copy pasted from writer, will need modification ouchie ouch so much red
//mapData[hoveredMap][thing, eg, bpm].whatever
function rabbit(){ //the function being named this is a reference to marathon pacekeepers who are informally nicknamed "rabbits" according to wikipedia
  if (millis() - lastUpdate >= 1000/(bpm/60)){
    translator();
    movePlayer(player.y + 1);
    lastUpdate = millis();
  }
}

function translator(){ //turns notes from the map into live notes
  for(let x = 0; x < lanes; x++){ //may change these to nicer numbers which arent magical
    if(chart[player.y][x] !== 0){
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

function movePlayer(y){ //moves the player
  if (y < beats-VISIBLE_GRID_SIZE.h && y >= 0) { //this keeps it on the grid
    player.y = y;
  }
}