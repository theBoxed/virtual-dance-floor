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

  // smoothens the movement
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

    this.posenet_objs = results;
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
    console.log('howdy');
    return this.pose0;
  }

  this.draw = function () {
    console.log('hello');
    if (this.pose0 != null) {
      this.drawPose(this.getPose());
    }
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

  // this.setup = function(results, ctx) {
  //   let self = this;
  //   this.width = ctx.canvas.width;
  //   self.updatePose(results);
  // };

  // this.lerp = function(position, targetPosePosition) {
  //   position += (targetPosePosition - position) * 0.02;
  // };

  // this.smoothPose = function(poseA, poseB, t) {
  //   for (let k in poseB) {
  //     if (isNaN(poseA[k].x)) {
  //       poseA[k].x = poseB[k].x;
  //     } else {
  //       poseA[k].x = this.lerp(poseA[k].x, poseB[k].x, t);
  //     }
  //     if (isNaN(poseA[k].y)) {
  //       poseA[k].y = poseB[k].y;
  //     } else {
  //       poseA[k].y = this.lerp(poseA[k].y, poseB[k].y, t);
  //     }
  //   }
  // };

  // this.organizePose = function(posenetObj) {
  //   let result = {};
  //   let kpts = posenetObj.keypoints;
  //   for (let i = 0; i < kpts.length; i++) {
  //     result[kpts[i].part] = {
  //       x: this.width - kpts[i].position.x,
  //       y: kpts[i].position.y
  //     };
  //   }
  //   return result;
  // };

  // this.updatePose = function(results) {
  //   this.posenetObjs = results;
  //   if (results.length > 0) {
  //     let newPose = this.organizePose(this.getPoseLargestPose(results));
  //     if (this.pose0 === null) {
  //       this.pose0 = newPose;
  //     } else {
  //       // console.log('NEW POSe', newPose);
  //       this.smoothPose(this.pose0, newPose, this.trackSmooth);
  //     }
  //   }
  // };

  // this.getPoseLargestPose = function(objs) {
  //   let maxI = 0;
  //   let maxD = 0;
  //   for (let i = 0; i < objs.length; i++) {
  //     let kpts = objs[i].keypoints;
  //     let nose = kpts[0];
  //     let leftEye = kpts[1];
  //     let dist = Math.sqrt(
  //       Math.pow(nose.x - leftEye.x, 2) + Math.pow(nose.y - leftEye.y, 2)
  //     );
  //     // let d = dist(nose.x, nose.y, leftEye.x, leftEye.y);
  //     if (dist > maxD) {
  //       maxD = dist;
  //       maxI = i;
  //     }
  //   }
  //   return objs[maxI];
  // };

  // this.getPose = function() {
  //   return this.pose0;
  // };

  // // this.draw = function(){
  // //   console.log('DRAW');
  // //   if(this.pose0 !== null){
  // //     this.drawPose(this.getPose(), ctx)
  // //   }
  // // }

  // this.drawBones = function(bones, ctx) {
  //   ctx.beginPath();
  //   let i = 0;
  //   while (i < bones.length) {
  //     ctx.lineTo(bones[i].x, bones[i].y);
  //     i++;
  //   }
  //   bones.length === 4 ? ctx.closePath() : null;
  //   ctx.lineWidth = 4;
  //   ctx.strokeStyle = 'blue';
  //   ctx.stroke();
  // };

  // this.estimateSize = function(pose) {
  //   return Math.sqrt(
  //     Math.pow(pose.nose.x - pose.leftEye.x, 2) +
  //       Math.pow(pose.nose.y - pose.leftEye.y, 2)
  //   );
  // };

  // this.drawHead = function(pose, ctx) {
  //   let ang = Math.atan2(
  //     pose.leftEar.y - pose.rightEar.y,
  //     pose.leftEar.x - pose.rightEar.x
  //   );
  //   let radius = Math.sqrt(
  //     Math.pow(pose.leftEar.x - pose.rightEar.x, 2) +
  //       Math.pow(pose.leftEar.y - pose.rightEar.y, 2)
  //   );
  //   ctx.beginPath();
  //   ctx.fillStyle = '#ffe4c4';
  //   ctx.arc(
  //     (pose.leftEar.x + pose.rightEar.x) / 2,
  //     (pose.leftEar.y + pose.rightEar.y) / 2,
  //     radius,
  //     radius,
  //     ang,
  //     ang + Math.PI
  //   );
  //   let neck = {
  //     x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2,
  //     y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2
  //   };
  //   ctx.moveTo(neck.x, neck.y);
  //   ctx.lineTo(pose.leftEar.x, pose.leftEar.y);
  //   ctx.moveTo(neck.x, neck.y);
  //   ctx.lineTo(pose.rightEar.x, pose.rightEar.y);
  //   ctx.lineWidth = 4;
  //   ctx.strokeStyle = 'blue';
  //   ctx.stroke();
  //   ctx.fill();
  // };

  // this.drawFace = function(pose, ctx, size) {
  //   let scale = size * 0.8;
  //   ctx.beginPath();
  //   ctx.fillStyle = 'purple';
  //   ctx.lineWidth = 3;
  //   ctx.arc(pose.leftEye.x, pose.leftEye.y, scale, scale, true);
  //   ctx.fill();
  //   ctx.arc(pose.rightEye.x, pose.rightEye.y, scale, scale, true);
  //   ctx.fill();
  //   ctx.arc(pose.nose.x, pose.nose.y, size * 0.5, size * 0.5, true);
  //   ctx.fill();
  // };

  // this.drawPose = function(pose, ctx) {
  //   const {
  //     leftShoulder,
  //     rightShoulder,
  //     rightHip,
  //     leftHip,
  //     leftElbow,
  //     leftWrist,
  //     rightElbow,
  //     rightWrist,
  //     leftKnee,
  //     leftAnkle,
  //     rightKnee,
  //     rightAnkle
  //   } = pose;
  //   let upperBody = [leftShoulder, rightShoulder, rightHip, leftHip];
  //   let rightUpper = [rightShoulder, rightElbow, rightWrist];
  //   let leftUpper = [leftShoulder, leftElbow, leftWrist];
  //   let leftLower = [leftHip, leftKnee, leftAnkle];
  //   let rightLower = [rightHip, rightKnee, rightAnkle];

  //   this.drawBones(upperBody, ctx);
  //   this.drawBones(rightUpper, ctx);
  //   this.drawBones(leftUpper, ctx);
  //   this.drawBones(rightLower, ctx);
  //   this.drawBones(leftLower, ctx);
  //   this.drawHead(pose, ctx);

  //   let size = this.estimateSize(pose);

  //   this.drawFace(pose, ctx, size);
  // };
}();
