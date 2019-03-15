  let local;

  //Sets up the canvas and initializes the video.
  function setup() {
    createCanvas(800, 600);
    background(0);

    Draw.begin();
    local = new Dancer();
  }

  function draw() {
    background(0);
    local.update(Draw.getPose());
    if (local.data.pose != null) {
      writeUserData(local.data.pose); 
      Draw.drawPose(local.data.pose, { color: local.data.color });
    }
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