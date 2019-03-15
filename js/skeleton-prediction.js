let dancer;
let dancers = []; 

//Sets up the canvas and initializes the video.
function setup() {
  createCanvas(800, 600);
  background(0);

  //sets up dancer
  let userId = Math.floor(Math.random() * 40000); 
  dancer = Dancer(userId);
  console.log('dancer userId', dancer.userId); 

  //sets up firebase
  firebase.initializeApp(config);

  //sets up camera - initializes the video
  Scene().start();
  dancer = Dancer(userId); 
}

function draw() {
  background(0);
  
  dancer.update();
}

window.onbeforeunload = function (event) {
  var message = 'Important: Please click on \'Save\' button to leave this page.';
  if (typeof event == 'undefined') {
      event = window.event;
  }
  if (event) {
      //Browser window is closing
      event.returnValue = message;
  }
  return message;
};