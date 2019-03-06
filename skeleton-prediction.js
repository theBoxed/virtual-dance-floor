//The imageScaleFactor determines by how much the image is scaled down. 
//The lower the value the more scaled down the image is.
//Making the prediction faster but at a cost of accuracy. 
const imageScaleFactor = 0.5; 
//The outputStrude determines how by how much the output gets scaled down relative to the input image size. 
//The higher the value the smaller the resolution of the layers the model outputs. 
const outputStride = 16; 
const flipHorizontal = false; 

const webcam = document.getElementById('webcam');

const loadWebcam = () => { 
  if(navigator.mediaDevices.getUserMedia) { 
    navigator.mediaDevices.getUserMedia({video : true})
      .then(stream => webcam.srcObject = stream); 
  }
}

loadWebcam(); 

// posenet.load().then(net => { 
//   return net.estimateSinglePose(catImage, imageScaleFactor, flipHorizontal, outputStride)
// }).then(pose => { 
//   console.log('pose', pose); 
// })