const Dancer = () => { 
  let dancer = Object.assign({}, _draw(), _poseNet()); 
  dancer.id = null; 
  dancer.pose = null; 
  dancer.color = [100]; 
  dancer.done = false; 
  dancer.isReady = false; 
  dancer.posenetObjs = {}; 

  dancer.update = () => { 
    //write pose to firebase
    firebase.database().ref(`users/${this.id}`)
      .set({pose : this.pose});
      
    dancer.drawPose(this.pose)
  }

  dancer.initialize = poseNet => { 
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