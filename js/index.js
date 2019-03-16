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
}

//Clears canvas, and re-draws dancer
function draw() {
  background(0);
  dancer.update();
}

var config = {
  apiKey: "AIzaSyAqtz0eHO33noqIR6CMDPLvEs2dkqBf2Ag",
  authDomain: "virtual-dance-floor.firebaseapp.com",
  databaseURL: "https://virtual-dance-floor.firebaseio.com",
  projectId: "virtual-dance-floor",
  storageBucket: "virtual-dance-floor.appspot.com",
  messagingSenderId: "542923101372"
};

window.onbeforeunload = function (event) {
  dancer.delete(); 
  // var message = 'Important: Please click on \'Save\' button to leave this page.';
  // if (typeof event == 'undefined') {
  //     event = window.event;
  // }
  // if (event) {
  //     //Browser window is closing
  //     event.returnValue = message;
  // }
  // return message;
};