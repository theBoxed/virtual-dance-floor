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

  //TODO: find other dancers
  // My browser tells firebase I Joined - done in dancer.update()
  // Firebase says awesome, confirmed and here is everyone you're with
  firebase
    .database()
    .ref('users/')
    .once('value')
    .then((world)=> {
      for(let user in world.val()){
        // console.log('USER',  user )
        // console.log('getUserId',dancer.getUserId());
        if(user !== dancer.getUserId()) {
          // console.log('userID', user);
          let currParticipant = Participant();
          currParticipant.initialize(world.val()[user], user)
          participants.push(currParticipant);
        }
      }
      // console.log('parts', participants);
      return participants;
    })
   
}

//Clears canvas, and re-draws dancer
function draw() {
  // update dancer skeleton
  // draw the skeleton if pose !== null
  //update firebase
  //draw all other user skeletons
  //loop through dancers.
  //
  // console.log('part -54', participants);
  background(0);
  dancer.update();

  // firebase
  //   .database()
  //   .ref('users/')
  //   .once('value')
  //   .then(snapshot => {
  //     // console.log('snapshot', snapshot.val());
  //   });

  //TODO: loop through other dancers and draw them
 

  for(let i = 0; i < participants.length; i++){
    console.log(participants[i].getUserId());
    if(participants[i].getUserId() !== null) {
      console.log(participants[i]);
      participants[i].update();
    }
    // Participa().update();
    // if(participants[i].userId ===)
  }

}

var config = {
  apiKey: 'AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag',
  authDomain: 'virtual-dance-floor.firebaseapp.com',
  databaseURL: 'https://virtual-dance-floor.firebaseio.com',
  projectId: 'virtual-dance-floor',
  storageBucket: 'virtual-dance-floor.appspot.com',
  messagingSenderId: '542923101372'
};

window.addEventListener('beforeunload', function(e) {
  noLoop();
  var confirmationMessage = 'o/';
  dancer.done = true;

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  dancer.remove();
  return confirmationMessage; //Webkit, Safari, Chrome
});
