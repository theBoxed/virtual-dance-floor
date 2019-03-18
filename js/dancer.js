const Dancer = () => { 
  dancer = {}; 
  dancer.id = null; 
  dancer.pose = null; 
  dancer.color = null; 
  //when poseNet is loaded for this dancer
  dancer.loaded = false; 
  //when user has left tab or browser
  dancer.done = false; 

  dancer.update = () => { 
    if (loaded && !done) {
      //write pose to firebase
      firebase.database().ref(`users/${_id}`).set({pose});
    }
  }
  
  dancer.initialize = poseNet => { 
    //set up random userid
    this.id = Math.floor(Math.random() * 40000); 
    //contiously find new pose
    poseNet.on('pose', results => { 
      this.loaded = true; 
      _updatePose(results); 
    });  
  }

  dancer.remove = () => { 
    firebase.database().ref(`users/${_id}`).remove(); 
  }

  return { dancer }; 
}