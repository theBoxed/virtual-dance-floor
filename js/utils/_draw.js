const _draw = () => { 
  let verticalOffset = -100; 
  const _estimateSize = (pose) => {
    return dist(pose.nose.x, pose.nose.y, pose.leftEye.x, pose.leftEye.y);
  }

  const _drawBones = arguments => {
    beginShape()
    for (let i = 0; i < arguments.length; i++) {
      vertex(arguments[i].x, arguments[i].y);
    }
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

  const drawPose = (pose, leftButton, rightButton, args ) => {
    if (args == undefined) { args = {} }
    if (args.color == undefined) { args.color = [255, 255, 255] }

    push(); 
    colorMode(HSB, 255);
    stroke.apply(this, args.color);
    strokeWeight(4);
    strokeJoin(ROUND);
    fill(255);
    
    if (leftButton) { 
      leftButton.size(40, 20); 
      leftButton.position(pose.leftEar.x, pose.leftEar.y + verticalOffset); 
      rightButton.size(40, 20); 
      rightButton.position(pose.leftEar.x + 50, pose.leftEar.y + verticalOffset); 
    }

    _drawBones([pose.leftShoulder, pose.rightShoulder, pose.rightHip, pose.leftHip, pose.leftShoulder]);
    _drawBones([pose.leftShoulder, pose.leftElbow, pose.leftWrist]);
    _drawBones([pose.rightShoulder, pose.rightElbow, pose.rightWrist]);
    _drawBones([pose.leftHip, pose.leftKnee, pose.leftAnkle]);
    _drawBones([pose.rightHip, pose.rightKnee, pose.rightAnkle]);

    _drawHead(pose);
    _drawFace(pose);
  }

  return { drawPose }; 
}