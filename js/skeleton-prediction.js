  let local;
  let world = [];

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