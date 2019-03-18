Scene = () => { 
  let poseNet = null; 
  const start = () => { 
    //initializes video
    let video = createCapture(VIDEO)
    video.size(width, height); 

    //initializes posenet
    poseNet = ml5.poseNet(video); 

    //checks to see if everything has loaded
    if (!poseNet || !video ) throw new Error('poseNet and or video did not load'); 

    //hides video
    video.hide(); 
  }

  const getPoseNet = () => { 
    return poseNet; 
  }

  return { start, getPoseNet }; 
}

