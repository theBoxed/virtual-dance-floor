const SkeletonPrediction = new function() {
  this.video = null;
  this.poseNet = null;
  this.pose0 = null;
  this.posenet_objs = [];
  this.track_smooth = 0.3;

  this.init = function(){
    console.log('init');
    this.video = createCapture(VIDEO);
    this.video.size(width, height);
  
    function modelReady(){
      select('#status').html('Model Loaded');
    }

    this.poseNet = ml5.poseNet(this.video, modelReady);

    var self = this;

    this.poseNet.on('pose', function(results){
      self.update(results);
    });
    // this.video.hide();
  }

  this.convert = function(posenet_obj){
    let result = {};
    let kPoints = posenet_obj.pose.keypoints;
    console.log('kPoints', kPoints);
    for (let i = 0; i < kPoints.length; i++) {
      console.log(result);
      result[kPoints[i].part] = {
        x: width-kPoints[i].position.x,
        y: kPoints[i].position.y
      }
    }
    return result;
  }

  this.smoothPose = function(poseA, poseB, alpha){
    for(let k in poseB) {
      if(isNaN(poseA[k].x)) {
        poseA[k].x = poseB[k].x;
      } else {
        lerp(poseA[k].x, poseB[k].x, alpha)
      }

      if (isNaN(poseA[k].y)) {
        poseA[k].y = newPose[k].y;
      } else {
        lerp(poseA[k].y, poseB[k].y, alpha)
      }
    }
  }

  this.update = function(results){
    console.log('update', results);
    console.log('posenet_objs', this.posenet_objs)
    this.posenet_objs = results;
    console.log('results.length', results.length);
    if(results.length > 0) {
      let newPose = this.convert(this.getLargestPosenetObj(results));
      console.log('newPose', newPose);
      if(this.pose0 === null) {
        this.pose0 = newPose;
      } else {
        this.smoothPose(this.pose0, newPose, this.track_smooth);
      }
    }
  }


  this.getLargestPosenetObj = function(objs){
    let maxI = 0;
    let maxD = 0;
    for(let i = 0; i < objs.length; i++){
      let kPoints = objs[i].pose.keypoints;
      let nose = kPoints[0];
      let leftEye = kPoints[1];
      let d = dist(nose.x, nose.y, leftEye.x, leftEye.y);
      if(d > maxD) {
        maxD = d;
        maxI = i;
      }
    }
    return objs[maxI];
  }

  this.get = function(){ return this.pose0};

  this.draw = function(){
    if(this.pose0 !== null) this.drawPose(this.get());
  }

  this.estimateScale = function(pose) {
    return dist(pose.nose.x, pose.nose.y, pose.leftEye.x, pose.leftEye.y); 
  } 

  this.drawBones = function() {
    beginShape();
    for(let i = 0; i < arguments.length; i++) {
      vertex(arguments[i].x, arguments[i].y)
    }
    endShape();
  }

  this.drawHead =  function(pose){ //round arc from ear to ear then a straight line down
    var ang = atan2(pose.leftEar.y - pose.rightEar.y, pose.leftEar.x - pose.rightEar.x);
    var r = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y);
    arc((pose.leftEar.x + pose.rightEar.x) / 2, (pose.leftEar.y + pose.rightEar.y) / 2, r, r, ang, ang + PI);
    var neck = { x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2, y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2, }
    line(pose.leftEar.x, pose.leftEar.y, neck.x, neck.y);
    line(pose.rightEar.x, pose.rightEar.y, neck.x, neck.y);
  }

  this.drawPose = function (pose, args) {
    if (args == undefined) { args = {} }
    if (args.color == undefined) { args.color = [255, 255, 255] }

    push();

    colorMode(HSB, 255);
    stroke.apply(this, args.color);
    strokeWeight(4);

    strokeJoin(ROUND);

    noFill();

    this.drawBones(pose.leftShoulder, pose.rightShoulder, pose.rightHip, pose.leftHip, pose.leftShoulder);

    this.drawBones(pose.leftShoulder, pose.leftElbow, pose.leftWrist);

    this.drawBones(pose.rightShoulder, pose.rightElbow, pose.rightWrist);

    this.drawBones(pose.leftHip, pose.leftKnee, pose.leftAnkle);
    this.drawBones(pose.rightHip, pose.rightKnee, pose.rightAnkle);

    this.drawHead(pose);

    var s = this.estimateScale(pose);

    fill(0);
    ellipse(pose.leftEye.x, pose.leftEye.y, s * 0.8, s * 0.8);
    ellipse(pose.rightEye.x, pose.rightEye.y, s * 0.8, s * 0.8);
    ellipse(pose.nose.x, pose.nose.y, s * 0.5, s * 0.5);
    pop();
  }

}



// (() => {   
//   //The imageScaleFactor determines by how much the image is scaled down. 
//   //The lower the value the more scaled down the image is.
//   //Making the prediction faster but at a cost of accuracy. 
//   const imageScaleFactor = 0.5; 
//   //The outputStrude determines how by how much the output gets scaled down relative to the input image size. 
//   //The higher the value the smaller the resolution of the layers the model outputs. 
//   const outputStride = 16; 
//   const flipHorizontal = false; 

//   const webcam = document.getElementById('webcam');

//   const load = () => { 
//     return new Promise((resolve, reject) => { 
//       navigator.mediaDevices.getUserMedia({video : true})
//         .then((stream) => webcam.srcObject = stream)
//         .then(() => posenet.load())
//         .then(net => resolve(net))
//         .catch(error => reject(error));  
//     })
//   }

//   const predictPose = (net) => { 
//     net.estimateSinglePose(webcam, imageScaleFactor, flipHorizontal, outputStride)
//       .then((poseEstimate => { 
//         console.log('poseEstimate', poseEstimate); 
//         //calls posenet once first frame is predicted
//         predictPose(net); 
//       })); 
//   }

//   const showCamera = () => { 
//     const loadingText = document.getElementById('loading-text'); 
//     loadingText.classList.add('hidden'); 
//     webcam.classList.remove('hidden'); 
//     webcam.classList.add('visible'); 
//   }

//   if(navigator.mediaDevices.getUserMedia) { 
//     load()
//       .then(loadedPosenet => { 
//         showCamera(); 
//         predictPose(loadedPosenet); 
//     }); 
//   }
// })(); 
