//All other dancers that are not yourself

const Participant = () => {
  //WHAT'S DIFFERENT
  //Loaded or done
  //When writing to firebase we are writing to an array of joints
  //When we receive data from FB we reset the joints array
  //Data from firebase is an array of joints that we loop through in the _drawPose
  //Participants don't need posenet

  //WHAT'S THE SAME
  //pose, color, userId
  
  let _id = null;
  let _pose = null; 
  let color = [100]; 

  const findPosition = () => { 
    firebase
    .database()
    .ref(`users/${_id}`)
    .once('value')
    .then(snapshot => {
      _pose = snapshot.val().pose; 
      // _drawPose(snapshot.val().pose, { color })
    });  
  }
  const update = () => {
      console.log('pose', _pose )
    _drawPose(_pose, {color})
    findPosition()
  

    // ÷if (_pose.leftAnkle.x != null) _drawPose(_pose, { color })
      // _drawPose(_pose, { color })
  }

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
    // console.log('drawing head', pose); 
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
    console.log('drawing pose participant',  pose, args); 
    if (args == undefined) { args = {} }
    if (args.color == undefined) { args.color = [255, 255, 255] }

    push();
    colorMode(HSB, 255);
    stroke.apply(this, args.color);
    strokeWeight(4);
    strokeJoin(ROUND);
    fill(255);

    _drawBones([pose.leftShoulder, pose.rightShoulder, pose.rightHip, pose.leftHip, pose.leftShoulder]);
    _drawBones([pose.leftShoulder, pose.leftElbow, pose.leftWrist]);
    _drawBones([pose.rightShoulder, pose.rightElbow, pose.rightWrist]);
    _drawBones([pose.leftHip, pose.leftKnee, pose.leftAnkle]);
    _drawBones([pose.rightHip, pose.rightKnee, pose.rightAnkle]);

    _drawHead(pose);
    _drawFace(pose);
  }

  return {
    update, 
    get id(){ 
      return _id; 
    },
    set id(id){ 
      _id = id; 
    }, 
    set pose(pose){ 
      _pose = pose; 
    }
  }
}