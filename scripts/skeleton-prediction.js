const predictSekeleton = (() => {   
  //The imageScaleFactor determines by how much the image is scaled down. 
  //The lower the value the more scaled down the image is.
  //Making the prediction faster but at a cost of accuracy. 
  const imageScaleFactor = 0.5; 
  //The outputStrude determines how by how much the output gets scaled down relative to the input image size. 
  //The higher the value the smaller the resolution of the layers the model outputs. 
  const outputStride = 16; 
  const flipHorizontal = false; 

  const webcam = document.getElementById('webcam');

  function load () { 
    return new Promise((resolve, reject) => { 
      navigator.mediaDevices.getUserMedia({video : true})
        .then((stream) => webcam.srcObject = stream)
        .then(() => posenet.load())
        .then(net => resolve(net))
        .catch(error => reject(error));  
    })
  }

  function predictPose (net) { 
    net.estimateSinglePose(webcam, imageScaleFactor, flipHorizontal, outputStride)
      .then((poseEstimate => { 
        console.log('poseEstimate', poseEstimate); 
        //calls posenet once first frame is predicted
        predictPose(net); 
      })); 
  }

  function showCamera () { 
    const loadingText = document.getElementById('loading-text'); 
    loadingText.classList.add('hidden'); 
    webcam.classList.remove('hidden'); 
    webcam.classList.add('visible'); 
  }

  function onPageLoad () {
    if(navigator.mediaDevices.getUserMedia) { 
      load()
        .then(loadedPosenet => { 
          showCamera(); 
          predictPose(loadedPosenet); 
      }); 
    }
  }

  return { 
    onPageLoad
  }; 
})(); 
