const Dancer = (id, x, y) => { 
  let userId = id; 
  let position = { x, y }; 
  let pose = null; 
  let color = [100]; 
  let posenetObjs = [];
  let trackSmooth = 0.3;

  const update = (currPose) => { 
    // console.log('do we get here?', currPose); 
    if (pose != null) {
      writeUserData(local.data.pose);
      pose = currPose;
      firebase.database().ref(`users/userId:${dancer.userId}`).set({pose0});
      drawPose(pose0, { color });
    }
  }

  const convertPose = (posenet_obj) => { 
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

  const lerpPose = (poseA, poseB, t) => {
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

  const initializeDancer = poseNet => { 
    poseNet.on('pose', results => { 
      updatePose(results); 
    });  
  }

  const updatePose = (results) => {
    posenetObjs = results;
    console.log('results', results); 
    if (results.length > 0) {
      var newPose = convertPose(getLargestPosenetObj(results));
      if (pose0 == null) {
        pose0 = newPose
      } else {
        lerpPose(pose0, newPose, trackSmooth);
      }
    }
  }

  const getLargestPosenetObj = (objs) => {
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

  const getPose = () => {
    return pose0;
  }

  const estimateSize = (pose) => {
    return dist(pose.nose.x, pose.nose.y, pose.leftEye.x, pose.leftEye.y);
  }

  const drawBones = () => {
    beginShape()
    for (var i = 0; i < arguments.length; i++) {
      vertex(arguments[i].x, arguments[i].y);
    }
    endShape()
  }

  const drawHead = (pose) => {
    var ang = atan2(pose.leftEar.y - pose.rightEar.y, pose.leftEar.x - pose.rightEar.x);
    var r = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y);
    arc((pose.leftEar.x + pose.rightEar.x) / 2, (pose.leftEar.y + pose.rightEar.y) / 2, r, r, ang, ang + PI);
    var neck = { x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2, y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2, }
    line(pose.leftEar.x, pose.leftEar.y, neck.x, neck.y);
    line(pose.rightEar.x, pose.rightEar.y, neck.x, neck.y);
    fill(255);
  }

  const drawFace = (pose) => {
    var s = estimateSize(pose);
    fill(255);
    ellipse(pose.leftEye.x, pose.leftEye.y, s * 0.8, s * 0.8);
    ellipse(pose.rightEye.x, pose.rightEye.y, s * 0.8, s * 0.8);
    ellipse(pose.nose.x, pose.nose.y, s * 0.5, s * 0.5);
    pop();
  }

  const getUserId = () => { 
    return userId; 
  }

  return { update, initializeDancer }; 
}