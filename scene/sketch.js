// Rhythm Heaven't
// Michael Gorylev
// 3/27/24
//        offset text
// Extra for Experts:
// - I used arrays before they were introduced (3/11/24)

//temporary sprites were taken from https://phighting.fandom.com/wiki/Stickers

//images for core gameplay
let boom, bumperImage, bumperDownImage;

//variables relating to notes and lanes
let lanes; // the number of lanes lol, dont use more than 4 yet
let accuracy; // how much distance do you have to hit the notes? bigger is easier
let noteSpeed; //how fast the notes go zoom, measured in pixels per frame
let tempNote; //this is to make coding new notes easier ig
let noteTraits = []; //the updated lane and distance array

//misc variables
let state; // is it in a menu, or playing?
let binds; //keybindings the user presses

//visual variables, will probably be baked together into a single object or smth
let offsetx; //how offset are the lanes and things? This will be used for silly mechanics when i get around to them
let spacing; //how spaced are the lanes?

//                              THINGS TO DO (short term)
//                              choose music (dont infringe copyright, even though this isnt being monetized)
//                              make everything operate on a millis clock?
//                              if you wanna load a JSON file, do it almost like an image, eg file = loadJSON("file.json");
//                              

//picture heaven
function preload(){
  bumperImage = loadImage("images/Slingshotwoah.jpg");
  boom = loadImage("images/Boomboxgg.jpg");
  bumperDownImage = loadImage("images/SlingshotGoodJob.jpg");
}

function setup() {
  angleMode(DEGREES);
  lanes = 4;
  createCanvas(windowWidth, windowHeight);
  state = "play";
  binds = [68, 70, 74, 75, 83, 76];
  accuracy = 80;
  noteSpeed = 6;
  offsetx = 0;
  spacing = 240; //use 240
  imageMode(CENTER);

}

function draw() {
  background(220, 150, 220);
  if (state === "play"){
    playing();
  }
  // if (state === "menu"){
  //   menu();
  // } 
}

// function menu(){ ...its a menu... it'll be branched out into multiple menus
//   text("This is a very high budget menu. hit left click to play the thing", windowWidth/2 - 150, windowHeight/2);
//   if (mouseIsPressed){
//     state = "play";
//   }
// }

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

        if (noteTraits[possibleNotes].distance >= windowHeight*0.9 - accuracy && noteTraits[possibleNotes].distance 
          <= windowHeight*0.9 + accuracy && noteTraits[possibleNotes].lane === q){
          noteTraits.splice(possibleNotes, 1);
          possibleNotes = noteTraits.length+40;
        }
      }
    }
  }
}

function arrowMan(){ //this is an all you can eat buffet for note management
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

function spawnNote() { //gonna need to put stuff in the brackets in the future
  let tempNote = {
    speed: noteSpeed,
    lane: round(random(0, lanes-1)),
    distance: round(windowHeight*0.9 - 800),

  };
  noteTraits.push(tempNote);
} //gonna need to switch this to webgl so that I can rotate stuff :)