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
  dancer = Dancer(); 
  dancer.initialize(scene.getPoseNet()); 

  //sets up participants
  initializeParticipants().then(result => participants = result); 
}

//Clears canvas, and re-draws dancer and participants
function draw() {
  background(0);
  updateDancer(dancer); 
  //updates partcipants position
  updateParticipants(participants);
  //checks if there are new users or if users have left & update the list 
  manageUsers().checkForUpdates(); 
}

window.addEventListener('beforeunload', function(e) {
  noLoop();
  var confirmationMessage = 'o/';
  dancer.done = true;
  dancer.remove();
  return confirmationMessage; //Webkit, Safari, Chrome
});