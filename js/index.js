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
  dancer.initialize(scene.getPoseNet());

  //sets up participants
  participants = initializeParticipants(); 
}

//Clears canvas, and re-draws dancer
function draw() {
  background(0);
  //updates current user
  dancer.update();
  dancer.draw_drawPose(dancer.pose, {color: [100]})
  
  //loops through participants and updates them
  for(let i = 0; i < participants.length; i++){
    if(participants[i].getUserId !== null) {
      participants[i].update();
      participants[i].draw._drawPose(participants[i].pose, {color: [100]})
    }
  }
}

window.addEventListener('beforeunload', function(e) {
  noLoop();
  var confirmationMessage = 'o/';
  dancer.done = true;
  dancer.remove();
  return confirmationMessage; //Webkit, Safari, Chrome
});