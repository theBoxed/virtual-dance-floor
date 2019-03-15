// function Dancer(userId, x, y) {
//   this.data = {
//     userId: userId, 
//     position: { x: 0, y: 0 },
//     pose: null,
//     color: [100]
//   }

//   this.update = function (pose) {
//     this.data.pose = pose;
//   }

// }



function Dancer(id, x, y) { 
  let userId = id; 
  let position = { x, y }; 
  let pose = null; 
  let color = [100]; 

  const update = (currPose) => { 
    pose = currPose;
    console.log('pose', pose); 
  }
  

  return {update, userId, pose, color}; 
}