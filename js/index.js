let dancer;
let dancers = []; 

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

  //find other dancers
}

//Clears canvas, and re-draws dancer
function draw() {
  background(0);
  dancer.update();

  firebase.database().ref('users/').once('value').then(snapshot => { 
    console.log('snapshot', snapshot.val()); 
  });

  //loop through other dancers and draw them
}

var config = {
  apiKey: "AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag",
  authDomain: "virtual-dance-floor.firebaseapp.com",
  databaseURL: "https://virtual-dance-floor.firebaseio.com",
  projectId: "virtual-dance-floor",
  storageBucket: "virtual-dance-floor.appspot.com",
  messagingSenderId: "542923101372"
};

window.addEventListener("beforeunload", function (e) {
  noLoop(); 
  var confirmationMessage = "\o/";
  dancer.done = true; 

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  dancer.remove(); 
  return confirmationMessage;                            //Webkit, Safari, Chrome
});