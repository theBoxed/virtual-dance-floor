const Dancer = () => { 
  let leftButton, rightButton; 
  //initializes dancer object and gives it extra powers
  let dancer = Object.assign(
    { id: null, pose: null, color: [100], done: false, isReady: false, posenetObjs: {}, 
    rightButton : createButton('right')}, 
      _draw(), _poseNet()); 

  dancer.update = () => { 
    //write pose to firebase
    firebase.database().ref(`users/${this.id}`)
      .set({pose : this.pose});
    
    //draw pose
    dancer.drawPose(this.pose, leftButton, rightButton); 
  }

  dancer.initialize = poseNet => { 
    leftButton = createButton('left'); 
    rightButton = createButton('right'); 
    //set up random userid
    this.id = Math.floor(Math.random() * 40000); 
    
    //contiously find new pose
    poseNet.on('pose', results => { 
      dancer.pose = results; 
      dancer.isReady = true; 
      dancer.updatePose(results); 
    });  
  }

  dancer.remove = () => { 
    firebase.database().ref(`users/${this.id}`).remove(); 
  }

  return dancer; 
}