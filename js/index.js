let dancer;
let participants = [];

//Sets up the canvas and initializes the video.
function setup() {
  createCanvas(800, 600);
  background(0);

  //sets up firebase
  firebase.initializeApp(config);

  //sets up camera - initializes the video
  const scene = Scene();
  scene.start();

  //sets up dancer
  let dancer = Dancer(); 
  dancer.initialize(scene.getPoseNet());

  //sets up participants
  participants = initializeParticipants(); 
}

//Clears canvas, and re-draws dancer and participants
function draw() {
  background(0);
  updateDancer(dancer); 
  updateParticipants(participants)
}

window.addEventListener('beforeunload', function(e) {
  noLoop();
  var confirmationMessage = 'o/';
  dancer.done = true;
  dancer.remove();
  return confirmationMessage; //Webkit, Safari, Chrome
});