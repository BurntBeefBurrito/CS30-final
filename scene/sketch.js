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
  songs = ["skyFortress", "isolaton", "melodySalad"];
  for (let song in songs){
    let coverArt = "loadImage(\"maps/" + songs[song] + "/art.png\")"; //use ur brain :P this wont work
    let tempMapInfo = {
      coverArt: eval(coverArt), //eval is considered a risk :P
    };

    mapData.push(tempMapInfo);
  }
  binds = [68, 70, 74, 75, 83, 76];
  accuracy = 80;
  noteSpeed = 6;
  offsetx = 0;
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
} //gonna need to switch this to webgl so that I can rotate stuff :)

function mainMenu(){ //the menuMenu
  text("High budget menu. Left click for map select", windowWidth/2 - 150, windowHeight/2);
  if (mouseIsPressed){
    subState = "mapSelect";
  }
}

function mapSelectMenu(){ //mmm choices
  text("map placeholder", windowWidth/2 - 150, windowHeight/2);
  for (let i = 0; i < songs.length; i++){
    let searchFor = songs[i];
    image(mapData[searchFor]["coverArt"], windowWidth/2 + i * 150, windowHeight/2, 100, 100);
  }
  // if (mouseIsPressed){
  //   state = "play";
  // }
}

// function mouseWheel(event) { //this will come in handy :P
//   if (event.delta >= 0){
//     movePlayer(player.y + 1);
//   }
//   else{
//     movePlayer(player.y - 1); 
//   }
// }

function settingsMenu(){ //I cant wait for this to go unused and undeleted along with creditsMenu
  text("settings placeholder", windowWidth/2 - 150, windowHeight/2);
}

function creditsMenu(){ //gotta thank people
  text("credit placeholder", windowWidth/2 - 150, windowHeight/2);
}