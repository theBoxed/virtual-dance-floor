const Dancer = (id, x, y) => { 
  let userId = id; 
  let pose = null; 
  let color = [100]; 
  let loaded = false; 

  const update = () => { 
    if (loaded) {
      //write pose to firebase
      firebase.database().ref(`users/userId:${userId}`).set({pose});
      //draw pose
      _drawPose(pose, { color });
    }
  }

  const initializeDancer = poseNet => { 
    //set up random userid
    userId = Math.floor(Math.random() * 40000); 

    //contiously find new pose
    poseNet.on('pose', results => { 
      loaded = true; 
      _updatePose(results); 
    });  
  }

  const _convertPose = (posenet_obj) => { 
    let result = {}
    let kpts = posenet_obj.pose.keypoints
    for (let i = 0; i < kpts.length; i++) {
      result[kpts[i].part] = {
        x: width - kpts[i].position.x,
        y: kpts[i].position.y
      }
    }
    return result;
  }

  const _lerpPose = (poseA, poseB, t) => {
    for (let k in poseB) {
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
      let newPose = _convertPose(_getLargestPosenetObj(results));
      if (pose == null) {
        pose = newPose
      } else {
        _lerpPose(pose, newPose, 0.3);
      }
    }
  }

  const _getLargestPosenetObj = (objs) => {
    let max_i = 0;
    let max_d = 0;
    for (let i = 0; i < objs.length; i++) {
      let kpts = objs[i].pose.keypoints;
      let nose = kpts[0]
      let leftEye = kpts[1]
      let d = dist(nose.x, nose.y, leftEye.x, leftEye.y);
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
    let ang = atan2(pose.leftEar.y - pose.rightEar.y, pose.leftEar.x - pose.rightEar.x);
    let r = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y);
    arc((pose.leftEar.x + pose.rightEar.x) / 2, (pose.leftEar.y + pose.rightEar.y) / 2, r, r, ang, ang + PI);
    let neck = { x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2, y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2, }
    line(pose.leftEar.x, pose.leftEar.y, neck.x, neck.y);
    line(pose.rightEar.x, pose.rightEar.y, neck.x, neck.y);
    fill(255);
  }

  const _drawFace = (pose) => {
    let s = _estimateSize(pose);
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