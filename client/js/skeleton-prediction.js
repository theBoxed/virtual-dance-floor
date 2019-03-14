  let local;
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
      Draw.drawPose(local.data.pose, { color: local.data.color });
    }
  }
