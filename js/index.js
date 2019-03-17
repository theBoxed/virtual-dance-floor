let dancer;
let dancers = [];
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

  // My browser tells firebase I Joined - done in dancer.update()
  // Firebase says awesome, confirmed and here is everyone you're with
  initializeParticipants(); 
}

//Clears canvas, and re-draws dancer
function draw() {
  background(0);
  //updates current user
  dancer.update();
  
  //loops through participants and updates them
  for(let i = 0; i < participants.length; i++){
    if(participants[i].getUserId !== null) {
      participants[i].update();
    }
  }
}

function initializeParticipants(){ 
  firebase
  .database()
  .ref('users/')
  .once('value')
  .then((world)=> {
    for(let user in world.val()){ 
      if(user !== dancer.id) {
        let currParticipant = Participant();
        currParticipant.pose = world.val()[user].pose; 
        currParticipant.id = user; 
        participants.push(currParticipant);
      }
    }
    return participants;
  })
}

window.addEventListener('beforeunload', function(e) {
  noLoop();
  var confirmationMessage = 'o/';
  dancer.done = true;
  dancer.remove();
  return confirmationMessage; //Webkit, Safari, Chrome
});


var config = {
  apiKey: 'AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag',
  authDomain: 'virtual-dance-floor.firebaseapp.com',
  databaseURL: 'https://virtual-dance-floor.firebaseio.com',
  projectId: 'virtual-dance-floor',
  storageBucket: 'virtual-dance-floor.appspot.com',
  messagingSenderId: '542923101372'
};

