function Dancer(x, y) {
  this.data = {
    position: {x: 0, y: 0},
    pose: null,
    color: [random(255, 100, 255)]
  }

  this.update = function(pose){
    this.data.pose = pose
  }
}