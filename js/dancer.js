const Dancer = () => { 
  let _id = null; 
  let pose = null; 
  let color = [100]; 
  let loaded = false; 
  let done = false; 

  const update = () => { 
    if (loaded && !done) {
      //write pose to firebase
      firebase.database().ref(`users/${_id}`).set({pose});
      //draw pose
      // _drawPose(pose, { color });
    }
  }
  
  const initialize = poseNet => { 
    //set up random userid
    _id = Math.floor(Math.random() * 40000); 
    //contiously find new pose
    poseNet.on('pose', results => { 
      loaded = true; 
      _updatePose(results); 
    });  
  }

  const remove = () => { 
    firebase.database().ref(`users/${_id}`).remove(); 
  }

  return Object.freeze({ update, initialize, remove,
    get id() { 
      return _id; 
    }
  }); 
}