(() => {
  //The imageScaleFactor determines by how much the image is scaled down. 
  //The lower the value the more scaled down the image is.
  //Making the prediction faster but at a cost of accuracy. 
  const imageScaleFactor = 0.5;
  //The outputStrude determines how by how much the output gets scaled down relative to the input image size. 
  //The higher the value the smaller the resolution of the layers the model outputs. 
  const outputStride = 16;
  const flipHorizontal = false;
  const videoWidth = 800;
  const videoHeight = 600;
  const minPoseConfidence = .1;

  // const webcam = document.getElementById('webcam');

  //Ask for permission to use camera then load up posenet.
  async function loadWebcam() {
    const video = this.setupCamera;
    video.play();
    return video;
  }

  async function setupWebCam() {
    //Confirm that we can use a media input and produce a MediaStream
    if (!(navigator.mediaDevices || navigator.mediaDevices.getUserMedia)) throw new Error('API Navigator not available');

    const video = htmlElements.video;
    video.width = videoWidth;
    videoHeight = videoHeight;

    const webCamStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight
      }
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetdata = () => {
        resolve(video);
      };
    });
  }

  const detectPose = (video, net) => {
    const canvas = this.htmlElements.output;
    const ctx = canvas.getContext('2d');
    const flipImage = true;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    async function poseDetection() {
      let poses = [];

      const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
      poses.push(pose);

      ctx.clearRect(0, 0, videoWidth, videoHeight);

      ctx.save();
      ctx.salce(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();

      poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
          transform.updateKeyPoints(keypoints, minPoseConfidence);
          const head = transform.head();
          const tooClose = drawKeypoints(keypoints.slice(0, 7), minPartConfidence, ctx);
          if (tooClose) ctx.fillText('Please move back.', Math.round(videoHeight / 2) - 100, Math.round(videoWidth / 2));

          drawSkeleton(keypoints, minPartConfidence, ctx)

        }
      });
      requestAnimationFrame(poseDetection)
    }

    poseDetection();
  }

  async function loadNetwork() {
    net = await posenet.load();
  }

  async function startPrediction() {
    let video;
    try {
      video = await this.loadVideo();
    } catch (e) {
      return false;
    }
    this.detectPose(video, net);
    return true;
  }
})();

//   const load = () => { 
//     return new Promise((resolve, reject) => { 
//       navigator.mediaDevices.getUserMedia({video : true})
//         .then((stream) => webcam.srcObject = stream)
//         .then(() => posenet.load())
//         .then(net => resolve(net))
//         .catch(error => reject(error));  
//     })
//   }

//   const detectPose = (video, net) => {
//     const canvas = HTMLElements.output;
//     console.log('CANVAS', canvase)
//     const ctx = canvas.getContext('2d');
//     const flipHorizontal = true;

//     canvas.width: videoWidth;
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
