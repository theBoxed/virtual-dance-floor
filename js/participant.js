/**
  //All other dancers that are not yourself
  //WHAT'S DIFFERENT
  //Loaded or done
  //When writing to firebase we are writing to an array of joints
  //TODO: When we receive data from FB we reset the joints array
  //TODO: Data from firebase is an array of joints that we loop through in the _drawPose
  //Participants don't need posenet

  //WHAT'S THE SAME
  //pose, color, userId
*/
const Participant = () => {
  let _id = null;
  let _pose = null; 
  let color = [100]; 

  const update = () => {
    _findPosition()
  }

  const _findPosition = () => { 
    firebase
    .database()
    .ref(`users/${_id}`)
    .once('value')
    .then(snapshot => {
      _pose = snapshot.val().pose;
    });  
  }

  return {
    update, 
    get id(){ 
      return _id; 
    },
    set id(id){ 
      _id = id; 
    }, 
    set pose(pose){ 
      _pose = pose; 
    }, 
    get pose(){ 
      return _pose; 
    }
  }
}