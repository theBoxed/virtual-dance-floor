let local, socket;
let world = [];

function setup(){ 
  socket = io();
  console.log('socket', socket);
  //p5js - creates a canvas element in the document and sets the dimensions of it in pixels
  createCanvas(800, 600);
  //p5js - sets the color used for the background of the canvas.
  background(0);

  SkeletonPrediction.init();
  //Initialize posenet webcam

  local = new Dancer();
  console.log('Local', local);

  socket.emit('game-start', local.data);

  socket.on('heartbeat', function(data){ 
    console.log('heartbeat', data);
    world = data 
  });
}

function draw(){
  background(0);

  local.update(SkeletonPrediction.get());

  if(local.data.pose !== null) {
    SkeletonPrediction.drawPose(local.data.pose, {color: local.data.color})
  }

  socket.emit('game-update', local.data);

  // for(let i = 0; i < world.length; i++) {
  //   if(world[i].id === socket.id) {
  //     continue;
  //   };

  //   if(world[i].data.pose !== null){
  //     SkeletonPrediction.drawPose(world[i].data.pose, {color: world[i].data.color});
  //   }
  // }
}

