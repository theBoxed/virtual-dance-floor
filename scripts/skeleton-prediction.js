const predictSekeleton = (() => {   
  
  function load (webcam) { 
    return new Promise((resolve, reject) => { 
      navigator.mediaDevices.getUserMedia({video : true})
        .then((stream) => webcam.srcObject = stream)
        .then(() => posenet.load())
        .then(net => resolve(net))
        .catch(error => reject(error));  
    })
  }

  function predictPose (net, settings) { 
    net.estimateSinglePose(settings.webcam, settings.imageScaleFactor, settings.flipHorizontal, settings.outputStride)
      .then((poseEstimate => { 
        console.log('poseEstimate', poseEstimate); 
        predictPose(net, settings); 
      })); 
  }

  function showCamera (webcam) { 
    const loadingText = document.getElementById('loading-text'); 
    loadingText.classList.add('hidden'); 
    webcam.classList.remove('hidden'); 
    webcam.classList.add('visible'); 
  }

  function onPageLoad (settings) {
    if(navigator.mediaDevices.getUserMedia) { 
      load(settings.webcam)
        .then(loadedPosenet => { 
          showCamera(settings.webcam);
          predictPose(loadedPosenet, settings); 
      }); 
    }
  }

  return { 
    onPageLoad
  }; 
})(); 
