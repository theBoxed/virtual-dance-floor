Scene = () => { 
  let poseNet = null; 
  const start = () => { 
    //initializes video
    let video = createCapture(VIDEO)
    video.size(width, height); 

    //initializes posenet
    poseNet = ml5.poseNet(video); 
    
    if (!poseNet || !video ) throw new Error('poseNet and or video did not load'); 
  }

  const getPoseNet = () => { 
    return poseNet; 
  }

  return { start, getPoseNet }; 
}

