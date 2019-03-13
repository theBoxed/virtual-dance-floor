// const draw = (() => {
//   //Skeleton Variables
//   const color = 'blue';
//   const lineWidth = 4;
//   let posenetObjs = [];
//   let pose0 = null;
//   let trackSmooth = 0.3;

//   function toTuple({y,x}) {
//    return [y, x];
//   }

//   function drawPoint(ctx, y, x, r, color) {
//     ctx.beginPath();
//     ctx.arc(x, y, r, 0, 2*Math.PI);
//     ctx.fillStyle = color;
//     ctx.fill();
//   }

//   function drawSegment([ay, ax], [by, bx], color, scale, ctx) {

//     ctx.beginPath();
//     ctx.moveTo(ax * scale, ay * scale);
//     ctx.lineTo(bx * scale, by * scale);
//     ctx.lineWidth = lineWidth;
//     ctx.strokeStyle = color;
//     ctx.stroke();
//   }

//   function drawSkeleton(keypoints, minPartConfidence, ctx, scale = 1) {
//     const adjacentKeyPoints =
//       posenet.getAdjacentKeyPoints(keypoints, minPartConfidence);
// console.log(adjacentKeyPoints);
//     adjacentKeyPoints.forEach((keypoints) => {
//       drawSegment(
//         toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
//         scale, ctx);
//     });
//   }

//   function drawKeypoints(keypoints, minPartConfidence, ctx, scale = 1) {
//     for (let i = 0; i < keypoints.length; i++) {
//       const keypoint = keypoints[i];

//       if(keypoint.score < minPartConfidence) continue;

//       const { y, x } = keypoint.position;
//       drawPoint(ctx, y * scale, x * scale, 3, color);
//     }
//   }

//   // function getLargestPose(objs){
//   //   let maxI = 0;
//   //   let maxD = 0;
//   //   for(let i = 0; i < objs.length; i++){
//   //     let kpts = objs[i].pose.keypoints;
//   //     let nose = kpts[0];
//   //     let leftEye = kpts[1];
//   //     let d = dist(nose.x, nose.y, leftEye.x, leftEye.y);
//   //     if(d>maxD){
//   //       maxD = d;
//   //       maxI = i;
//   //     }
//   //   }
//   //   return objs[maxI];
//   // }

//   // function smoothPose(poseA, poseB, t){
//   //   for(let k in poseB){
//   //     if(isNaN(poseA[k].x)){
//   //       poseA[k].x = poseB[k].x;
//   //     } else {
//   //       poseA[k].x = lerp(poseA[k].x, poseB[k].x, t);
//   //     }
//   //     if(isNaN(poseA[k].y)){
//   //       poseA[k].y = newPose[k].y
//   //     } else {
//   //       poseA[k].y = lerp(poseA[k].y, poseB[k].y, t);
//   //     }
//   //   }
//   // }

//   // function updatePoseRealTime(results){
//   //   posenetObjs = results;
//   //   if(results.length > 0) {
//   //     let newPose = organizePose(getLargestPose(results));
//   //     if(pose0 === null){
//   //       pose0 = newPose
//   //     }else {
//   //       smoothPose(pose0, newPose, trackSmooth)
//   //     }
//   //   }
//   // }

//   return {
//     drawKeypoints,
//     drawSkeleton
//   }
// })();

const Draw = new function() {
  this.pose0 = null;
  this.posenetObjs = [];
  this.trackSmooth = 0.3;
  this.poseNet = null;
  this.width = null;

  this.setup = function(results, ctx) {
    let self = this;
    this.width = ctx.canvas.width;
    self.updatePose(results);
  };

  this.lerp = function(position, targetPosition) {
    position += (targetPosition - position) * 0.02;
  };

  this.smoothPose = function(poseA, poseB, t) {
    for (let k in poseB) {
      if (isNaN(poseA[k].x)) {
        poseA[k].x = poseB[k].x;
      } else {
        poseA[k].x = this.lerp(poseA[k].x, poseB[k].x, t);
      }
      if (isNaN(poseA[k].y)) {
        poseA[k].y = poseB[k].y;
      } else {
        poseA[k].y = this.lerp(poseA[k].y, poseB[k].y, t);
      }
    }
  };

  this.organizePose = function(posenetObj) {
    let result = {};
    let kpts = posenetObj.keypoints;
    for (let i = 0; i < kpts.length; i++) {
      result[kpts[i].part] = {
        x: this.width - kpts[i].position.x,
        y: kpts[i].position.y
      };
    }
    return result;
  };

  this.updatePose = function(results) {
    this.posenetObjs = results;
    if (results.length > 0) {
      let newPose = this.organizePose(this.getLargestPose(results));
      if (this.pose0 === null) {
        this.pose0 = newPose;
      } else {
        // console.log('NEW POSe', newPose);
        this.smoothPose(this.pose0, newPose, this.trackSmooth);
      }
    }
  };

  this.getLargestPose = function(objs) {
    let maxI = 0;
    let maxD = 0;
    for (let i = 0; i < objs.length; i++) {
      let kpts = objs[i].keypoints;
      let nose = kpts[0];
      let leftEye = kpts[1];
      let dist = Math.sqrt(
        Math.pow(nose.x - leftEye.x, 2) + Math.pow(nose.y - leftEye.y, 2)
      );
      // let d = dist(nose.x, nose.y, leftEye.x, leftEye.y);
      if (dist > maxD) {
        maxD = dist;
        maxI = i;
      }
    }
    return objs[maxI];
  };

  this.get = function() {
    return this.pose0;
  };

  // this.draw = function(){
  //   console.log('DRAW');
  //   if(this.pose0 !== null){
  //     this.drawPose(this.get(), ctx)
  //   }
  // }

  this.drawBones = function(bones, ctx) {
    ctx.beginPath();
    let i = 0;
    while (i < bones.length) {
      ctx.lineTo(bones[i].x, bones[i].y);
      i++;
    }
    bones.length === 4 ? ctx.closePath() : null;
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  };

  this.estimateSize = function(pose) {

    return Math.sqrt(
      Math.pow(pose.nose.x - pose.leftEye.x, 2) + Math.pow(pose.nose.y - pose.leftEye.y, 2)
    );
    };

  this.drawHead = function(pose, ctx) {
    let ang = Math.atan2(
      pose.leftEar.y - pose.rightEar.y,
      pose.leftEar.x - pose.rightEar.x
    );
    let radius = Math.sqrt(
      Math.pow(pose.leftEar.x - pose.rightEar.x, 2) +
        Math.pow(pose.leftEar.y - pose.rightEar.y, 2)
    );
    ctx.beginPath();
    ctx.fillStyle = '#ffe4c4';
    ctx.arc(
      (pose.leftEar.x + pose.rightEar.x) / 2,
      (pose.leftEar.y + pose.rightEar.y) / 2,
      radius,
      radius,
      ang,
      ang + Math.PI
    );
    let neck = {
      x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2,
      y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2
    };
    ctx.moveTo(neck.x, neck.y);
    ctx.lineTo(pose.leftEar.x, pose.leftEar.y);
    ctx.moveTo(neck.x, neck.y);
    ctx.lineTo(pose.rightEar.x, pose.rightEar.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.fill();
  };

  this.drawFace = function(pose, ctx, size) {
    let scale = size * 0.8;
    ctx.beginPath();
    ctx.fillStyle = 'purple';
    ctx.lineWidth = 3;
    ctx.arc(pose.leftEye.x, pose.leftEye.y, scale, scale, true);
    ctx.fill();
    ctx.arc(pose.rightEye.x, pose.rightEye.y, scale, scale, true);
    ctx.fill();
    ctx.arc(pose.nose.x, pose.nose.y, size*0.5, size*0.5,true);
    ctx.fill();
  };

  this.drawPose = function(pose, ctx) {
    const {
      leftShoulder,
      rightShoulder,
      rightHip,
      leftHip,
      leftElbow,
      leftWrist,
      rightElbow,
      rightWrist,
      leftKnee,
      leftAnkle,
      rightKnee,
      rightAnkle
    } = pose;
    let upperBody = [leftShoulder, rightShoulder, rightHip, leftHip];
    let rightUpper = [rightShoulder, rightElbow, rightWrist];
    let leftUpper = [leftShoulder, leftElbow, leftWrist];
    let leftLower = [leftHip, leftKnee, leftAnkle];
    let rightLower = [rightHip, rightKnee, rightAnkle];

    this.drawBones(upperBody, ctx);
    this.drawBones(rightUpper, ctx);
    this.drawBones(leftUpper, ctx);
    this.drawBones(rightLower, ctx);
    this.drawBones(leftLower, ctx);
    this.drawHead(pose, ctx);

    let size = this.estimateSize(pose);

    this.drawFace(pose, ctx, size);

  };
}();
