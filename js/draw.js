const Draw = new function() {
  this.video = null;
  this.poseNet = null;
  this.pose0 = null;
  this.posenetObjs = [];
  this.trackSmooth = 0.3;

  this.begin = function(){
    this.video = createCapture(VIDEO);
    this.video.size(width, height);


    this.poseNet = ml5.poseNet(this.video);

    var self = this;

    this.poseNet.on('pose', function (results) {
      self.updatePose(results);
    });

    this.video.hide();
  }

  this.convertPose = function (posenet_obj) {
    var result = {}
    var kpts = posenet_obj.pose.keypoints
    for (var i = 0; i < kpts.length; i++) {
      result[kpts[i].part] = {
        x: width - kpts[i].position.x,
        y: kpts[i].position.y
      }
    }
    return result;
  }

  this.lerpPose = function (poseA, poseB, t) {
    for (var k in poseB) {
      if (isNaN(poseA[k].x)) {
        poseA[k].x = poseB[k].x
      } else {
        poseA[k].x = lerp(poseA[k].x, poseB[k].x, t);
      }
      if (isNaN(poseA[k].y)) {
        poseA[k].y = poseB[k].y
      } else {
        poseA[k].y = lerp(poseA[k].y, poseB[k].y, t);
      }
    }

  }

  this.updatePose = function (results) {
    this.posenetObjs = results;
    if (results.length > 0) {
      var newPose = this.convertPose(this.getLargestPosenetObj(results));
      if (this.pose0 == null) {
        this.pose0 = newPose
      } else {
        this.lerpPose(this.pose0, newPose, this.trackSmooth);

      }
    }
  }
  this.getLargestPosenetObj = function (objs) {
    var max_i = 0;
    var max_d = 0;
    for (var i = 0; i < objs.length; i++) {
      var kpts = objs[i].pose.keypoints;
      var nose = kpts[0]
      var leftEye = kpts[1]
      var d = dist(nose.x, nose.y, leftEye.x, leftEye.y);
      if (d > max_d) {
        max_d = d;
        max_i = i;
      }
    }
    return objs[max_i];
  }

  this.getPose = function () {
    return this.pose0;
  }

  this.estimateSize = function (pose) {
    return dist(pose.nose.x, pose.nose.y, pose.leftEye.x, pose.leftEye.y);

  }

  this.drawBones = function () {
    beginShape()
    for (var i = 0; i < arguments.length; i++) {
      vertex(arguments[i].x, arguments[i].y);
    }
    endShape()
  }

  this.drawHead = function (pose) {

    var ang = atan2(pose.leftEar.y - pose.rightEar.y, pose.leftEar.x - pose.rightEar.x);
    var r = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y);
    arc((pose.leftEar.x + pose.rightEar.x) / 2, (pose.leftEar.y + pose.rightEar.y) / 2, r, r, ang, ang + PI);
    var neck = { x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2, y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2, }
    line(pose.leftEar.x, pose.leftEar.y, neck.x, neck.y);
    line(pose.rightEar.x, pose.rightEar.y, neck.x, neck.y);
    fill(255);
  }

  this.drawFace = function(pose){

    var s = this.estimateSize(pose);
    fill(255);
    ellipse(pose.leftEye.x, pose.leftEye.y, s * 0.8, s * 0.8);
    ellipse(pose.rightEye.x, pose.rightEye.y, s * 0.8, s * 0.8);
    ellipse(pose.nose.x, pose.nose.y, s * 0.5, s * 0.5);
    pop();
  }


  this.drawPose = function (pose, args) {
    if (args == undefined) { args = {} }
    if (args.color == undefined) { args.color = [255, 255, 255] }

    push();
    colorMode(HSB, 255);
    stroke.apply(this, args.color);
    strokeWeight(4);
    strokeJoin(ROUND);
    fill(255);

    this.drawBones(pose.leftShoulder, pose.rightShoulder, pose.rightHip, pose.leftHip, pose.leftShoulder);

        this.drawBones(pose.leftShoulder, pose.leftElbow, pose.leftWrist);

        this.drawBones(pose.rightShoulder, pose.rightElbow, pose.rightWrist);

        this.drawBones(pose.leftHip, pose.leftKnee, pose.leftAnkle);
        this.drawBones(pose.rightHip, pose.rightKnee, pose.rightAnkle);

        this.drawHead(pose);


    this.drawFace(pose);
  }

  
}();