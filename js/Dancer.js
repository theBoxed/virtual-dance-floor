function Dancer(x, y) {
  this.data = {
    position: { x: 0, y: 0 },
    pose: null,
    color: [100]
  }

  this.update = function (pose) {
    this.data.pose = pose;
  }

}