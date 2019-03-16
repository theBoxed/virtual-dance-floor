const Dancer = (id, x, y) => { 
  let userId = id; 
  let pose = null; 
  let pose0 = null; 
  let color = [100]; 
  let trackSmooth = 0.3;
  let loaded = false; 

  const update = () => { 
    if (!pose && loaded) {
      firebase.database().ref(`users/userId:${userId}`).set({pose0});
      _drawPose(pose0, { color });
    }
  }

  const initializeDancer = poseNet => { 
    userId = Math.floor(Math.random() * 40000); 
    poseNet.on('pose', results => { 
      loaded = true; 
      _updatePose(results); 
    });  
  }

  const _convertPose = (posenet_obj) => { 
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

  const _lerpPose = (poseA, poseB, t) => {
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

  const _updatePose = (results) => {
    posenetObjs = results;
    if (results.length > 0) {
      var newPose = _convertPose(_getLargestPosenetObj(results));
      if (pose0 == null) {
        pose0 = newPose
      } else {
        _lerpPose(pose0, newPose, trackSmooth);
      }
    }
  }

  const _getLargestPosenetObj = (objs) => {
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

  const _estimateSize = (pose) => {
    return dist(pose.nose.x, pose.nose.y, pose.leftEye.x, pose.leftEye.y);
  }

  const _drawBones = () => {
    beginShape()
    endShape()
  }

  const _drawHead = (pose) => {
    var ang = atan2(pose.leftEar.y - pose.rightEar.y, pose.leftEar.x - pose.rightEar.x);
    var r = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y);
    arc((pose.leftEar.x + pose.rightEar.x) / 2, (pose.leftEar.y + pose.rightEar.y) / 2, r, r, ang, ang + PI);
    var neck = { x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2, y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2, }
    line(pose.leftEar.x, pose.leftEar.y, neck.x, neck.y);
    line(pose.rightEar.x, pose.rightEar.y, neck.x, neck.y);
    fill(255);
  }

  const _drawFace = (pose) => {
    var s = _estimateSize(pose);
    fill(255);
    ellipse(pose.leftEye.x, pose.leftEye.y, s * 0.8, s * 0.8);
    ellipse(pose.rightEye.x, pose.rightEye.y, s * 0.8, s * 0.8);
    ellipse(pose.nose.x, pose.nose.y, s * 0.5, s * 0.5);
    pop();
  }

  const _drawPose = (pose, args) => {
    if (args == undefined) { args = {} }
    if (args.color == undefined) { args.color = [255, 255, 255] }

    push();
    colorMode(HSB, 255);
    stroke.apply(this, args.color);
    strokeWeight(4);
    strokeJoin(ROUND);
    fill(255);

    _drawBones(pose.leftShoulder, pose.rightShoulder, pose.rightHip, pose.leftHip, pose.leftShoulder);

        _drawBones(pose.leftShoulder, pose.leftElbow, pose.leftWrist);

        _drawBones(pose.rightShoulder, pose.rightElbow, pose.rightWrist);

        _drawBones(pose.leftHip, pose.leftKnee, pose.leftAnkle);
        _drawBones(pose.rightHip, pose.rightKnee, pose.rightAnkle);

        _drawHead(pose);

    _drawFace(pose);
  }

  return { update, initializeDancer }; 
}