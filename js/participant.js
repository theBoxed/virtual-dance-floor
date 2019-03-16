//All other dancers that are not yourself

const Participant = () => {
  //WHAT'S DIFFERENT
  //Loaded or done
  //When writing to firebase we are writing to an array of joints
  //When we receive data from FB we reset the joints array
  //Data from firebase is an array of joints that we loop through in the _drawPose
  //Participants don't need posenet

  //WHAT'S THE SAME
  //pose, color, userId
  
  let userId = null;
  let pose = null;
  let color = [200]; 

  const initialize = (user, userId) => {
    userId = userId;
    pose = user.pose;
    return {
      userId,
      pose,
      color
    }
  }

  const update = () => {

  }

  return {
    initialize,
    userId,
    update
  }




}