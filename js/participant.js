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