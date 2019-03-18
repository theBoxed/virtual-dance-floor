const _poseNet = () => { 
  const poseNet = {}; 
  poseNet._updatePose = (results) => {
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
  return { poseNet }
}