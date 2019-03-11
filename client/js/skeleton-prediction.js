
const predictSekeleton = (() => {
  function load(webcam) {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (webcam.srcObject = stream))
        .then(() => posenet.load())
        .then(net => resolve(net))
        .catch(error => reject(error));
    });
  }

  function updatePose(settings, net) {
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;
    const minPartConfidence = .5;

    async function poseDetection(){
      let poses = [];
      const pose = await net.estimateSinglePose(
        settings.webcam,
        settings.imageScaleFactor,
        settings.lipHorizontal,
        settings.outputStride
      );
      poses.push(pose);
      console.log(poses);
    

    //Erase pixels in canvas and set them back to transparent black
    ctx.clearRect(0, 0, 800, 600);
    //Save the entire state of the canvas 
    ctx.save();
    //Flip the context horizontally
    ctx.scale(-1,1);
    //Flip video to match input stream
    ctx.translate(-800, 0);
    ctx.drawImage(settings.webcam, 0, 0, 800, 600);
    ctx.restore();

    poses.forEach(({score, keypoints}) => {
      draw.drawKeypoints(keypoints, minPartConfidence, ctx);
      draw.drawSkeleton(keypoints, minPartConfidence, ctx);
    })
    requestAnimationFrame(poseDetection)
  }

  poseDetection();
      
  }

  function predictPose(net, settings) {
    net
      .estimateSinglePose(
        settings.webcam,
        settings.imageScaleFactor,
        settings.flipHorizontal,
        settings.outputStride
      )
      .then(poseEstimate => {
        // console.log('poseEstimate', poseEstimate);
        updatePose(settings, net);
        // predictPose(net, settings);
      });
  }

  function showCamera(webcam) {
    const loadingText = document.getElementById('loading-text');
    loadingText.classList.add('hidden');
    webcam.classList.remove('hidden');
    webcam.classList.add('visible');
  }

  function onPageLoad(settings) {
    if (navigator.mediaDevices.getUserMedia) {
      load(settings.webcam).then(loadedPosenet => {
        showCamera(settings.webcam);
        predictPose(loadedPosenet, settings);
      });
    }
  }

  return {
    onPageLoad
  };
})();


